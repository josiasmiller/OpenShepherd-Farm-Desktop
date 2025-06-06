import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from "./ipcHandlers";
import path from "path";
import { fileURLToPath } from 'url';

import { isRegistryVersion, APP_VERSION_TYPE } from '../config/version';

let mainWindow: BrowserWindow | null;

const getPlatformIcon = () => {
  if (process.platform === 'win32') {
    return path.join(getCurrentDirectory(), '..', 'renderer', 'assets', 'icon.ico');
  } else if (process.platform === 'darwin') {
    return path.join(getCurrentDirectory(), '..', 'renderer', 'assets', 'icon.icns');
  } else {
    return path.join(getCurrentDirectory(), 'assets', 'AnimalTrakker_icon_512x512.png');
  }
};


const getCurrentDirectory = () => {
  return path.dirname(fileURLToPath(import.meta.url));
};

app.whenReady().then(() => {

  console.log("Build Farm Desktop: " + APP_VERSION_TYPE);
  console.log("MITCH DEBUG!");
  console.log(isRegistryVersion());
  console.log("======================");

  const currentDirectory = getCurrentDirectory();
  const preloadPath = path.join(currentDirectory, 'preload.js');
  const absolutePreloadPath = path.resolve(preloadPath);

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    icon: getPlatformIcon(),
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
    mainWindow.webContents.openDevTools();
  } else {
    const indexHtml = path.join(getCurrentDirectory(), '..', 'renderer', 'index.html'); // for now, getCurrentDirectory routes to the `main.js`
    mainWindow.loadFile(indexHtml);
  }

  registerIpcHandlers();
  console.log("main finished");
});
