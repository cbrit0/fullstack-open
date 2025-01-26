import axios from "axios"
const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall'
const apiKey = import.meta.env.VITE_WEATHERAPP_KEY

const getWeather = (lat, lon) => {
  return axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
}

export default { getWeather }
