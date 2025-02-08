import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  requestData: () => ipcRenderer.invoke("fetch-data"),
});
