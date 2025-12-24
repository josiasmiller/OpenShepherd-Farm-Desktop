import {ipcRenderer} from "electron";

import {DefaultSettingsManagement, type DefaultSettingsManagementIpc} from "@ipc/api";
import {DefaultSettingsResults, ItemEntry, NewDefaultSettingsParameters} from "@app/api";
import {bindIpcCallback} from "../core/callbacks";
import {IpcEventRegistrationCleanupFunc} from "@ipc/core";
import {Result} from "@common/core";

export {DefaultSettingsManagement, type DefaultSettingsManagementIpc} from "@ipc/api";

/**
 * Factory method to create a proxy instance of SessionManagementIpc
 */
export function defaultSettingsManagementIpcProxy(): DefaultSettingsManagementIpc {
  return {
    createDefaultSettings: (defaultSettings: NewDefaultSettingsParameters): Promise<boolean> => {
      return ipcRenderer.invoke(DefaultSettingsManagement.CHANNEL_CREATE_DEFAULT_SETTINGS, defaultSettings)
    },
    updateDefaultSettings: (defaultSettings: NewDefaultSettingsParameters): Promise<boolean> => {
      return ipcRenderer.invoke(DefaultSettingsManagement.CHANNEL_UPDATE_DEFAULT_SETTINGS, defaultSettings)
    },
    queryDefaultSettings: (): Promise<Result<DefaultSettingsResults[], string>> => {
      return ipcRenderer.invoke(DefaultSettingsManagement.CHANNEL_QUERY_DEFAULT_SETTINGS)
    },
    queryDefaultSettingsEntries: (): Promise<ItemEntry[]> => {
      return ipcRenderer.invoke(DefaultSettingsManagement.CHANNEL_QUERY_DEFAULT_SETTINGS_ENTRIES)
    },
    onDefaultSettingsCollectionChanged: (listener: (data: void) => void): IpcEventRegistrationCleanupFunc => {
      return bindIpcCallback(DefaultSettingsManagement.CHANNEL_EVENT_DEFAULT_SETTINGS_COLLECTION_CHANGED, listener)
    },
    selectActiveDefaultSettings: (defaultSettingsId: string): Promise<boolean> => {
      return ipcRenderer.invoke(DefaultSettingsManagement.CHANNEL_SELECT_ACTIVE_DEFAULT_SETTINGS, defaultSettingsId)
    },
    queryActiveDefaultSettingsEntry: (): Promise<ItemEntry | null> => {
      return ipcRenderer.invoke(DefaultSettingsManagement.CHANNEL_QUERY_ACTIVE_DEFAULT_SETTINGS_ENTRY)
    },
    onActiveDefaultSettingsChanged: (listener: (data: void) => void): IpcEventRegistrationCleanupFunc => {
      return bindIpcCallback(DefaultSettingsManagement.CHANNEL_EVENT_ACTIVE_DEFAULT_SETTINGS_CHANGED, listener)
    },
    onActiveDefaultSettingsNotFound: (listener: (data: void) => void): IpcEventRegistrationCleanupFunc => {
      return bindIpcCallback(DefaultSettingsManagement.CHANNEL_EVENT_ACTIVE_DEFAULT_SETTINGS_NOT_FOUND, listener)
    }
  }
}
