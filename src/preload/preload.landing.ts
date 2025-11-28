import {contextBridge} from "electron";
import {SessionManagement, sessionManagementIpcProxy} from './proxies/sessionManagement'

contextBridge.exposeInMainWorld(SessionManagement.IPC_API_NAME, sessionManagementIpcProxy())
