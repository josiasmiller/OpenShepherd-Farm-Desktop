import log from 'electron-log/main';

import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  type IpcMainInvokeEvent
} from 'electron';

import {registerIpcHandlers} from "./ipcHandlers";
import {SessionManagement} from "@ipc/api";
import {selectNewDb} from "./dbSelect";
import {
  atrkkrHasOpenSessions,
  atrkkrSessionForDBPath,
  trackAtrkkrSession,
  untrackAtrkkrSession
} from "./session/sessionManagement";

import {AtrkkrSession} from "./session/AtrkkrSession";
import {openDb} from "./database/dbConnections";
import {bringWindowToFront} from "./electron/windows";

declare const LANDING_WINDOW_WEBPACK_ENTRY: string;
declare const LANDING_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

log.initialize();

let landingWindow: BrowserWindow | null = null;

log.info(`Application starting - PID:${process.pid}`);

// We want one running instance of the application
// to handle all requests. Quit if we are a second instance.
if (!app.requestSingleInstanceLock()) {
  log.info(`Application quitting - Second instance - PID:${process.pid}`);
  app.quit();
} else {
  run();
}

// This is set to true when the application
// is quitting because it should quit.
// Used as a stop gap to avoid shutting
// down when all windows are closed,
// but shut down after they are
// closed when a quit is
// explicitly requested.
let isApplicationQuitting = false;

/**
 * The method that executes to actually run the application.
 * It is responsible for settings up basic window/process management
 * and IPC.
 */
function run() {

  ipcMain.handle(SessionManagement.CHANNEL_OPEN_SESSION, async (event: IpcMainInvokeEvent) => {
    const clientWindow = BrowserWindow.fromWebContents(event.sender);
    await openNewSession(clientWindow);
  });

  app.whenReady().then(() => {
    // Always show landing screen first
    // and make sure the ipc handlers
    // are registered.
    showLandingWindow();
    registerIpcHandlers();
  });

  app.on('browser-window-created', (event, window: BrowserWindow) => {
    // If any window other than the landing window is created,
    // a new session window in most cases, get rid of the
    // landing window.
    if (landingWindow && landingWindow.id != window.id) {
      landingWindow?.destroy();
      landingWindow = null;
    }
  });

  app.on('window-all-closed', () => {
    // This event is overridden specifically
    // to quit the application on Mac when
    // all windows are closed.
    app.quit();
  })

  app.on('before-quit', () => {
    isApplicationQuitting = true;
  })

  app.on('will-quit', (event) => {
    // Closing of the last session window will trip this callback
    // before the app quits.  The landing window will have been
    // recreated and stored in this reference and the quit should
    // be aborted in that case and the landing window allowed to show.
    if (!isApplicationQuitting && landingWindow) {
      event.preventDefault();
    }
  })
}

/**
 * Creates and shows the landing window.
 */
function showLandingWindow() {
  landingWindow = createLandingWindow();
  updateMenuForPlatform(landingWindow, updateLandingWindowMenu);
  landingWindow.loadURL(LANDING_WINDOW_WEBPACK_ENTRY)
    .catch(err => {
      log.error(`Failed to load landing window: ${err}`);
    });
}

/**
 * Creates the landing window.
 */
function createLandingWindow(): BrowserWindow {
  let window = new BrowserWindow({
    width: 450,
    height: 450,
    title: 'AnimalTrakker',
    resizable: true, //false
    webPreferences: {
      preload: LANDING_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  window.on('closed', () => {
    // Make sure this references is null
    // so that will-quit event knows
    // there is no expectation
    // to stay open and show
    // the landing window.
    landingWindow = null;
  });
  // Menu and Dev Tools only available
  // when not packaged
  window.menuBarVisible = !app.isPackaged;
  return window;
}

/**
 * Called to open a new session, attach it to window,
 * and close the landing window if necessary.
 *
 * @param parentWindow
 */
async function openNewSession(parentWindow: BrowserWindow): Promise<void> {

  const dbPath = await selectNewDb(parentWindow);

  // No database file was selected, nothing more to do.
  if (!dbPath) {
    return;
  }

  const existingSession = atrkkrSessionForDBPath(dbPath);

  // If there is an existing session, bring its window to the front.
  if (existingSession) {
    bringWindowToFront(existingSession.window);
    return;
  }

  // Create a new window, but do not load anything
  // into it, it is just a hook from which to
  // show dialogs related to database loading
  // for now.
  const newSessionWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    title: `AnimalTrakker - ${dbPath}`,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Open the selected database using the window
  // we just created as a hook point for dialogs
  // related to opening the database.
  const db = await openDb(dbPath, newSessionWindow);

  if (db) {
    const session = new AtrkkrSession(dbPath, db, newSessionWindow);
    trackAtrkkrSession(session);
    // Ask before closing the session.
    newSessionWindow.on('close', (event) => {
      if (isApplicationQuitting) {
        //We're quitting the application by request. Don't ask to close windows.
        return;
      }
      const result = dialog.showMessageBoxSync(
        newSessionWindow, {
          type: 'question',
          message: `Are you sure you want to close "${dbPath}"?`,
          buttons: ['No', 'Yes']
        });
      if (!result) {
        event.preventDefault();
      }
    });
    // When session is closed, tear down session tracking.
    newSessionWindow.on('closed', async () => {
      untrackAtrkkrSession(session);
      session.db.close().catch((err) => {
        log.error(`Failed to close database "${dbPath}" when session window closed : ${err}`);
      });
      showLandingWindowIfNoSessions();
    });
    updateMenuForPlatform(newSessionWindow, updateSessionWindowMenu);
    await newSessionWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  } else {
    // Failed to open the database, there is no need for the window anymore.
    newSessionWindow.destroy();
    showLandingWindowIfNoSessions();
  }
}

/**
 * Checks to see if there are any open sessions,
 * and if there are not then shows the landing window.
 */
function showLandingWindowIfNoSessions() {
  // If we are quitting the application because of an explicit
  // request, we don't want to show the landing screen.
  if (!isApplicationQuitting && !atrkkrHasOpenSessions()) {
    showLandingWindow();
  }
}

/**
 * Convenience method for handling the differences in app/window
 * menu management between Mac, Windows, and Linux.
 *
 * Either forwards a window for Windows/Linux, or not for Mac.
 *
 * updateMenuFunction should handle the difference by either
 * setting a menu on the application or the given window
 * if one is provided to it.
 *
 * @param window
 * @param updateMenuFunction
 */
function updateMenuForPlatform(window: BrowserWindow, updateMenuFunction: (window: BrowserWindow | null) => void) {
  updateMenuFunction(process.platform !== 'darwin' ? window : null);
}

/**
 * Creates the menu that should be shown when the landing window
 * is active and sets it on the window provided, or the application
 * if a window is not provided (for Mac for example).
 *
 * @param window
 */
function updateLandingWindowMenu(window: BrowserWindow | null) {
  const shouldShowDevTools = !app.isPackaged;
  const menuTemplate: MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []) as MenuItemConstructorOptions[],
    ...(
      shouldShowDevTools ? [
        {
          label: '&Tools',
          submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
          ] as MenuItemConstructorOptions[]
        },
      ] : []) as MenuItemConstructorOptions[],
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  if (window) {
   window.setMenu(menu);
  } else {
    Menu.setApplicationMenu(menu);
  }
}

/**
 * Creates the menu that should be shown when a session window
 * is active and sets it on the window provided, or the application
 * if a window is not provided (for Mac for example).
 *
 * @param window
 */
function updateSessionWindowMenu(window: BrowserWindow | null) {
  const shouldShowDevTools = !app.isPackaged;
  const menuTemplate: MenuItemConstructorOptions[] = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []) as MenuItemConstructorOptions[],
    {
      label: '&File',
      submenu: [
        {
          label: 'Open Database...',
          accelerator: 'Ctrl+O',
          click: async (_) => {
            let parentWindow = (window ?? BrowserWindow.getFocusedWindow())
            if (parentWindow) {
              await openNewSession(parentWindow)
                .catch((err) => {
                  log.error(`Failed to open a new session from application menu: ${err}`)
                })
            }
          }
        },
        { type: 'separator' },
        { role: 'close' },
        { type: 'separator' },
        { role: 'quit' }
      ] as MenuItemConstructorOptions[]
    },
    {
      label: '&Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator'},
        { role: 'selectAll' }
      ] as MenuItemConstructorOptions[]
    },
    {
      label: '&View',
      submenu: [
        ...(
          shouldShowDevTools ? [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' }
          ] : [] as MenuItemConstructorOptions[]),
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' }
      ] as MenuItemConstructorOptions[]
    },
    {
      label: '&Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  if (window) {
    window.setMenu(menu);
  } else {
    Menu.setApplicationMenu(menu);
  }
}
