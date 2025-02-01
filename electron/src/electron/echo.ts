import { spawn } from 'child_process'
import path from 'path'
import { getPythonPath, getRPath } from './pathResolver.js'

const echoPythonScript = path.join(
    getPythonPath(),
    'python-echo'
)

const echoRScriptPath = path.join(
    getRPath(),
    'r-echo.r'
)

export function echoInPython(transient: string): Promise<EchoMessage> {
    return echoFromExternalScript(echoPythonScript, false, transient)
}

export function echoInR(transient: string): Promise<EchoMessage> {
    return echoFromExternalScript('Rscript', false, echoRScriptPath, transient)
}

function echoFromExternalScript(
    externalScript: string,
    shouldLog: boolean, 
    ...args: string[]
): Promise<EchoMessage> {
    return new Promise((resolve, reject) => {
        const child = spawn(externalScript, args)
        let stdout = ''
        let stderr = ''
        child.stdout.on('data', (data) => {
            stdout += data
            if (shouldLog) {
                console.log(`Echo data: ${data}`)
            }
        })
        child.stderr.on('data', (data) => {
            stderr += data
            if (shouldLog) {
                console.log(`Echo error: ${data}`)
            }
        })
        child.on('close', (code) => {
            if (code == 0) {
                resolve({ message: stdout })
            } else {
                reject(new Error(`External script echo error: ${stderr}`))
            }
        })
    })
}
