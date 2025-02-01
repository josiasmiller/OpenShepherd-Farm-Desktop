import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<AnimalInfo[]>([])
  const [pythonEcho, setPythonEcho] = useState<EchoMessage>()
  const [rEcho, setREcho] = useState<EchoMessage>()

  const onQueryChanged = async (event: any) => {
    const query = event.target.value
    setQuery(query)
    const results = await window.electron.queryAnimals(query)
    setResults(results)
    const pythonEchoMessage = await window.electron.echoInPython(query)
    setPythonEcho(pythonEchoMessage)
    const rEchoMessage = await window.electron.echoInR(query)
    setREcho(rEchoMessage)
  }

  return (
    <>
      <div style={{ height: 120 }}>
        <input name="searchTerm" type="text" value={query} onChange={onQueryChanged}/>
      </div>
      <div style={{ height: '200px', overflow: 'scroll' }}>
        {results.map((item, index) => (
          <div key={index}>{item.name} {item.sireName} {item.damName}</div>
        ))}
      </div>
      <div>{pythonEcho?.message ?? "No message echoed from Python."}</div>
      <div>{rEcho?.message ?? "No message echoed from R."}</div>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
