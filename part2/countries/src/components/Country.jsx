export const Display = ({ country, weather }) => {
  if (country === null || weather === null) {
    return null;
  }

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
          {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>
          )}
        </ul>
      </div>
      <img
        src={country.flags.svg}
        style={{ width: '200px', height: '200px' }}
      />
      <div>
        <h2>Weather in {country.capital.toString()}</h2>
        <p>temperature {weather.current.temp} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} />
        <p>wind {weather.current.wind_speed}</p>
      </div>
    </div>
  );
};

export const CountryList = ({ filteredCountries, handleCountryClick }) => {
  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specifiy another filter</p>
    );
  } else if (filteredCountries.length > 1) {
    return (
      filteredCountries.map(country => <p key={country.name.common}>
        {country.name.common} <button onClick={() => handleCountryClick(country)}>show</button>
      </p>
      )
    );
  }

  return null;
};
