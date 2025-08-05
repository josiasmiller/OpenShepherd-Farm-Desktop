// eslint-disable-next-line @typescript-eslint/no-var-requires
import { contextBridge, ipcRenderer } from 'electron';

import {
  AnimalSearchRequest, 
  BreedRequest, 
  UnitRequest, 
  NewDefaultSettingsParameters, 
  DefaultSettingsResults,
  Species
} from "../database";

import { RegistryProcessRequest } from '../registry/processing/core/types';

contextBridge.exposeInMainWorld("electronAPI", {
  animalSearch: (queryParams: AnimalSearchRequest) => ipcRenderer.invoke("animal-search", queryParams),
  editExistingDefaultSettings: (queryParams: NewDefaultSettingsParameters) => ipcRenderer.invoke("edit-existing-default", queryParams),
  exportAnimalNotesCsv: (animals: string[]) => ipcRenderer.invoke("export-animal-notes-csv", animals),
  exportDrugHistoryCsv: (animals: string[]) => ipcRenderer.invoke("export-drug-history-csv", animals),
  exportTissueTestResultsCsv: (animals: string[]) => ipcRenderer.invoke("export-tissue-test-results-csv", animals),
  exportRegistration: (animals: string[], registrationType: "black" | "white" | "chocolate") => ipcRenderer.invoke("export-registration", animals, registrationType),
  getAnimalIdentification: (animalId: string) => ipcRenderer.invoke("get-animal-identification", animalId),
  getBirthTypes: () => ipcRenderer.invoke("get-birth-types"),
  getBreeds: (queryParams: BreedRequest) => ipcRenderer.invoke("get-breeds", queryParams),
  getColors: () => ipcRenderer.invoke("get-colors"),
  getCompanyInfo: (onlyGetRegistryCompanies: boolean) => ipcRenderer.invoke("get-company-info", onlyGetRegistryCompanies),
  getContactInfo: () => ipcRenderer.invoke("get-contact-info"),
  getCounties: () => ipcRenderer.invoke("get-counties"),
  getCountries: () => ipcRenderer.invoke("get-countries"),
  getDeathReasons: () => ipcRenderer.invoke("get-death-reasons"),
  getExistingDefaults: () => ipcRenderer.invoke("get-existing-defaults"),
  getFlockPrefixes: () => ipcRenderer.invoke("get-flock-prefixes"),
  getLocations: () => ipcRenderer.invoke("get-locations"),
  getPedigree: (animalId: string) => ipcRenderer.invoke("get-peidgree", animalId),
  getPremiseInfo: () => ipcRenderer.invoke("get-premise-info"),
  getRemoveReasons: () => ipcRenderer.invoke("get-remove-reasons"),
  getStoreSelectedDefault: (): Promise<DefaultSettingsResults | null> => ipcRenderer.invoke('get-store-selected-default'),
  getStoreSelectedSpecies: (): Promise<Species | null> => ipcRenderer.invoke('get-store-selected-species'),
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
  openDirectory: (path: string) => ipcRenderer.invoke('open-directory', path),
  openExternalURL: (url: string) => ipcRenderer.invoke("open-external-url", url),
  registryParseBirths: () => ipcRenderer.invoke("registry-parse-births"),
  registryParseRegistrations: () => ipcRenderer.invoke("registry-parse-registrations"),
  registryProcess: (args: RegistryProcessRequest) => ipcRenderer.invoke("registry-process", args),
  selectDatabase: () => ipcRenderer.invoke("select-database"),
  setStoreSelectedDefault: (value: DefaultSettingsResults) => ipcRenderer.send('set-store-selected-default', value),
  setStoreSelectedSpecies: (value: Species) => ipcRenderer.send('set-store-selected-species', value),
  writeNewDefaultSettings: (queryParams: NewDefaultSettingsParameters) => ipcRenderer.invoke("write-new-default-settings", queryParams),
});

console.log("✅ Preload script loaded!"); // debug line
