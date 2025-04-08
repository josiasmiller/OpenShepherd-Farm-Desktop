import { dialog } from "electron";
import { openDb } from "../../../../database/dbConnections.js";


export const selectNewDb = async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: "Select Database File",
    properties: ["openFile"],
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }],
  });

  if (filePaths.length > 0) {
    const databasePath = filePaths[0]; // Save the selected file path

    openDb(databasePath); // Open the database in dbConnection

    return databasePath;
  }

  return null; // No file selected
};