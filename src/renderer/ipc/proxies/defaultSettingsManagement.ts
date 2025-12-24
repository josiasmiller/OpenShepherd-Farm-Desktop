import {type DefaultSettingsManagementIpc, type DefaultSettingsManagementIpcProvider} from "@ipc/api"
export {type DefaultSettingsManagementIpc, type DefaultSettingsManagementIpcProvider} from "@ipc/api"

declare global {
  interface Window extends DefaultSettingsManagementIpcProvider {}
}
