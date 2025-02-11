import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

// Helper function to get the current directory path in ES Modules
const getCurrentDirectory = () => {
  return path.dirname(new URL(import.meta.url).pathname);
};

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const currentDirectory = getCurrentDirectory(); // Get current directory

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(currentDirectory, 'preload.js'), // ensure preload.js is set correctly
      nodeIntegration: false, // don't use nodeIntegration in the renderer for security reasons
    },
  });

  // Adjust the file path for your renderer pages
  mainWindow.loadURL('file://' + path.join(currentDirectory, '../renderer/pages/index.html'));

  // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();
}

// Register the 'fetch-data' handler
ipcMain.handle('fetch-data', async () => {
  console.log("Main process handling fetch-data");
  // Here you can retrieve data from a database, API, or any other source
  // For now, let's return a mock response
  return { data: 'Some data from main process' };
});

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
