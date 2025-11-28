
import {ipcRenderer} from "electron";
import {SessionManagement, type SessionManagementIpc} from "@ipc/api";
export {SessionManagement, type SessionManagementIpc} from "@ipc/api";

/**
 * Factory method to create a proxy instance of SessionManagementIpc
 */
export function sessionManagementIpcProxy(): SessionManagementIpc {
  return {
    openSession: () => ipcRenderer.invoke(SessionManagement.CHANNEL_OPEN_SESSION)
  }
}
