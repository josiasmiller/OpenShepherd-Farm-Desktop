import { BrowserWindow, dialog } from "electron"
import { openDb } from "./database/dbConnections"

/**
 * Shows an open file dialog to open an AnimalTrakker sqlite database file.
 *
 * Once a file is selected the database is opened and run through some
 * up front integrity checks to help ensure that AnimalTrakker will
 * be able to function properly based on the version and state of the
 * database.
 *
 * If the database passes integrity checks it will remain open and
 * become the active database.  If it does not, it will be closed
 * and any previously active database will remain the active database.
 *
 * @param parentWindow
 * @returns The string path to the database file if the database is successfully
 * opened and passes all integrity checks.  Otherwise returns null.
 */
export const selectNewDb = async (parentWindow: BrowserWindow) => {
  const { filePaths } = await dialog.showOpenDialog(parentWindow, {
    title: "Select Database File",
    properties: ["openFile"],
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite", "sqlite3"] }],
  })

  if (filePaths.length > 0) {
    const databasePath = filePaths[0]; // Save the selected file path
    return await openDb(databasePath, parentWindow); // Open the database in dbConnection
  }

  return null; // No file selected
}
