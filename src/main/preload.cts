const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: () => ipcRenderer.invoke("animal-search"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});

console.log("✅ Preload script loaded!"); // Debugging line