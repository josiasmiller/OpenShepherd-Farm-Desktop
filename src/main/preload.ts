import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  requestData: () => ipcRenderer.invoke("fetch-data"),
});

// database selection
contextBridge.exposeInMainWorld("electronAPI", {
  selectDatabase: () => ipcRenderer.invoke("select-database")
});
