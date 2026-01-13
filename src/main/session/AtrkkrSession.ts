import {Database} from "@database/async";
import {BrowserWindow} from "electron";

export class AtrkkrSession {

  constructor(
    readonly dbPath: string,
    readonly db: Database,
    readonly window: BrowserWindow
  ) {}
}
