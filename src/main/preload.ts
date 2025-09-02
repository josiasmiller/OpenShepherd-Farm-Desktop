import { contextBridge, ipcRenderer } from "electron";
import {
  AnimalSearchRequest,
  BreedRequest,
  UnitRequest,
  NewDefaultSettingsParameters,
  DefaultSettingsResults,
  Species,
  RegistryProcessRequest,
  DatabaseStateCheckResponse,
} from "packages/api";

// Animal
contextBridge.exposeInMainWorld("animalAPI", {
  search: (params: AnimalSearchRequest) => ipcRenderer.invoke("animal-search", params),
  getIdentification: (animalId: string) => ipcRenderer.invoke("get-animal-identification", animalId),
  getPedigree: (animalId: string) => ipcRenderer.invoke("get-pedigree", animalId),
});

// Export
contextBridge.exposeInMainWorld("exportAPI", {
  notesCsv: (ids: string[]) => ipcRenderer.invoke("export-animal-notes-csv", ids),
  drugHistoryCsv: (ids: string[]) => ipcRenderer.invoke("export-drug-history-csv", ids),
  tissueTestResultsCsv: (ids: string[]) => ipcRenderer.invoke("export-tissue-test-results-csv", ids),
  registration: (animalIds: string[], type: "black" | "white" | "chocolate", sig: string | null) =>
    ipcRenderer.invoke("export-registration", animalIds, type, sig),
});

// Defaults
contextBridge.exposeInMainWorld("defaultsAPI", {
  editExisting: (params: NewDefaultSettingsParameters) => ipcRenderer.invoke("edit-existing-default", params),
  writeNew: (params: NewDefaultSettingsParameters) => ipcRenderer.invoke("write-new-default-settings", params),
  getExisting: () => ipcRenderer.invoke("get-existing-defaults"),
});

// Lookup
contextBridge.exposeInMainWorld("lookupAPI", {
  getBirthTypes: () => ipcRenderer.invoke("get-birth-types"),
  getBreeds: (params: BreedRequest) => ipcRenderer.invoke("get-breeds", params),
  getColors: () => ipcRenderer.invoke("get-colors"),
  getCountries: () => ipcRenderer.invoke("get-countries"),
  getCountryPrefixForOwner: (id: string, isCompany: boolean) =>
    ipcRenderer.invoke("get-country-prefix-for-owner", id, isCompany),
  getCounties: () => ipcRenderer.invoke("get-counties"),
  getDeathReasons: () => ipcRenderer.invoke("get-death-reasons"),
  getFlockPrefixes: () => ipcRenderer.invoke("get-flock-prefixes"),
  getLocations: () => ipcRenderer.invoke("get-locations"),
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
  getUnits: (params: UnitRequest) => ipcRenderer.invoke("get-units", params),
  getUnitTypes: () => ipcRenderer.invoke("get-unit-types"),
  getCompanyInfo: (onlyRegistry: boolean) => ipcRenderer.invoke("get-company-info", onlyRegistry),
  getContactInfo: () => ipcRenderer.invoke("get-contact-info"),
  getScrapieFlockInfo: (ownerId: string, isCompany: boolean) =>
    ipcRenderer.invoke("get-scrapie-flock-info", ownerId, isCompany),
  isOwnerCompany: (ownerId : string) => ipcRenderer.invoke("is-owner-company", ownerId),
});

// Registry
contextBridge.exposeInMainWorld("registryAPI", {
  parseBirths: () => ipcRenderer.invoke("registry-parse-births"),
  parseDeaths: () => ipcRenderer.invoke("registry-parse-deaths"),
  parseRegistrations: () => ipcRenderer.invoke("registry-parse-registrations"),
  parseTransfers: () => ipcRenderer.invoke("registry-parse-transfers"),
  process: (args: RegistryProcessRequest) => ipcRenderer.invoke("registry-process", args),
});

// Store
contextBridge.exposeInMainWorld("storeAPI", {
  getSelectedDefault: () => ipcRenderer.invoke("get-store-selected-default"),
  getSelectedSpecies: () => ipcRenderer.invoke("get-store-selected-species"),
  getSelectedSignatureFilePath: () => ipcRenderer.invoke("get-store-selected-signature-file-path"),
  setSelectedDefault: (val: DefaultSettingsResults) => ipcRenderer.send("set-store-selected-default", val),
  setSelectedSpecies: (val: Species) => ipcRenderer.send("set-store-selected-species", val),
  setSelectedSignatureFilePath: (val: string) => ipcRenderer.send("set-store-selected-signature-file-path", val),
});

// System
contextBridge.exposeInMainWorld("systemAPI", {
  databaseStateCheck: () => ipcRenderer.invoke("database-state-check"),
  resolveDatabaseIssues: (dbscr: DatabaseStateCheckResponse) => ipcRenderer.invoke("resolve-database-issues", dbscr),
  isDatabaseLoaded: () => ipcRenderer.invoke("is-database-loaded"),
  openDirectory: (path: string) => ipcRenderer.invoke("open-directory", path),
  openExternalURL: (url: string) => ipcRenderer.invoke("open-external-url", url),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
  selectPngFile: () => ipcRenderer.invoke("select-png-file"),
});

console.log("✅ Preload script loaded!");
