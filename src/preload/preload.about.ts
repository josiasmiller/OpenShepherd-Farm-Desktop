import {contextBridge} from "electron";
import {ApplicationSettings, applicationSettingsIpcProxy} from "./proxies/applicationSettings";

contextBridge.exposeInMainWorld(ApplicationSettings.IPC_API_NAME, applicationSettingsIpcProxy())
