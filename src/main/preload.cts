const { contextBridge, ipcRenderer } = require('electron');

import { AnimalSearchQueryParameters, getDeathReasons } from "../database";
import { getBirthTypes } from "../database/repositories/animal/births/getBirthTypes";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchQueryParameters) => ipcRenderer.invoke("animal-search", queryParams),
  getBirthTypes: () => ipcRenderer.invoke("get-birth-types"),
  getBreeds: () => ipcRenderer.invoke("get-breeds"),
  getColors: () => ipcRenderer.invoke("get-colors"),
  getCompanyInfo: () => ipcRenderer.invoke("get-company-info"),
  getCounties: () => ipcRenderer.invoke("get-counties"),
  getCountries: () => ipcRenderer.invoke("get-countries"),
  getDeathReasons: () => ipcRenderer.invoke("get-death-reasons"),
  getExistingDefaults: () => ipcRenderer.invoke("get-existing-defaults"),
  getFlockPrefixes: () => ipcRenderer.invoke("get-flock-prefixes"),
  getLocations: () => ipcRenderer.invoke("get-locations"),
  getOwnerInfo: () => ipcRenderer.invoke("get-owner-info"),
  getPremiseInfo: () => ipcRenderer.invoke("get-premise-info"),
  getRemoveReasons: () => ipcRenderer.invoke("get-remove-reasons"),
  getSexes: () => ipcRenderer.invoke("get-sexes"),
  getSpecies: () => ipcRenderer.invoke("get-species"),
  getStates: () => ipcRenderer.invoke("get-states"),
  getTagTypes: () => ipcRenderer.invoke("get-tag-types"),
  getTissueSampleTypes: () => ipcRenderer.invoke("get-tissue-sample-types"),
  getTissueSampleContainerTypes: () => ipcRenderer.invoke("get-tissue-sample-container-types"),
  getTissueTests: () => ipcRenderer.invoke("get-tissue-tests"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
});

console.log("✅ Preload script loaded!"); // debug line