
import { ipcMain } from "electron";
import { animalSearch } from "../database/queries/animalSearch.js";
import { selectNewDb } from "../database/dbConnections.js";

export const registerIpcHandlers = () => {
  
  ipcMain.handle("animal-search", async (event, queryParams) => {
    return animalSearch(queryParams);  // Pass the queryParams from the front-end
  });

  // Handler for "select-database"
  ipcMain.handle("select-database", selectNewDb);
};

