import {DatabaseSessionInfo} from "packages/api/src/dtos";
import {concat, from, merge, Observable, switchMap} from "rxjs";
import {SystemAPI} from "packages/api/src/apis";
import {observeApiEvent} from "../../ipc/api";
import {createContext} from "react";

export interface SystemService {
  openDatabase: () => Promise<string>
  closeDatabase: () => Promise<void>
  databaseSessionInfo$: () => Observable<DatabaseSessionInfo | null>
}

export class IPCSystemService implements SystemService {

  constructor(private readonly systemAPI: SystemAPI) {}

  openDatabase() {
    return this.systemAPI.openDatabase()
  }

  closeDatabase() {
    return this.systemAPI.closeDatabase();
  }

  databaseSessionInfo$() {
    const initial = from(this.systemAPI.databaseSessionInfo())
    const updates = merge(
      observeApiEvent(this.systemAPI.onDatabaseSessionChanged),
    ).pipe(switchMap(event => this.systemAPI.databaseSessionInfo()))
    return concat(initial, updates)
  }
}

export const SystemServiceContext = createContext<SystemService>(
  new IPCSystemService(window.systemAPI)
)
