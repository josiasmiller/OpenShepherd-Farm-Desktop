import { BrowserWindow, dialog } from "electron"

/**
 * Shows an open file dialog to open an AnimalTrakker sqlite database file.
 *
 * @param parentWindow
 * @param dialogTitle string title of the dialog window
 * @returns The string path to the JSON file if one is selected,
 * otherwise null if the dialog is closed or cancelled.
 */
export const selectJsonFile = async (
    dialogTitle: string,
    parentWindow: BrowserWindow,
) => {
  const { filePaths } = await dialog.showOpenDialog(parentWindow, {
    title: dialogTitle,
    properties: ["openFile"],
    filters: [{ name: "JSON File", extensions: ["json", "JSON",] }],
  })

  return (filePaths.length > 0) ? filePaths[0] : null
}
