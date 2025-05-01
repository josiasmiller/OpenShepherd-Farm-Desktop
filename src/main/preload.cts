const { contextBridge, ipcRenderer } = require('electron');

import { 
  AnimalSearchRequest, 
  BreedRequest, 
  getAnimalIdentification, 
  UnitRequest, 
  WriteNewDefaultParameters 
} from "../database";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchRequest) => ipcRenderer.invoke("animal-search", queryParams),
  exportAnimalNotesCsv: (animals: string[]) => ipcRenderer.invoke("export-animal-notes-csv", animals),
  exportDrugHistoryCsv: (animals: string[]) => ipcRenderer.invoke("export-drug-history-csv", animals),
  exportTissueTestResultsCsv: (animals: string[]) => ipcRenderer.invoke("export-tissue-test-results-csv", animals),
  getAnimalIdentification: (animalId: string) => ipcRenderer.invoke("get-animal-identification", animalId),
  getBirthTypes: () => ipcRenderer.invoke("get-birth-types"),
  getBreeds: (queryParams: BreedRequest) => ipcRenderer.invoke("get-breeds", queryParams),
  getColors: () => ipcRenderer.invoke("get-colors"),
  getCompanyInfo: (onlyGetRegistryCompanies: boolean) => ipcRenderer.invoke("get-company-info", onlyGetRegistryCompanies),
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
  getTransferReasons: () => ipcRenderer.invoke("get-transfer-reasons"),
  getUnits: (queryParams: UnitRequest) => ipcRenderer.invoke("get-units", queryParams),
  getUnitTypes: () => ipcRenderer.invoke("get-unit-types"),
  isDatabaseLoaded: () => ipcRenderer.invoke("is-database-loaded"),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
  writeNewDefaultSettings: (queryParams: WriteNewDefaultParameters) => ipcRenderer.invoke("write-new-default-settings", queryParams),
});

console.log("✅ Preload script loaded!"); // debug line