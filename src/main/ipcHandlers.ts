
import { dialog, ipcMain } from "electron";

import { 
  animalSearch,
  getAnimalIdentification,
  getBirthTypes,
  getBreeds,
  getColors,
  getCompanies, 
  getCounties, 
  getCountries,
  getDeathReasons,
  getExistingDefaults, 
  getFlockPrefixes,
  getOwners,
  getPremises,
  getRemoveReasons,
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
  writeNewDefaultSettings,
} from "../database/index.js";

import { selectNewDb } from "../scripts/dbSelect.js";
import { getDatabase } from "../database/dbConnections.js";
import { writeAnimalNotesCsv } from "../writers/csv/writeAnimalNotes.js";
import { writeDrugHistoryCsv } from "../writers/csv/writeDrugEvents.js";
import { writeTissueTestResults } from "../writers/csv/writeTissueTestResults.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (_, queryParams) => {
    return animalSearch(queryParams);
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

  ipcMain.handle("select-database", selectNewDb);

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

  ipcMain.handle("get-counties", getCounties);

  ipcMain.handle("get-countries", getCountries);

  ipcMain.handle("get-death-reasons", getDeathReasons);

  ipcMain.handle("get-existing-defaults", getExistingDefaults);

  ipcMain.handle("get-flock-prefixes", getFlockPrefixes);

  ipcMain.handle("get-locations", getTagLocations);

  ipcMain.handle("get-owner-info", getOwners);

  ipcMain.handle("get-premise-info", getPremises);

  ipcMain.handle("get-remove-reasons", getRemoveReasons);

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

  ipcMain.handle("is-database-loaded", () => {
    return getDatabase() !== null;
  });

  ipcMain.handle("write-new-default-settings", async (_, queryParams) => {
    return writeNewDefaultSettings(queryParams);
  });
};

