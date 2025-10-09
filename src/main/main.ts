import log from 'electron-log/main'
import {app, BrowserWindow, dialog, ipcMain, type IpcMainInvokeEvent} from 'electron';
import {registerIpcHandlers} from "./ipcHandlers";
import {SessionManagement} from "@ipc/api/sessionManagement";

declare const LANDING_WINDOW_WEBPACK_ENTRY: string;
declare const LANDING_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

log.initialize()
log.info('Starting main')

var landingWindow: BrowserWindow | null = null;
var sessionWindows: Map<string,BrowserWindow> = new Map();

ipcMain.handle(SessionManagement.CHANNEL_OPEN_SESSION, (event: IpcMainInvokeEvent) => {
  const clientWindow = BrowserWindow.fromId(event.frameId)
  if (clientWindow) {
    selectDatabaseFile(clientWindow)
  }
})

app.whenReady().then(() => {
  landingWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      preload: LANDING_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  landingWindow.loadURL(LANDING_WINDOW_WEBPACK_ENTRY);

  //Only automatically open the dev tools if
  //in develop mode.
  if (!app.isPackaged) {
    landingWindow.webContents.openDevTools();
  }

  registerIpcHandlers(landingWindow);
  console.log("main finished");
});

async function openNewSession(parentWindow: BrowserWindow): Promise<void> {
  const dbFilePath = await selectDatabaseFile(parentWindow)

}

async function selectDatabaseFile(parentWindow: BrowserWindow){
  const result = await dialog.showOpenDialog(parentWindow, {
    title: "Select Database File",
    properties: ["openFile"],
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite", "sqlite3"] }],
  });

  return (!result.canceled) ? result.filePaths[0] : null
}
