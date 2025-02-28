
import { ipcMain } from "electron";
import { animalSearch, getExistingDefaults, getOwners } from "../database/index.js";
import { selectNewDb } from "../renderer/scripts/common/utils/dbSelect.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (event, queryParams) => {
    return animalSearch(queryParams);
  });

  ipcMain.handle("get-existing-defaults", getExistingDefaults);

  ipcMain.handle("select-database", selectNewDb);

  ipcMain.handle("get-owner-info", getOwners);
};

