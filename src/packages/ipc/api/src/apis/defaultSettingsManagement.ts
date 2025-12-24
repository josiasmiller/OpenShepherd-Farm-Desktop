import {type DefaultSettingsResults, type NewDefaultSettingsParameters} from '@app/api/src'
import {type Result} from "@common/core/src";
import {type IpcEventRegistrarFunc} from "src/packages/ipc/core/src";
import {ItemEntry} from "@app/api";

/**
 * IPC Channel Names for DefaultSettingsManagement
 */
export const DefaultSettingsManagement = {
  IPC_API_NAME: 'defaultSettingsManagementIpc',
  CHANNEL_CREATE_DEFAULT_SETTINGS: 'create-default-settings',
  CHANNEL_UPDATE_DEFAULT_SETTINGS: 'update-default-settings',
  CHANNEL_QUERY_DEFAULT_SETTINGS: 'query-default-settings',
  CHANNEL_QUERY_DEFAULT_SETTINGS_ENTRIES: 'query-default-settings-entries',
  CHANNEL_EVENT_DEFAULT_SETTINGS_COLLECTION_CHANGED: 'default-settings-collection-changed',
  CHANNEL_QUERY_ACTIVE_DEFAULT_SETTINGS_ENTRY: 'query-active-default-settings-entry',
  CHANNEL_SELECT_ACTIVE_DEFAULT_SETTINGS: 'select-active-default-settings',
  CHANNEL_EVENT_ACTIVE_DEFAULT_SETTINGS_CHANGED: 'active-default-settings-changed',
  CHANNEL_EVENT_ACTIVE_DEFAULT_SETTINGS_NOT_FOUND: 'active-default-settings-not-found'
} as const

/**
 * IPC interface to expose in main world.
 */
export interface DefaultSettingsManagementIpc {
  createDefaultSettings: (params: NewDefaultSettingsParameters) => Promise<boolean>
  updateDefaultSettings: (params: NewDefaultSettingsParameters) => Promise<boolean>
  queryDefaultSettings: () => Promise<Result<DefaultSettingsResults[], string>>
  queryDefaultSettingsEntries: () => Promise<ItemEntry[]>
  onDefaultSettingsCollectionChanged: IpcEventRegistrarFunc<void>,
  selectActiveDefaultSettings: (defaultSettingsId: string) => Promise<boolean>
  queryActiveDefaultSettingsEntry: () => Promise<ItemEntry | null>
  onActiveDefaultSettingsChanged: IpcEventRegistrarFunc<void>
  onActiveDefaultSettingsNotFound: IpcEventRegistrarFunc<void>
}

/**
 * Provider of ipc proxy
 */
export interface DefaultSettingsManagementIpcProvider {
  defaultSettingsManagementIpc: DefaultSettingsManagementIpc
}
