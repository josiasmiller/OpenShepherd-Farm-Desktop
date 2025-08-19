import { ApiEventRegistrarFunc } from "packages/api"
import { Observable } from "rxjs";

export function observeApiEvent<T>(apiEventRegistrar: ApiEventRegistrarFunc<T>): Observable<T> {
  return new Observable((subscriber) => {
    const cleanupFunc = apiEventRegistrar(data => subscriber.next(data))
    return () => { cleanupFunc() }
  })
}
