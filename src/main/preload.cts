const { contextBridge, ipcRenderer } = require('electron');

import { AnimalSearchQueryParameters } from "../database";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchQueryParameters) => ipcRenderer.invoke("animal-search", queryParams),
  animalDefaults: () => ipcRenderer.invoke("animal-defaults"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});

console.log("✅ Preload script loaded!"); // debug line