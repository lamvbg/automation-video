/**
 * Wrapper that removes ELECTRON_RUN_AS_NODE (set by VSCode/Claude extension)
 * before spawning the real Electron binary.
 * Required so Electron runs as a proper desktop app, not as plain Node.js.
 */
const { spawn } = require('child_process')
const electronPath = require('electron') // npm package exports the binary path

const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE

const proc = spawn(electronPath, ['.'], { stdio: 'inherit', env })
proc.on('close', (code) => process.exit(code || 0))
