"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'), // ensure preload.js is set correctly
            nodeIntegration: false, // don't use nodeIntegration in the renderer for security reasons
        },
    });
    mainWindow.loadURL('file://' + path_1.default.join(__dirname, '../renderer/pages/index.html'));
    // Open the DevTools (optional)
    mainWindow.webContents.openDevTools();
}
// Register the 'fetch-data' handler
electron_1.ipcMain.handle('fetch-data', async () => {
    // Here you can retrieve data from a database, API, or any other source
    // For now, let's return a mock response
    return { data: 'Some data from main process' };
});
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
