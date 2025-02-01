const electron = require('electron')

electron.contextBridge.exposeInMainWorld("electron", {
    queryAnimals: (query: string) => ipcInvoke('queryAnimals', query),
    echoInPython: (query: string) => ipcInvoke('echoInPython', query),
    echoInR: (query: string) => ipcInvoke('echoInR', query)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: any[]
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key, ...args)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
    electron.ipcRenderer.on(key, cb)
    return () => electron.ipcRenderer.off(key, cb)
}
