
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
import {closeDb, DatabaseSession, databaseSession$, getDatabase, getDatabaseSession} from "./database/dbConnections";
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
    return animalSearch(queryParams);
  });

  ipcMain.handle("edit-existing-default", async (_, queryParams) => {
    return editExistingDefaultSettings(queryParams)
      .then(() => {
        mainWindow.webContents.send('default-settings-list-changed')
      });
  });

  ipcMain.handle("export-animal-notes-csv", async (_, animals: string[]) => {
    return writeAnimalNotesCsv(animals);
  });

  ipcMain.handle("export-drug-history-csv", async (_, animals: string[]) => {
    return writeDrugHistoryCsv(animals);
  });

  ipcMain.handle("export-tissue-test-results-csv", async (_, animals: string[]) => {
    return writeTissueTestResults(animals);
  });

  ipcMain.handle("export-registration", async (_, animals: string[], registrationType: "black" | "white" | "chocolate", signatureFilePath: string | null) => {

    return writeRegistration(animals, registrationType, signatureFilePath);
  });

  ipcMain.handle("open-database", async (_, ) => {
    return selectNewDb(mainWindow);
  });

  ipcMain.handle('close-database', async (_, ) => {
    return closeDb();
  });

  ipcMain.handle("select-png-file", async (_, ) => {
    return pngFileDialog(mainWindow);
  });

  ipcMain.handle("get-animal-identification", async (_, animalId: string) => {
    return getAnimalIdentification(animalId);
  });

  ipcMain.handle("get-birth-types", getBirthTypes);

  ipcMain.handle("get-breeds", async (_, queryParams) => {
    return getBreeds(queryParams);
  });

  ipcMain.handle("get-colors", getColors);

  ipcMain.handle("get-company-info", async (_, onlyGetRegistryCompanies) => {
    return getCompanies(onlyGetRegistryCompanies);
  });

  ipcMain.handle("get-contact-info", getContacts);

  ipcMain.handle("get-counties", getCounties);

  ipcMain.handle("get-countries", getCountries);

  ipcMain.handle("get-country-prefix-for-owner", async (_, ownerId: string, isCompany: boolean) => {
    return getCountryPrefixForOwner(ownerId, isCompany);
  });

  ipcMain.handle("get-death-reasons", getDeathReasons);

  ipcMain.handle("get-existing-defaults", getExistingDefaults);

  ipcMain.handle("get-flock-prefixes", getFlockPrefixes);

  ipcMain.handle("get-locations", getTagLocations);

  ipcMain.handle("get-pedigree", async (_, animalId) => {
    return getPedigree(animalId, 4); // TODO --> what depth to use?
  });

  ipcMain.handle("get-premise-info", getPremises);

  ipcMain.handle("get-remove-reasons", getRemoveReasons);

  ipcMain.handle("get-scrapie-flock-info", async (_, ownerId: string, isCompany: boolean) => {
    return getScrapieFlockInfo(ownerId, isCompany);
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

  ipcMain.handle("get-sexes", getSexes);

  ipcMain.handle("get-species", getSpecies);

  ipcMain.handle("get-states", getStates);

  ipcMain.handle("get-tag-types", getTagTypes);

  ipcMain.handle("get-tissue-sample-types", getTissueSampleTypes);

  ipcMain.handle("get-tissue-sample-container-types", getTissueSampleContainerTypes);

  ipcMain.handle("get-tissue-tests", getTissueTests);

  ipcMain.handle("get-transfer-reasons", getTransferReasons);

  ipcMain.handle("get-units", async (_, queryParams) => {
    return getUnits(queryParams);
  });

  ipcMain.handle("get-unit-types", getUnitTypes);

  ipcMain.handle("is-owner-company", async (_, ownerId) => {
    return isOwnerCompany(ownerId);
  });

  ipcMain.handle("is-database-loaded", () => {
    return getDatabase() !== null;
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
      return handleRegistryProcess(processType, species, sections);
    }
  );

  ipcMain.handle("database-state-check", handleDatabaseStateCheck);

  ipcMain.handle("resolve-database-issues",(_event, dbscr: DatabaseStateCheckResponse) => {
    return resolveDatabaseIssues(dbscr);
  });

  ipcMain.handle('set-store-selected-default', async (_event, value: DefaultSettingsResults) => {
    setStoreSelectedDefault(value)
    mainWindow.webContents.send('active-default-settings-changed')
  });

  ipcMain.handle('set-store-selected-species', (_event, value: Species) => {
    return promiseFrom(() => setStoreSelectedSpecies(value));
  });

  ipcMain.handle('set-store-selected-signature-file-path', (_event, value: string) => {
    return promiseFrom(() => setStoreSelectedFilepath(value));
  });

  ipcMain.handle("write-new-default-settings", async (_, queryParams) => {
    return writeNewDefaultSettings(queryParams)
      .then(() => {
        mainWindow.webContents.send('default-settings-list-changed')
      });
  });

  ipcMain.handle('query-database-session-info', (_event) => {
    return promiseFrom(() => getDatabaseSession())
  })

  databaseSession$.subscribe((dbSession: DatabaseSession | null) => {
    mainWindow.webContents.send('database-session-changed', dbSession && { path: dbSession.path }, false)
  })
};
