const { contextBridge, ipcRenderer } = require('electron');

import { AnimalSearchQueryParameters } from "../database";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchQueryParameters) => ipcRenderer.invoke("animal-search", queryParams),
  getExistingDefaults: () => ipcRenderer.invoke("get-existing-defaults"),
  getOwnerInfo: () => ipcRenderer.invoke("get-owner-info"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});

console.log("✅ Preload script loaded!"); // debug line