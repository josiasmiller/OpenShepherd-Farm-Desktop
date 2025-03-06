
import { ipcMain } from "electron";

import { 
  animalSearch,
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
  getRemoveReasons,
  getSexes,
  getSpecies,
  getStates,
  getTagTypes,
  getTissueSampleContainerTypes,
  getTissueSampleTypes,
  getTissueTests,
  getTransferReasons,
} from "../database/index.js";

import { selectNewDb } from "../renderer/scripts/common/utils/dbSelect.js";
import { getPremises } from "../database/repositories/premises/getPremises.js";
import { getBirthTypes } from "../database/repositories/animal/births/getBirthTypes.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (event, queryParams) => {
    return animalSearch(queryParams);
  });

  ipcMain.handle("select-database", selectNewDb);

  ipcMain.handle("get-birth-types", getBirthTypes);

  ipcMain.handle("get-breeds", getBreeds);

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
};

