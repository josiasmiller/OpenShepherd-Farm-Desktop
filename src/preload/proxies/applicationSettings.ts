import {ipcRenderer} from "electron";
import {type AppAboutInfo, ApplicationSettings, type ApplicationSettingsIpc} from "@ipc/api";
export {type AppAboutInfo, ApplicationSettings, type ApplicationSettingsIpc} from "@ipc/api";

export function applicationSettingsIpcProxy(): ApplicationSettingsIpc {
  return {
    queryAboutApp: (): Promise<AppAboutInfo> => ipcRenderer.invoke(ApplicationSettings.CHANNEL_QUERY_ABOUT_APP),
    openAtrkkrWebsite: (): Promise<void> => ipcRenderer.invoke(ApplicationSettings.CHANNEL_OPEN_ATRKKR_WEBSITE),
    openAtrkkrSupportMail: (): Promise<void> => ipcRenderer.invoke(ApplicationSettings.CHANNEL_OPEN_ATRKKR_SUPPORT_MAIL),
    openAtrkkrBuildCommit: (): Promise<void> => ipcRenderer.invoke(ApplicationSettings.CHANNEL_OPEN_ATRKKR_BUILD_COMMIT),
  }
}
