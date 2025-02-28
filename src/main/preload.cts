const { contextBridge, ipcRenderer } = require('electron');

import { AnimalSearchQueryParameters } from "../database";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchQueryParameters) => ipcRenderer.invoke("animal-search", queryParams),
  getCompanyInfo: () => ipcRenderer.invoke("get-company-info"),
  getExistingDefaults: () => ipcRenderer.invoke("get-existing-defaults"),
  getOwnerInfo: () => ipcRenderer.invoke("get-owner-info"),
  getPremiseInfo: () => ipcRenderer.invoke("get-premise-info"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});

console.log("✅ Preload script loaded!"); // debug line