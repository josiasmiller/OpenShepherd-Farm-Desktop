import {type SessionManagementIpc, type SessionManagementIpcProvider} from "@ipc/api";
export {type SessionManagementIpc, type SessionManagementIpcProvider} from "@ipc/api"

declare global {
  interface Window extends SessionManagementIpcProvider {}
}
