import { useState, useEffect } from 'react'
import countryService from './services/countries'
import axios from 'axios'
import { CountryList, Display } from './components/Country'

function App() {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [country, setCountry] = useState(null)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleCountryClick = (country) => {
    setCountry(country)
  }

  useEffect(() => {
    countryService
      .getAll()
      .then((response => setCountries(response.data)))
  }, [])

  useEffect(() => {
    setFilteredCountries(
      countries.filter(country => 
        country.name.common.toLowerCase().includes(value.toLowerCase())
      )
    )
  }, [value])

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0])
    } else {
      setCountry(null)
    }
  }, [filteredCountries])

  return (
    <>
      <form>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <CountryList
        filteredCountries={filteredCountries}
        handleCountryClick={handleCountryClick}
      />
      <Display country={country} />
    </>
  )
}

export default App
