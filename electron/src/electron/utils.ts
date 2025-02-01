import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from 'url'

export function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious Event')
    }
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: (...args: any[]) => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event) => {
        if (event.senderFrame != null) {
            validateEventFrame(event.senderFrame)
            return handler()
        }
    })
}

export function ipcMainHandlePromise<Key extends keyof EventPayloadMapping>(
    key: Key,
    handler: (...args: any[]) => Promise<EventPayloadMapping[Key]>
) {
    ipcMain.handle(key, (event, args) => {
        if (event.senderFrame != null) {
            validateEventFrame(event.senderFrame)
            return handler(args)
        }
    })
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload)
}
