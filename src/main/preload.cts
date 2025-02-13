const { contextBridge, ipcRenderer } = require('electron');

console.log("✅ Preload script loaded!"); // Debugging line

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: () => ipcRenderer.invoke("animal-search"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});
