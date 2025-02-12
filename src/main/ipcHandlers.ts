import { ipcMain } from "electron";

ipcMain.handle("fetch-data", async () => {
  return { message: "Hello from the backend!" };
});

ipcMain.handle("select-database", async () => {
  return { message: "DB SHIT !" };
});
