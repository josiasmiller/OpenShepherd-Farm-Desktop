import {BrowserWindow} from "electron";

export const bringWindowToFront = (window: BrowserWindow) => {
  window.setAlwaysOnTop(true)
  window.show()
  window.focus()
  window.setAlwaysOnTop(false)
}
