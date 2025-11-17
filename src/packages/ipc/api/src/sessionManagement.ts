
/**
 * IPC Channel Names for SessionManagement
 */
export const SessionManagement = {
  IPC_API_NAME: 'sessionManagementIpc',
  CHANNEL_OPEN_SESSION: 'open-session'
} as const

/**
 * IPC interface to expose in main world.
 */
export interface SessionManagementIpc {
  openSession: () => Promise<void>
}

/**
 * Provider of session management ipc
 */
export interface SessionManagementIpcProvider {
  sessionManagementIpc: SessionManagementIpc
}

declare global {
  interface Window extends SessionManagementIpcProvider {}
}
