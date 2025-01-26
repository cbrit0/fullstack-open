import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ filteredCountries }) => {
  if (filteredCountries.length === 0) {
    return null
  }
  if (filteredCountries.length > 10) {
    return (
      <p>
        Too many matches, specifiy another filter
      </p>
    )
  } else if (filteredCountries.length > 1) {
    return (
      filteredCountries.map(country =>
        <p key={country.name.common}>{country.name.common}</p>
      )
    )
  } else {
    const country = filteredCountries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>
          <p>capital {country.capital.toString()}</p>
          <p>area {country.area}</p>
        </div>
        <div>
          <p><b>languages:</b></p>
          <ul>
            {Object.keys(country.languages).map(key =>
              <li key={key}>{country.languages[key]}</li>
            )}
          </ul>
        </div>
        <img
          src={country.flags.svg}
          style={{ width: '200px', height: '200px' }}
        />
      </div>
    )
  }
}

function App() {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response => setCountries(response.data)))
  }, [])

  useEffect(() => {
    setFilteredCountries(
      countries.filter(country => 
        country.name.common.toLowerCase().includes(value.toLowerCase())
      )
    )
  }, [value])

  return (
    <>
      <form>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Country filteredCountries={filteredCountries} />
    </>
  )
}

export default App
