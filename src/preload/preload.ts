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
  OwnerType,
} from '@app/api';

import { AnimalAPI, DefaultsAPI, ExportAPI, LookupAPI, RegistryAPI, StoreAPI, SystemAPI } from '@app/api';
import { DatabaseSessionInfo } from "@app/api";
import { bindIpcCallback } from "@ipc/preload/core";
import {sessionManagementIpcProxy} from "@ipc/preload/sessionManagement";
import { SessionManagement } from "@ipc/api/sessionManagement";

// -------------------- Animal --------------------
const animalAPI : AnimalAPI = {
  search: (params: AnimalSearchRequest) => ipcRenderer.invoke("animal-search", params),
  getIdentification: (animalId: string) => ipcRenderer.invoke("get-animal-identification", animalId),
  getAnimalDetails: (animalIds: string[]) => ipcRenderer.invoke("get-animal-details", animalIds),
  getPedigree: (animalId: string) => ipcRenderer.invoke("get-pedigree", animalId),
}

// -------------------- Export --------------------
const exportAPI : ExportAPI = {
  notesCsv: (ids: string[]) => ipcRenderer.invoke("export-animal-notes-csv", ids),
  drugHistoryCsv: (ids: string[]) => ipcRenderer.invoke("export-drug-history-csv", ids),
  tissueTestResultsCsv: (ids: string[]) => ipcRenderer.invoke("export-tissue-test-results-csv", ids),
  registration: (animalIds: string[], type: "black" | "white" | "chocolate", sig: string | null) =>
    ipcRenderer.invoke("export-registration", animalIds, type, sig),
}

// -------------------- Defaults --------------------
const defaultsAPI : DefaultsAPI = {
  editExisting: (params: NewDefaultSettingsParameters) => ipcRenderer.invoke("edit-existing-default", params),
  writeNew: (params: NewDefaultSettingsParameters) => ipcRenderer.invoke("write-new-default-settings", params),
  getExisting: () => ipcRenderer.invoke("get-existing-defaults"),
  onDefaultSettingsListChanged: (callback) => {
    return bindIpcCallback("default-settings-list-changed", callback)
  },
  selectActiveDefaultSettings: (val: DefaultSettingsResults) => ipcRenderer.invoke("set-store-selected-default", val),
  queryActiveDefaultSettings: () => ipcRenderer.invoke('get-store-selected-default'),
  onActiveDefaultSettingsChanged: (callback) => {
    return bindIpcCallback('active-default-settings-changed', callback)
  },
  onActiveDefaultSettingsNotFound: (callback) => {
    return bindIpcCallback('active-default-settings-not-found', callback)
  }
}

// -------------------- Lookup --------------------
const lookupAPI : LookupAPI = {
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
  getOwnerById: (ownerId: string, ownerType: OwnerType) => ipcRenderer.invoke("get-owner-by-id", ownerId, ownerType),
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
}

// -------------------- Registry --------------------
const registryAPI : RegistryAPI = {
  parseBirths: () => ipcRenderer.invoke("registry-parse-births"),
  parseDeaths: () => ipcRenderer.invoke("registry-parse-deaths"),
  parseRegistrations: () => ipcRenderer.invoke("registry-parse-registrations"),
  parseTransfers: () => ipcRenderer.invoke("registry-parse-transfers"),
  process: (args: RegistryProcessRequest) => ipcRenderer.invoke("registry-process", args),
}

// -------------------- Store --------------------
const storeAPI : StoreAPI = {
  getSelectedDefault: () => ipcRenderer.invoke("get-store-selected-default"),
  getSelectedSpecies: () => ipcRenderer.invoke("get-store-selected-species"),
  getSelectedSignatureFilePath: () => ipcRenderer.invoke("get-store-selected-signature-file-path"),
  setSelectedDefault: (val: DefaultSettingsResults) => ipcRenderer.invoke("set-store-selected-default", val),
  setSelectedSpecies: (val: Species) => ipcRenderer.invoke("set-store-selected-species", val),
  setSelectedSignatureFilePath: (val: string) => ipcRenderer.invoke("set-store-selected-signature-file-path", val),
}

// -------------------- System --------------------
const systemAPI : SystemAPI = {
  databaseStateCheck: () => ipcRenderer.invoke("database-state-check"),
  resolveDatabaseIssues: (dbscr: DatabaseStateCheckResponse) => ipcRenderer.invoke("resolve-database-issues", dbscr),
  openDirectory: (path: string) => ipcRenderer.invoke("open-directory", path),
  openExternalURL: (url: string) => ipcRenderer.invoke("open-external-url", url),
  openDatabase: () => ipcRenderer.invoke('open-database'),
  selectPngFile: () => ipcRenderer.invoke("select-png-file"),
}

// -------------------- expose APIs --------------------
contextBridge.exposeInMainWorld("animalAPI", animalAPI);
contextBridge.exposeInMainWorld("defaultsAPI", defaultsAPI);
contextBridge.exposeInMainWorld("exportAPI", exportAPI);
contextBridge.exposeInMainWorld("lookupAPI", lookupAPI);
contextBridge.exposeInMainWorld("registryAPI", registryAPI);
contextBridge.exposeInMainWorld("storeAPI", storeAPI);
contextBridge.exposeInMainWorld("systemAPI", systemAPI);

contextBridge.exposeInMainWorld(SessionManagement.IPC_API_NAME, sessionManagementIpcProxy())

console.log("✅ Preload script loaded!");
