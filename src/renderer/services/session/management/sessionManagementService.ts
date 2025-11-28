import {createContext} from "react";
import {type SessionManagementIpc} from "../../../ipc/proxies/sessionManagement";

export interface SessionManagementService {
  openSession: () => Promise<void>
}

export class IPCSessionManagementService implements SessionManagementService {

  constructor(private readonly sessionManagement: SessionManagementIpc) {}

  openSession() {
    return this.sessionManagement.openSession()
  }
}

export const SessionManagementServiceContext = createContext<SessionManagementService>(
  new IPCSessionManagementService(window.sessionManagementIpc)
)
