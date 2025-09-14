import log from 'electron-log/main'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

log.initialize()
log.info('Starting main')

import {app, BrowserWindow} from 'electron';
import {registerIpcHandlers} from "./ipcHandlers";
import path from "path";

log.info('imports complete')



try {

  let mainWindow: BrowserWindow | null = null;

  app.whenReady().then(() => {

    mainWindow = new BrowserWindow({
      width: 1440,
      height: 900,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        nodeIntegration: false,
        contextIsolation: true,
      }
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    //Only automatically open the dev tools if
    //in develop mode.
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
    }

    registerIpcHandlers(mainWindow);
    console.log("main finished");
  });
}
catch (e) {
  log.info(`Main Error: ${e}`);
}

log.info('Main Script Executed')
