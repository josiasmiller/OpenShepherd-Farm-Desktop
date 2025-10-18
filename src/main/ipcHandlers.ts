
import { BrowserWindow, ipcMain, shell } from "electron";

import { 
  animalSearch,
  editExistingDefaultSettings,
  getAnimalIdentification,
  getBirthTypes,
  getBreeds,
  getColors,
  getCompanies, 
  getContacts,
  getCounties, 
  getCountries,
  getCountryPrefixForOwner,
  getDeathReasons,
  getExistingDefaults, 
  getFlockPrefixes,
  getPedigree,
  getPremises,
  getRemoveReasons,
  getScrapieFlockInfo,
  getSexes,
  getSpecies,
  getStates,
  getTagLocations,
  getTagTypes,
  getTissueSampleContainerTypes,
  getTissueSampleTypes,
  getTissueTests,
  getTransferReasons,
  getUnits,
  getUnitTypes,
  isOwnerCompany,
  writeNewDefaultSettings,
} from "./database";

import { pngFileDialog } from "./selectPng";
import { selectNewDb } from "./dbSelect";
import {getDatabase, isDatabaseInitialized} from "./database/dbConnections";
import { writeAnimalNotesCsv } from "./writers/csv/writeAnimalNotes";
import { writeDrugHistoryCsv } from "./writers/csv/writeDrugEvents";
import { writeTissueTestResults } from "./writers/csv/writeTissueTestResults";

import { writeRegistration } from "./writers/pdf/writeRegistration";

import { birthParser } from "./registry/processing/impl/births/parser/birthParser";
import { deathParser } from "./registry/processing/impl/deaths/parser/deathParser";
import { registrationParser } from "./registry/processing/impl/registrations/parser/registrationParser";
import { transferParser } from "./registry/processing/impl/transfers/parser/transferParser";
import { handleDatabaseStateCheck } from "./registry/processing/ipc/handleDatabaseStateCheck";
import {DatabaseStateCheckResponse, DefaultSettingsResults} from "packages/api";
import { handleRegistryProcess } from "./registry/processing/ipc/handleRegistryProcess";
import { resolveDatabaseIssues } from "./registry/processing/ipc/resolveDatabaseStateIssues";

import { RegistryProcessRequest, Species } from "packages/api";
import { getStoreSelectedDefault, setStoreSelectedDefault } from "./store/impl/selectedDefault";
import { getStoreSelectedSpecies, setStoreSelectedSpecies } from "./store/impl/selectedSpecies";
import { getStoreSelectedFilepath, setStoreSelectedFilepath } from "./store/impl/selectedSignatureFilepath";
import {promiseFrom} from "packages/core";

export const registerIpcHandlers = (mainWindow: BrowserWindow) => {
  
  ipcMain.handle("animal-search", async (_, queryParams) => {
    return animalSearch(getDatabase(), queryParams);
  });

  ipcMain.handle("edit-existing-default", async (_, queryParams) => {
    return editExistingDefaultSettings(getDatabase(), queryParams);
  });

  ipcMain.handle("export-animal-notes-csv", async (_, animals: string[]) => {
    return writeAnimalNotesCsv(getDatabase(), animals);
  });

  ipcMain.handle("export-drug-history-csv", async (_, animals: string[]) => {
    return writeDrugHistoryCsv(getDatabase(), animals);
  });

  ipcMain.handle("export-tissue-test-results-csv", async (_, animals: string[]) => {
    return writeTissueTestResults(getDatabase(), animals);
  });

  ipcMain.handle("export-registration", async (_, animals: string[], registrationType: "black" | "white" | "chocolate", signatureFilePath: string | null) => {
    return writeRegistration(getDatabase(), animals, registrationType, signatureFilePath);
  });

  ipcMain.handle("select-database", async (_, ) => {
    return selectNewDb(mainWindow);
  });

  ipcMain.handle("select-png-file", async (_, ) => {
    return pngFileDialog(mainWindow);
  });

  ipcMain.handle("get-animal-identification", async (_, animalId: string) => {
    return getAnimalIdentification(getDatabase(), animalId);
  });

  ipcMain.handle("get-birth-types", async (_) => {
    return getBirthTypes(getDatabase())
  });

  ipcMain.handle("get-breeds", async (_, queryParams) => {
    return getBreeds(getDatabase(), queryParams);
  });

  ipcMain.handle("get-colors", (_) => {
    getColors(getDatabase())
  });

  ipcMain.handle("get-company-info", async (_, onlyGetRegistryCompanies) => {
    return getCompanies(getDatabase(), onlyGetRegistryCompanies);
  });

  ipcMain.handle("get-contact-info", async (_) => {
    return getContacts(getDatabase())
  });

  ipcMain.handle("get-counties", async (_) => {
    return getCounties(getDatabase())
  });

  ipcMain.handle("get-countries", async (_) => {
    return getCountries(getDatabase());
  });

  ipcMain.handle("get-country-prefix-for-owner", async (_, ownerId: string, isCompany: boolean) => {
    return getCountryPrefixForOwner(getDatabase(), ownerId, isCompany);
  });

  ipcMain.handle("get-death-reasons", async (_) => {
    return getDeathReasons(getDatabase());
  });

  ipcMain.handle("get-existing-defaults", async (_) => {
    return getExistingDefaults(getDatabase());
  });

  ipcMain.handle("get-flock-prefixes", async (_) => {
    return getFlockPrefixes(getDatabase());
  });

  ipcMain.handle("get-locations", async (_) => {
    return getTagLocations(getDatabase());
  });

  ipcMain.handle("get-pedigree", async (_, animalId) => {
    return getPedigree(getDatabase(), animalId, 4); // TODO --> what depth to use?
  });

  ipcMain.handle("get-premise-info", async (_) => {
    return getPremises(getDatabase());
  });

  ipcMain.handle("get-remove-reasons", async (_) => {
    return getRemoveReasons(getDatabase());
  });

  ipcMain.handle("get-scrapie-flock-info", async (_, ownerId: string, isCompany: boolean) => {
    return getScrapieFlockInfo(getDatabase(), ownerId, isCompany);
  });

  ipcMain.handle('get-store-selected-default', (): DefaultSettingsResults | null => {
    return getStoreSelectedDefault();
  });

  ipcMain.handle('get-store-selected-species', (): Species | null => {
    return getStoreSelectedSpecies();
  });

  ipcMain.handle("get-store-selected-signature-file-path", (): string => {
    return getStoreSelectedFilepath();
  });

  ipcMain.handle("get-sexes", async (_) => {
    return getSexes(getDatabase());
  });

  ipcMain.handle("get-species", async (_) => {
    return getSpecies(getDatabase());
  });

  ipcMain.handle("get-states", async (_) => {
    return getStates(getDatabase());
  });

  ipcMain.handle("get-tag-types", async (_) => {
    return getTagTypes(getDatabase());
  });

  ipcMain.handle("get-tissue-sample-types", async (_) => {
    return getTissueSampleTypes(getDatabase());
  });

  ipcMain.handle("get-tissue-sample-container-types", async (_) => {
    return getTissueSampleContainerTypes(getDatabase());
  });

  ipcMain.handle("get-tissue-tests", async (_) => {
    return getTissueTests(getDatabase());
  });

  ipcMain.handle("get-transfer-reasons", async (_) => {
    return getTransferReasons(getDatabase());
  });

  ipcMain.handle("get-units", async (_, queryParams) => {
    return getUnits(getDatabase(), queryParams);
  });

  ipcMain.handle("get-unit-types", async (_) => {
    return getUnitTypes(getDatabase());
  });

  ipcMain.handle("is-owner-company", async (_, ownerId) => {
    return isOwnerCompany(getDatabase(), ownerId);
  });

  ipcMain.handle("is-database-loaded", () => {
    return isDatabaseInitialized();
  });

  ipcMain.handle('open-directory', async (_event, path) => {
    return shell.openPath(path);
  });

  ipcMain.handle("open-external-url", async (_, url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL'); // security check, we only want valid URLs sent
    }
    await shell.openExternal(url);
  });

  ipcMain.handle('registry-parse-births', async (_, ) => {
    return birthParser(mainWindow);
  });

  ipcMain.handle('registry-parse-deaths', async (_, ) => {
    return deathParser(mainWindow);
  });

  ipcMain.handle('registry-parse-registrations', async (_, ) => {
    return registrationParser(mainWindow);
  });

  ipcMain.handle('registry-parse-transfers', async (_, ) => {
    return transferParser(mainWindow);
  });

  ipcMain.handle(
    "registry-process",
    async (_event, args: RegistryProcessRequest) => {
      const { processType, species, sections } = args;
      return handleRegistryProcess(getDatabase(), processType, species, sections);
    }
  );

  ipcMain.handle("database-state-check", async (_) => {
    return handleDatabaseStateCheck(getDatabase());
  });

  ipcMain.handle("resolve-database-issues",(_event, dbscr: DatabaseStateCheckResponse) => {
    return resolveDatabaseIssues(getDatabase(), dbscr);
  });

  ipcMain.handle('set-store-selected-default', (_event, value: DefaultSettingsResults) => {
    return promiseFrom(() => setStoreSelectedDefault(value));
  });

  ipcMain.handle('set-store-selected-species', (_event, value: Species) => {
    return promiseFrom(() => setStoreSelectedSpecies(value));
  });

  ipcMain.handle('set-store-selected-signature-file-path', (_event, value: string) => {
    return promiseFrom(() => setStoreSelectedFilepath(value));
  });

  ipcMain.handle("write-new-default-settings", async (_, queryParams) => {
    return writeNewDefaultSettings(getDatabase(), queryParams);
  });
};
