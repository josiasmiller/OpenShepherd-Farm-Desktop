import { ipcMain } from "electron";

ipcMain.handle("fetch-data", async () => {
  return { message: "Hello from the backend!" };
});
