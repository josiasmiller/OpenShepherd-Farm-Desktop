import {type AppAboutInfo} from "@app/buildVariant";
export {type AppAboutInfo} from "@app/buildVariant";

export const ApplicationSettings = {
  IPC_API_NAME: 'applicationSettingsIpc',
  CHANNEL_QUERY_ABOUT_APP: 'query-about-app',
  CHANNEL_OPEN_ATRKKR_WEBSITE: 'open-atrkkr-website',
  CHANNEL_OPEN_ATRKKR_SUPPORT_MAIL: 'open-atrkkr-support-mail',
  CHANNEL_OPEN_ATRKKR_BUILD_COMMIT: 'open-atrkkr-build-commit'
} as const

export interface ApplicationSettingsIpc {
  queryAboutApp: () => Promise<AppAboutInfo>
  openAtrkkrWebsite: () => Promise<void>
  openAtrkkrSupportMail: () => Promise<void>
  openAtrkkrBuildCommit: () => Promise<void>
}

export interface ApplicationSettingsIpcProvider {
  applicationSettingsIpc: ApplicationSettingsIpc
}
