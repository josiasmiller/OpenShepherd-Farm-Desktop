
import { ipcMain } from "electron";
import { animalSearch, getExistingDefaults } from "../database/index.js";
// import { getExistingDefaults } from "../database";
import { selectNewDb } from "../renderer/scripts/common/utils/dbSelect.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (event, queryParams) => {
    return animalSearch(queryParams);
  });

  ipcMain.handle("animal-defaults", getExistingDefaults);

  ipcMain.handle("select-database", selectNewDb);
};

