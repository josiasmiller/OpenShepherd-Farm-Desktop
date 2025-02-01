
type AnimalInfo = {
    name: string,
    sireName: string,
    damName: string
}

type EchoMessage = {
    message: string
}

type EventPayloadMapping = {
    queryAnimals: AnimalInfo[],
    echoInPython: EchoMessage,
    echoInR: EchoMessage
}

type UnsubscribeFunction = () => void

interface Window {
    electron: {
        queryAnimals: (query: string) => Promise<AnimalInfo[]>
        echoInPython: (query: string) => Promise<EchoMessage>
        echoInR: (query: string) => Promise<EchoMessage>
    }
}
