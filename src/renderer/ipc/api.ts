import { ApiEventRegistrarFunc } from "packages/api"
import { Observable } from "rxjs";

/**
 * Converts an Api Event registration to an Observable stream of events.
 *
 * Registers for the Api Event and unregisters from the event when it is
 * no longer needed providing proper cleanup.
 *
 * @param apiEventRegistrar
 */
export function observeApiEvent<T>(apiEventRegistrar: ApiEventRegistrarFunc<T>): Observable<T> {
  return new Observable((subscriber) => {
    const cleanupFunc = apiEventRegistrar(data => subscriber.next(data))
    return () => { cleanupFunc() }
  })
}
