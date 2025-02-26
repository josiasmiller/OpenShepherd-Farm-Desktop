
import { ipcMain } from "electron";
import { animalSearch } from "../database/queries/animalSearch.js";
import { getExistingDefaults } from "../database/queries/defaults/getExistingDefaults.js";
import { selectNewDb } from "../renderer/scripts/common/utils/dbSelect.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (event, queryParams) => {
    return animalSearch(queryParams);
  });

  ipcMain.handle("animal-defaults", getExistingDefaults);

  ipcMain.handle("select-database", selectNewDb);
};

