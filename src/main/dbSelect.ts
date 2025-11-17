import { BrowserWindow, dialog } from "electron"

/**
 * Shows an open file dialog to open an AnimalTrakker sqlite database file.
 *
 * @param parentWindow
 * @returns The string path to the database file if one is selected,
 * otherwise null if the dialog is closed or cancelled.
 */
export const selectNewDb = async (parentWindow: BrowserWindow) => {
  const { filePaths } = await dialog.showOpenDialog(parentWindow, {
    title: "Select Database File",
    properties: ["openFile"],
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite", "sqlite3"] }],
  })

  return (filePaths.length > 0) ? filePaths[0] : null
}
