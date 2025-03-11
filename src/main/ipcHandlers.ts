
import { ipcMain } from "electron";

import { 
  animalSearch,
  getBirthTypes,
  getBreeds,
  getColors,
  getCompanies, 
  getCounties, 
  getCountries,
  getDeathReasons,
  getExistingDefaults, 
  getFlockPrefixes,
  getLocations,
  getOwners,
  getPremises,
  getRemoveReasons,
  getSexes,
  getSpecies,
  getStates,
  getTagTypes,
  getTissueSampleContainerTypes,
  getTissueSampleTypes,
  getTissueTests,
  getTransferReasons,
  getUnits,
  getUnitTypes,
  writeNewDefaultSettings,
} from "../database/index.js";

import { selectNewDb } from "../renderer/scripts/common/utils/dbSelect.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (_, queryParams) => {
    return animalSearch(queryParams);
  });

  ipcMain.handle("select-database", selectNewDb);

  ipcMain.handle("get-birth-types", getBirthTypes);

  ipcMain.handle("get-breeds", async (_, queryParams) => {
    return getBreeds(queryParams);
  });

  ipcMain.handle("get-colors", getColors);

  ipcMain.handle("get-company-info", getCompanies);

  ipcMain.handle("get-counties", getCounties);

  ipcMain.handle("get-countries", getCountries);

  ipcMain.handle("get-death-reasons", getDeathReasons);

  ipcMain.handle("get-existing-defaults", getExistingDefaults);

  ipcMain.handle("get-flock-prefixes", getFlockPrefixes);

  ipcMain.handle("get-locations", getLocations);

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

  ipcMain.handle("get-units", getUnits);

  ipcMain.handle("get-unit-types", getUnitTypes);

  ipcMain.handle("write-new-default-settings", async (_, queryParams) => {
    return writeNewDefaultSettings(queryParams);
  });
};

