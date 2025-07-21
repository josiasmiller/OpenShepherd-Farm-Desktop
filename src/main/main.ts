import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers } from "./ipcHandlers.js";
import path from "path";
import { fileURLToPath } from 'url';

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
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  registerIpcHandlers();
  console.log("main finished");
});
