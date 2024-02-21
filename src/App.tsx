import Map from './components/Map'
import './App.css'
import { useState } from 'react'
import InfoBox from './components/InfoBox'

function App() {
  const [country, setCountry] = useState<string>()

  return (
    <>
      <Map onCountrySelect={setCountry} />
      {country !== undefined && <InfoBox countryCode={country} />}
    </>
  )
}

export default App
