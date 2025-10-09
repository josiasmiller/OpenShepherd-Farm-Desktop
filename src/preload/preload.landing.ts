import {contextBridge} from "electron";
import {SessionManagement, sessionManagementIpcProxy} from '@ipc/preload/sessionManagement'

contextBridge.exposeInMainWorld(SessionManagement.IPC_API_NAME, sessionManagementIpcProxy())
