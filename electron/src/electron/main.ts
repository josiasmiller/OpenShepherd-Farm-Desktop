import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainHandlePromise, isDev } from './utils.js'
import { getAssetPath, getPreloadPath, getUIPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'
import pkg from 'sqlite3'
import { echoInPython, echoInR } from './echo.js'
const { Database } = pkg

const db = new Database(path.join(getAssetPath(), 'AnimalTrakker_V5_DB.sqlite'))
const animalQuery = `SELECT 
        animal_tbl.animal_name, 
        sire_tbl.animal_name as sire_name,
        dam_tbl.animal_name as dam_name
        FROM animal_table as animal_tbl
        LEFT JOIN animal_table as sire_tbl
        ON animal_tbl.sire_id = sire_tbl.id_animalid
        LEFT JOIN animal_table as dam_tbl
        ON animal_tbl.dam_id = dam_tbl.id_animalid
        WHERE animal_tbl.animal_name LIKE '%' || (?) || '%'
        ORDER BY animal_tbl.animal_name`

function queryAnimals(query: string): Promise<AnimalInfo[]> {
    return new Promise<AnimalInfo[]>((resolve, reject) => {
        if (query === "") {
            resolve([])
        } else {
            db.all(animalQuery, query, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows.map((row: any, index: number) => {
                        return {
                            name: row.animal_name,
                            sireName: row.sire_name,
                            damName: row.dam_name
                        }
                    }))
                }
            })
        }
    })
}

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        }
    })
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123')
    } else {
        mainWindow.loadFile(getUIPath())
    }
    ipcMainHandlePromise('queryAnimals', (query) => {
        return queryAnimals(query)
    })
    ipcMainHandlePromise('echoInPython', (query) => {
        return echoInPython(query)
    })
    ipcMainHandlePromise('echoInR', (query) => {
        return echoInR(query)
    })
    handleCloseEvents(mainWindow)
    createTray(mainWindow)
    createMenu(mainWindow)
})

function handleCloseEvents(mainWindow: BrowserWindow) {

    let willClose = false
    
    mainWindow.on('close', (event) => {
        if (willClose) {
            return
        }
        event.preventDefault()
        mainWindow.hide()
        if (app.dock) {
            app.dock.hide()
        }
    })

    mainWindow.on('show', () => {
        willClose = false
    })

    app.on('before-quit', () => {
        willClose = true
    })
}
