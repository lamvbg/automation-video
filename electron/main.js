/**
 * Electron main process (ESM)
 * - Spawns the Python FastAPI backend
 * - Shows a loading window while backend starts
 * - Loads the React frontend once backend is ready
 * - Warns the user if anti-detect browser API (port 19995) is not available
 */

import electron from 'electron'
const { app, BrowserWindow, ipcMain, shell } = electron
import path from 'path'
import { fileURLToPath } from 'url'
import { startBackend, stopBackend, waitForBackend, checkBrowserApi } from './backend.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = !app.isPackaged

let mainWindow = null
let loadingWindow = null

// ── Loading window ────────────────────────────────────────────────────────────

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 420,
    height: 320,
    resizable: false,
    frame: false,
    center: true,
    show: false,
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  loadingWindow.loadFile(path.join(__dirname, 'loading.html'))
  loadingWindow.once('ready-to-show', () => loadingWindow.show())
}

// ── Main window ───────────────────────────────────────────────────────────────

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
    // F12 to toggle DevTools in production for debugging
    mainWindow.webContents.on('before-input-event', (_e, input) => {
      if (input.key === 'F12') mainWindow.webContents.openDevTools()
    })
  }

  mainWindow.once('ready-to-show', () => {
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close()
      loadingWindow = null
    }
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => { mainWindow = null })
}

// ── IPC handlers ──────────────────────────────────────────────────────────────

ipcMain.handle('get-status', async () => {
  const browserAvailable = await checkBrowserApi()
  return { browserAvailable }
})

ipcMain.on('open-external', (_e, url) => shell.openExternal(url))

// ── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  createLoadingWindow()

  const sendLog = (msg) => {
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.webContents.send('backend-log', msg)
    }
  }

  startBackend(sendLog)

  checkBrowserApi().then((available) => {
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.webContents.send('browser-api-status', available)
    }
  })

  try {
    sendLog('Đang chờ backend khởi động...')
    await waitForBackend(60000)
    sendLog('Backend đã sẵn sàng!')
  } catch (err) {
    sendLog(`Lỗi: ${err.message}`)
  }

  createMainWindow()
})

app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => stopBackend())

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
