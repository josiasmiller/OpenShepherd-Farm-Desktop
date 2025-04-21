import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from "./ipcHandlers.js";
import path from "path";
import { fileURLToPath } from 'url';

let mainWindow: BrowserWindow | null;

const getCurrentDirectory = () => {
  return path.dirname(fileURLToPath(import.meta.url));
};

app.whenReady().then(() => {

  const currentDirectory = getCurrentDirectory();
  const preloadPath = path.join(currentDirectory, 'preload.cjs');
  const absolutePreloadPath = path.resolve(preloadPath);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: absolutePreloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const isDev : boolean = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.log("Running Dev");
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  registerIpcHandlers();
  
  mainWindow.webContents.openDevTools();
  console.log("main finished running without error");
});
