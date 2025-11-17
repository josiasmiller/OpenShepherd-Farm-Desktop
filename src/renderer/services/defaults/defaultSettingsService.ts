import {DefaultsAPI} from '@app/api';
import {concat, from, map, Observable, switchMap} from "rxjs";
import {DefaultSettingsResults} from '@app/api';
import {observeApiEvent} from "@ipc/api/core";
import {createContext} from "react";

export interface DefaultSettingsService {
  selectActiveDefaultSettings: (val: DefaultSettingsResults) => Promise<void>
  activeDefaultSettings$: () => Observable<DefaultSettingsResults>
  defaultSettings$: () => Observable<DefaultSettingsResults[]>
}

export class IPCDefaultSettingsService implements DefaultSettingsService {

  constructor(private readonly defaultsAPI: DefaultsAPI) {}

  selectActiveDefaultSettings(settings: DefaultSettingsResults) {
    return this.defaultsAPI.selectActiveDefaultSettings(settings)
  }

  activeDefaultSettings$(): Observable<DefaultSettingsResults> {
    const initial = from(this.defaultsAPI.queryActiveDefaultSettings())
    const updates = observeApiEvent(this.defaultsAPI.onActiveDefaultSettingsChanged)
      .pipe(switchMap((event) => this.defaultsAPI.queryActiveDefaultSettings()))
    return concat(initial, updates)
  }

  defaultSettings$(): Observable<DefaultSettingsResults[]> {
    const initial = from(this.defaultsAPI.getExisting())
      .pipe(map(result => {
        switch(result.tag) {
          case "success": return result.data
          case "error": return []
        }
      }))
    const updates = observeApiEvent(this.defaultsAPI.onDefaultSettingsListChanged)
      .pipe(
        switchMap((event) => this.defaultsAPI.getExisting()),
        map(result => {
          switch(result.tag) {
            case "success": return result.data
            case "error": return []
          }
        })
      )
    return concat(initial, updates)
  }
}

export const DefaultSettingsServiceContext = createContext<DefaultSettingsService>(
  new IPCDefaultSettingsService(window.defaultsAPI)
)
