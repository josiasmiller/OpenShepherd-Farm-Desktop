
import { ipcMain, dialog } from "electron";
import { animalSearch } from "../database/queries/animalSearch.js";
import { selectNewDb } from "../database/dbConnection.js";

export const registerIpcHandlers = () => {

  ipcMain.handle("animal-search", async () => {
    return animalSearch();
  });

  // Handler for "select-database"
  ipcMain.handle("select-database", selectNewDb);
  // ipcMain.handle("select-database", async () => {
  //   const { filePaths } = await dialog.showOpenDialog({
  //     title: "Select Database File",
  //     properties: ["openFile"],
  //     filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }],
  //   });

  //   if (filePaths.length > 0) {
  //     const databasePath = filePaths[0]; // Save the selected file path

  //     openDb(databasePath); // open database in dbConnection

  //     return databasePath;
  //   }

  //   return null; // No file selected
  // });
};

