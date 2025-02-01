import path from 'path'
import { app } from 'electron'
import { isDev } from './utils.js'

export function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        '/dist-electron/preload.cjs'
    )
}

export function getUIPath(): string {
    return path.join(app.getAppPath(), '/dist-react/index.html')
}

export function getAssetPath(): string {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', 'src/assets')
}

export function getPythonPath(): string {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', 'dist-python')
}

export function getRPath(): string {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', 'dist-r')
}
