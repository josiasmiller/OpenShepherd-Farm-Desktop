import { app, BrowserWindow } from 'electron';
import path from 'path';
import { registerIpcHandlers } from "./ipcHandlers.js";

// Helper function to get the current directory path in ES Modules
const getCurrentDirectory = () => {
  return path.dirname(new URL(import.meta.url).pathname);
};

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  let currentDirectory = getCurrentDirectory();
  currentDirectory = currentDirectory.replace(/^\/+/, ''); 
  const preloadPath = path.join(currentDirectory, 'preload.cjs'); // Form the relative path
  const absolutePreloadPath = path.resolve(preloadPath);         // Ensure it’s an absolute path

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: absolutePreloadPath,
      nodeIntegration: false, // don't use nodeIntegration in the renderer for security reasons
      contextIsolation: true,  // This must be true for `contextBridge` to work
    },
  });

  mainWindow.loadURL('file://' + path.join(currentDirectory, '../renderer/pages/index.html'));

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
