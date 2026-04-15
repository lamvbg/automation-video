/**
 * Preload script (ESM) — runs in the renderer process with limited Node.js access.
 * Exposes a safe IPC bridge via contextBridge.
 */

import electron from 'electron'
const { contextBridge, ipcRenderer } = electron

contextBridge.exposeInMainWorld('electronAPI', {
  onBackendLog: (callback) => ipcRenderer.on('backend-log', (_e, msg) => callback(msg)),
  onBrowserApiStatus: (callback) =>
    ipcRenderer.on('browser-api-status', (_e, available) => callback(available)),
  getStatus: () => ipcRenderer.invoke('get-status'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
})
