/**
 * Manages spawning and killing the Python FastAPI backend process.
 * The backend.exe is bundled in resources/ when packaged,
 * or run directly via python during development.
 */

import { spawn } from 'child_process'
import path from 'path'
import http from 'http'
import fs from 'fs'
import electron from 'electron'
const { app } = electron
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let backendProcess = null

function getBackendPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend.exe')
  }
  return null
}

function getBackendCwd() {
  if (app.isPackaged) {
    return app.getPath('userData')
  }
  return path.join(__dirname, '..', '..', 'fb-fanpage-api')
}

export function startBackend(onLog) {
  const cwd = getBackendCwd()
  const exePath = getBackendPath()

  if (app.isPackaged && !fs.existsSync(cwd)) {
    fs.mkdirSync(cwd, { recursive: true })
  }

  // Copy bundled .env to userData on first run (never overwrite existing)
  if (app.isPackaged) {
    const envDest = path.join(cwd, '.env')
    const envSrc = path.join(process.resourcesPath, 'app.env')
    if (!fs.existsSync(envDest) && fs.existsSync(envSrc)) {
      fs.copyFileSync(envSrc, envDest)
    }
  }

  let proc
  if (app.isPackaged) {
    proc = spawn(exePath, [], { cwd, env: { ...process.env, APP_HOST: '127.0.0.1', APP_PORT: '8000', APP_DATA_DIR: cwd } })
  } else {
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'
    proc = spawn(pythonCmd, ['run_server.py'], {
      cwd,
      env: { ...process.env, APP_HOST: '127.0.0.1', APP_PORT: '8000' },
    })
  }

  proc.stdout.on('data', (data) => onLog?.(`[backend] ${data.toString().trim()}`))
  proc.stderr.on('data', (data) => onLog?.(`[backend:err] ${data.toString().trim()}`))
  proc.on('exit', (code) => onLog?.(`[backend] exited with code ${code}`))

  backendProcess = proc
  return proc
}

export function stopBackend() {
  if (backendProcess) {
    const pid = backendProcess.pid
    backendProcess = null
    if (pid) {
      // taskkill /T kills the entire process tree (uvicorn + worker processes)
      if (process.platform === 'win32') {
        spawn('taskkill', ['/PID', String(pid), '/T', '/F'], { detached: true, stdio: 'ignore' })
      } else {
        try { process.kill(-pid, 'SIGKILL') } catch (_) {}
      }
    }
  }
}

export function waitForBackend(timeoutMs = 30000, intervalMs = 500) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs
    function check() {
      const req = http.get('http://127.0.0.1:8000/health', (res) => {
        if (res.statusCode === 200) return resolve()
        tryAgain()
      })
      req.on('error', tryAgain)
      req.setTimeout(400, () => { req.destroy(); tryAgain() })
    }
    function tryAgain() {
      if (Date.now() >= deadline) return reject(new Error('Backend did not start in time'))
      setTimeout(check, intervalMs)
    }
    check()
  })
}

export function checkBrowserApi() {
  // Check via backend /browser/health so port is configured in .env (BROWSER_API_URL)
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:8000/api/v1/content/browser/health', (res) => {
      let body = ''
      res.on('data', chunk => { body += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(body)
          resolve(json?.data?.available === true)
        } catch {
          resolve(false)
        }
      })
    })
    req.on('error', () => resolve(false))
    req.setTimeout(3000, () => { req.destroy(); resolve(false) })
  })
}
