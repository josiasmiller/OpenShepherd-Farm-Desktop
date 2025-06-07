import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from "./ipcHandlers.js";
import path from "path";
import { fileURLToPath } from 'url';

// import { isRegistryVersion, APP_VERSION_TYPE } from '../config/version.js';

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

  const isRegistry = process.env.APP_VERSION_TYPE === 'registry';

  console.log("MITCH DEBUG!");

  if (isRegistry) {
    // Enable registry-specific features
      console.log("REGISTRY!!!!!");
  } else {
    // Standard behavior
      console.log("NOT REGISTRY!");
  }

  console.log("REG --> " + process.env.APP_VERSION_TYPE);
  console.log("======================");

  const currentDirectory = getCurrentDirectory();
  const preloadPath = path.join(currentDirectory, 'preload.cjs');
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
