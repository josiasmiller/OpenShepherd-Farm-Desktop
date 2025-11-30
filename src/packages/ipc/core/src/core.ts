
import { Observable } from "rxjs";

export type IpcEventRegistrarFunc<T> = (listener: (data: T) => void) => IpcEventRegistrationCleanupFunc
export type IpcEventRegistrationCleanupFunc = () => void

/**
 * Converts an Ipc Event registration to an Observable stream of events.
 *
 * Registers for the IPC Event and unregisters from the event when it is
 * no longer needed providing proper cleanup.
 *
 * @param ipcEventRegistrar
 */
export function observeApiEvent<T>(ipcEventRegistrar: IpcEventRegistrarFunc<T>): Observable<T> {
  return new Observable((subscriber) => {
    const cleanupFunc = ipcEventRegistrar(data => subscriber.next(data))
    return () => { cleanupFunc() }
  })
}
