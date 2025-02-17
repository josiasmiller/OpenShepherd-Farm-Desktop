const { contextBridge, ipcRenderer } = require('electron');

import { AnimalSearchQueryParameters } from "../database/queries/animalSearch";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchQueryParameters) => ipcRenderer.invoke("animal-search", queryParams),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});

console.log("✅ Preload script loaded!"); // debug line