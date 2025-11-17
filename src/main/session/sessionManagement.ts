import {BrowserWindow, IpcMainInvokeEvent} from "electron";
import {AtrkkrSession} from "./AtrkkrSession";

const sessionsByWindowId: Map<number, AtrkkrSession> = new Map<number, AtrkkrSession>()

export const atrkkrHasOpenSessions = (): Boolean => {
  return 0 < sessionsByWindowId.size
}

export const trackAtrkkrSession = (session: AtrkkrSession) => {
  sessionsByWindowId.set(session.window.id, session)
}

export const untrackAtrkkrSession = (session: AtrkkrSession) => {
  sessionsByWindowId.delete(session.window.id)
}

export const atrkkrSessionForDBPath = (dbPath: string): AtrkkrSession | null => {
  return sessionsByWindowId.values()
    .find((value, _) => {
      return value.dbPath === dbPath
    }) ?? null
}

export const atrkkrSessionForEvent = (event: IpcMainInvokeEvent): AtrkkrSession | null => {
  const browserWindowId = BrowserWindow.fromWebContents(event.sender)?.id
  return (browserWindowId != null) ? sessionsByWindowId.get(browserWindowId) ?? null : null
}
