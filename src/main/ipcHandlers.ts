
import { ipcMain } from "electron";

import { 
  animalSearch,
  getColors,
  getCompanies, 
  getCounties, 
  getCountries,
  getExistingDefaults, 
  getLocations,
  getOwners,
  getStates,
} from "../database/index.js";

import { selectNewDb } from "../renderer/scripts/common/utils/dbSelect.js";
import { getPremises } from "../database/repositories/premises/getPremises.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (event, queryParams) => {
    return animalSearch(queryParams);
  });

  ipcMain.handle("select-database", selectNewDb);

  ipcMain.handle("get-colors", getColors);

  ipcMain.handle("get-company-info", getCompanies);

  ipcMain.handle("get-counties", getCounties);

  ipcMain.handle("get-countries", getCountries);

  ipcMain.handle("get-existing-defaults", getExistingDefaults);

  ipcMain.handle("get-locations", getLocations);

  ipcMain.handle("get-owner-info", getOwners);

  ipcMain.handle("get-premise-info", getPremises);

  ipcMain.handle("get-states", getStates);
};

