const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("electronAPI", {
  // nothing to expose yet
});

console.log("✅ Preload script loaded!"); // debug line