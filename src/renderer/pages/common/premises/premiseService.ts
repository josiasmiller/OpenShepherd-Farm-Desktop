import {concat, from, merge, Observable, switchMap} from "rxjs";
import {Result} from "packages/core/src";
import {Premise} from "packages/api/src";
import { observeApiEvent } from "../../../ipc/api";
import {PremiseAPI} from "packages/api/src/apis";
import {createContext} from "react";

export interface PremiseService {
  premise$: () => Observable<Result<Premise[], string>>
}

export class IpcPremiseService implements PremiseService {

  constructor(private premiseAPI: PremiseAPI) {}

  premise$(){
    const initial = from(this.premiseAPI.queryPremises())
    const updates = merge(
      observeApiEvent(this.premiseAPI.onPremiseAdded),
      observeApiEvent(this.premiseAPI.onPremiseUpdated),
      observeApiEvent(this.premiseAPI.onPremiseRemoved)
    ).pipe(switchMap(event => this.premiseAPI.queryPremises()))
    return concat(initial, updates)
  }
}

export const PremiseServiceContext = createContext<PremiseService>(
  new IpcPremiseService(window.premiseAPI)
)
