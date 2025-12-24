import {DefaultSettingsManagementIpc} from '@ipc/api';
import {concat, filter, from, map, Observable, switchMap} from "rxjs";
import {DefaultSettingsResults, ItemEntry} from '@app/api';
import {observeApiEvent} from "@ipc/core";
import {createContext} from "react";

export interface DefaultSettingsService {
  selectActiveDefaultSettings: (defaultSettingsId: string) => Promise<boolean>
  activeDefaultSettingsEntry$: () => Observable<ItemEntry>
  defaultSettings$: () => Observable<DefaultSettingsResults[]>
  defaultSettingsEntries$: () => Observable<ItemEntry[]>
}

export class IPCDefaultSettingsService implements DefaultSettingsService {

  constructor(private readonly defaultsAPI: DefaultSettingsManagementIpc) {}

  selectActiveDefaultSettings(defaultSettingsId: string) {
    return this.defaultsAPI.selectActiveDefaultSettings(defaultSettingsId)
  }

  activeDefaultSettingsEntry$(): Observable<ItemEntry> {
    const initial = from(this.defaultsAPI.queryActiveDefaultSettingsEntry()).pipe(
      filter(data => data !== null)
    )
    const updates = observeApiEvent(this.defaultsAPI.onActiveDefaultSettingsChanged).pipe(
      switchMap((event) => this.defaultsAPI.queryActiveDefaultSettingsEntry()),
      filter(data => data !== null)
    )
    return concat(initial, updates)
  }

  defaultSettings$(): Observable<DefaultSettingsResults[]> {
    const initial = from(this.defaultsAPI.queryDefaultSettings())
      .pipe(map(result => {
        switch(result.tag) {
          case "success": return result.data
          case "error": return []
        }
      }))
    const updates = observeApiEvent(this.defaultsAPI.onDefaultSettingsCollectionChanged)
      .pipe(
        switchMap((event) => this.defaultsAPI.queryDefaultSettings()),
        map(result => {
          switch(result.tag) {
            case "success": return result.data
            case "error": return []
          }
        })
      )
    return concat(initial, updates)
  }

  defaultSettingsEntries$(): Observable<ItemEntry[]> {
    const initial = from(this.defaultsAPI.queryDefaultSettingsEntries())
    const updates = observeApiEvent(this.defaultsAPI.onDefaultSettingsCollectionChanged)
      .pipe(
        switchMap((event) => this.defaultsAPI.queryDefaultSettingsEntries()),
      )
    return concat(initial, updates)
  }
}

export const DefaultSettingsServiceContext = createContext<DefaultSettingsService>(
  new IPCDefaultSettingsService(window.defaultSettingsManagementIpc)
)
