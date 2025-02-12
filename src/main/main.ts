import { app, BrowserWindow, dialog, ipcMain } from 'electron';
// import sqlite3 from "sqlite3";
import path from 'path';

// Helper function to get the current directory path in ES Modules
const getCurrentDirectory = () => {
  return path.dirname(new URL(import.meta.url).pathname);
};

let mainWindow: BrowserWindow | null = null;
let databasePath: string | null = null;

function createWindow() {
  const currentDirectory = getCurrentDirectory(); // Get current directory

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(currentDirectory, 'preload.js'), // ensure preload.js is set correctly
      nodeIntegration: false, // don't use nodeIntegration in the renderer for security reasons
    },
  });

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

// Function to open a file dialog and select database
ipcMain.handle("select-database", async () => {
    const { filePaths } = await dialog.showOpenDialog({
        title: "Select Database File",
        properties: ["openFile"],
        filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }]
    });

    if (filePaths.length > 0) {
        databasePath = filePaths[0]; // Save the selected file path
        return databasePath;
    }

    return null; // No file selected
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
