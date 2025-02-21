import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerIpcHandlers } from "./ipcHandlers.js";
import { fileURLToPath } from 'url';


const getCurrentDirectory = () => {
  return path.dirname(fileURLToPath(import.meta.url));
};

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const currentDirectory = getCurrentDirectory();
  const preloadPath = path.join(currentDirectory, 'preload.cjs');
  const absolutePreloadPath = path.resolve(preloadPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: absolutePreloadPath,
      nodeIntegration: false, // don't use nodeIntegration in the renderer for security reasons
      contextIsolation: true,  // This must be true for `contextBridge` to work
    },
  });

  const indexPath = path.resolve(path.join(currentDirectory, '..', 'renderer', 'pages', 'index.html'));
  mainWindow.loadURL('file://' + indexPath);

  // Register all IPC handlers in ipcHandlers.ts
  registerIpcHandlers();

  // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
