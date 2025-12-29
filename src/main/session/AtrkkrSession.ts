import {Database} from "@database/async";
import {BrowserWindow} from "electron";
import {defaultSettingsExists} from "../database/repositories/read/defaults/defaultSettingsExists";
import {BehaviorSubject, distinctUntilChanged, Observable} from "rxjs";
import {DefaultSettingsManagement} from "@ipc/api";
import {ID_DEFAULT_SETTINGS_STANDARD} from "@database/schema";

export class AtrkkrSession {

  private _activeDefaultSettingsId = new BehaviorSubject<string>(ID_DEFAULT_SETTINGS_STANDARD);
  private _activeDefaultSettingsIdObservable = this._activeDefaultSettingsId.asObservable();

  constructor(
    readonly dbPath: string,
    readonly db: Database,
    readonly window: BrowserWindow
  ) {
    this._activeDefaultSettingsIdObservable.pipe(distinctUntilChanged()).subscribe((_) => {
      window.webContents.send(DefaultSettingsManagement.CHANNEL_EVENT_ACTIVE_DEFAULT_SETTINGS_CHANGED)
    })
  }

  activeDefaultSettingsId(): string {
    return this._activeDefaultSettingsId.value
  }

  activeDefaultSettingsId$(): Observable<string> {
    return this._activeDefaultSettingsIdObservable;
  }

  async activateDefaultSettings(defaultSettingsId: string): Promise<boolean> {
    if (this._activeDefaultSettingsId.value === defaultSettingsId) {
      return true
    }
    if (await defaultSettingsExists(this.db, defaultSettingsId)) {
      this._activeDefaultSettingsId.next(defaultSettingsId);
      return true;
    }
    return false;
  }
}
