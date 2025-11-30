import {type ApplicationSettingsIpc, type ApplicationSettingsIpcProvider} from "@ipc/api";
export {type ApplicationSettingsIpc, type ApplicationSettingsIpcProvider} from "@ipc/api"

declare global {
  interface Window extends ApplicationSettingsIpcProvider {}
}
