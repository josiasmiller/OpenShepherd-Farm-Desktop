
import { ipcMain, dialog } from "electron";

export const registerIpcHandlers = () => {
  // Handler for "animal-search"
  ipcMain.handle("animal-search", async () => {
    console.log("in ipcHandlers!!!!!");
    return { message: "FIXME need to impl DB conneciton here in ipcHandlers.ts" };
  });

  // Handler for "select-database"
  ipcMain.handle("select-database", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      title: "Select Database File",
      properties: ["openFile"],
      filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }],
    });

    if (filePaths.length > 0) {
      const databasePath = filePaths[0]; // Save the selected file path
      return databasePath;
    }

    return null; // No file selected
  });
};

