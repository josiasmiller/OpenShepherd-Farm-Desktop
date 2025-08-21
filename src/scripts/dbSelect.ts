import { BrowserWindow, dialog } from "electron";
import { openDb } from "../database/dbConnections";


export const selectNewDb = async (parentWindow: BrowserWindow) => {
  const { filePaths } = await dialog.showOpenDialog(parentWindow, {
    title: "Select Database File",
    properties: ["openFile"],
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite", "sqlite3"] }],
  });

  if (filePaths.length > 0) {
    const databasePath = filePaths[0]; // Save the selected file path

    openDb(databasePath); // Open the database in dbConnection

    return databasePath;
  }

  return null; // No file selected
};