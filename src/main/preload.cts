// import { contextBridge, ipcRenderer } from "electron";

// console.log("✅ Preload script loaded!"); // Debugging line

// contextBridge.exposeInMainWorld("electronAPI", {
//   requestData: () => ipcRenderer.invoke("fetch-data"),
//   selectDatabase: () => ipcRenderer.invoke("select-database"),
// });

// Change the extension of this file to .cts and use `require` for the import
const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ Preload script loaded!"); // Debugging line

contextBridge.exposeInMainWorld("electronAPI", {
  requestData: () => ipcRenderer.invoke("fetch-data"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});
