const { contextBridge, ipcRenderer } = require('electron');

import { 
  AnimalSearchRequest, 
  BreedRequest, 
  UnitRequest, 
  WriteNewDefaultParameters 
} from "../database";
import { AnimalInfo } from "../writers/helpers/animalInfo";

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchRequest) => ipcRenderer.invoke("animal-search", queryParams),
  exportAnimalNotesCsv: (animals: AnimalInfo[]) => ipcRenderer.invoke("export-animal-notes-csv", animals),
  exportDrugHistoryCsv: (animals: AnimalInfo[]) => ipcRenderer.invoke("export-drug-history-csv", animals),
  exportTissueTestResultsCsv: (animals: AnimalInfo[]) => ipcRenderer.invoke("export-tissue-test-results-csv", animals),
  getBirthTypes: () => ipcRenderer.invoke("get-birth-types"),
  getBreeds: (queryParams: BreedRequest) => ipcRenderer.invoke("get-breeds", queryParams),
  getColors: () => ipcRenderer.invoke("get-colors"),
  getCompanyInfo: (onlyGetRegistryCompanies: boolean) => ipcRenderer.invoke("get-company-info", onlyGetRegistryCompanies),
  getCounties: () => ipcRenderer.invoke("get-counties"),
  getCountries: () => ipcRenderer.invoke("get-countries"),
  getDeathReasons: () => ipcRenderer.invoke("get-death-reasons"),
  getDrugHistory: (animalId: string) => ipcRenderer.invoke("get-drug-history", animalId),
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
  showAlert: (options: { title: string; message: string; type?: "info" | "error" | "warning" | "question" }) => ipcRenderer.invoke("show-alert", options),
  writeNewDefaultSettings: (queryParams: WriteNewDefaultParameters) => ipcRenderer.invoke("write-new-default-settings", queryParams),
});

console.log("✅ Preload script loaded!"); // debug line