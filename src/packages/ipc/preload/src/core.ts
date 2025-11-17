
import { ipcRenderer } from "electron";

/**
 * Provides ipcRenderer.on registration and returns
 * a cleanup function to unregister with ipcRenderer.off.
 *
 * @param channel Name of the ipc channel to bind to.
 * @param callback Callback function to invoke when the ipc channel emits
 */
export function bindIpcCallback<T>(channel: string, callback: (eventData: T) => void): () => void {
  const ipcCallback =
    (event: Electron.IpcRendererEvent, eventData: T) => { callback(eventData) }
  ipcRenderer.on(channel, ipcCallback)
  return () => { ipcRenderer.off(channel, ipcCallback) }
}
