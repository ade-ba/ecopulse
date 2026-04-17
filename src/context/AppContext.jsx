import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

// ── Theme ─────────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ep_theme') || 'dark')
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('ep_theme', theme)
  }, [theme])
  return [theme, () => setTheme(t => t === 'dark' ? 'light' : 'dark')]
}

// ── Simulated weather (used when no API key is set) ───────────────────────────
function simulateWeather(cityName) {
  const s = cityName.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const r = (min, max, o = 0) => min + ((s + o) % (max - min))
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny', 'Overcast', 'Drizzle', 'Windy']
  const icons      = ['☀️', '⛅', '☁️', '🌦️', '🌤️', '🌥️', '🌧️', '💨']
  const idx = s % conditions.length
  return {
    temp:       r(12, 38, 1),
    feelsLike:  r(10, 36, 2),
    humidity:   r(28, 92, 3),
    windSpeed:  r(4,  45, 4),
    windDir:    ['N','NE','E','SE','S','SW','W','NW'][s % 8],
    pressure:   r(1005, 1025, 5),
    visibility: r(5, 20, 6),
    uvIndex:    r(1, 11, 7),
    dewPoint:   r(8, 24, 8),
    condition:  conditions[idx],
    icon:       icons[idx],
    aqi:        r(18, 175, 9),
    pm25:       r(8, 85, 10),
    pm10:       r(15, 110, 11),
    co2:        r(345, 490, 12),
    no2:        r(10, 80, 13),
    o3:         r(30, 120, 14),
    forecast: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i)
      return {
        day:       i === 0 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' }),
        high:      r(18, 38, i * 3 + 1),
        low:       r(8,  20, i * 3 + 2),
        icon:      icons[(s + i) % icons.length],
        condition: conditions[(s + i) % conditions.length],
        rain:      r(0, 80, i * 3 + 3),
      }
    }),
    hourly: Array.from({ length: 8 }, (_, i) => {
      const h = new Date(); h.setHours(h.getHours() + i * 3)
      return {
        time: h.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
        temp: r(14, 36, i * 5 + 1),
        icon: icons[(s + i) % icons.length],
        rain: r(0, 70, i * 5 + 2),
      }
    }),
    aqTrend: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return {
        day:  d.toLocaleDateString('en', { weekday: 'short' }),
        pm25: r(8,  85,  i * 7 + 1),
        pm10: r(15, 110, i * 7 + 2),
        aqi:  r(18, 175, i * 7 + 3),
      }
    }),
  }
}

function getAQI(aqi) {
  if (aqi <= 50)  return { label: 'Good',        color: '#00e5a0', bg: 'bg-brand-green/10', text: 'text-brand-green' }
  if (aqi <= 100) return { label: 'Moderate',     color: '#ffb800', bg: 'bg-brand-amber/10', text: 'text-brand-amber' }
  if (aqi <= 150) return { label: 'Unhealthy*',   color: '#ff8c00', bg: 'bg-orange-500/10',  text: 'text-orange-400' }
  return               { label: 'Unhealthy',      color: '#ff4757', bg: 'bg-brand-red/10',   text: 'text-brand-red'  }
}

// ── Static fallback city list (used when no API key) ──────────────────────────
const FALLBACK_CITIES = [
  { name: 'Lagos',          country: 'NG', lat:  6.5244,  lon:   3.3792 },
  { name: 'Abuja',          country: 'NG', lat:  9.0765,  lon:   7.3986 },
  { name: 'Port Harcourt',  country: 'NG', lat:  4.8156,  lon:   7.0498 },
  { name: 'Kano',           country: 'NG', lat: 12.0022,  lon:   8.5920 },
  { name: 'Ibadan',         country: 'NG', lat:  7.3775,  lon:   3.9470 },
  { name: 'Nairobi',        country: 'KE', lat: -1.2921,  lon:  36.8219 },
  { name: 'Cairo',          country: 'EG', lat: 30.0444,  lon:  31.2357 },
  { name: 'Accra',          country: 'GH', lat:  5.5600,  lon:  -0.2057 },
  { name: 'Johannesburg',   country: 'ZA', lat:-26.2041,  lon:  28.0473 },
  { name: 'Dar es Salaam',  country: 'TZ', lat: -6.7924,  lon:  39.2083 },
  { name: 'Kigali',         country: 'RW', lat: -1.9441,  lon:  30.0619 },
  { name: 'Addis Ababa',    country: 'ET', lat:  9.0250,  lon:  38.7469 },
  { name: 'London',         country: 'GB', lat: 51.5074,  lon:  -0.1278 },
  { name: 'Paris',          country: 'FR', lat: 48.8566,  lon:   2.3522 },
  { name: 'Berlin',         country: 'DE', lat: 52.5200,  lon:  13.4050 },
  { name: 'Madrid',         country: 'ES', lat: 40.4168,  lon:  -3.7038 },
  { name: 'Rome',           country: 'IT', lat: 41.9028,  lon:  12.4964 },
  { name: 'New York',       country: 'US', lat: 40.7128,  lon: -74.0060 },
  { name: 'Los Angeles',    country: 'US', lat: 34.0522,  lon:-118.2437 },
  { name: 'Chicago',        country: 'US', lat: 41.8781,  lon: -87.6298 },
  { name: 'Toronto',        country: 'CA', lat: 43.6532,  lon: -79.3832 },
  { name: 'Dubai',          country: 'AE', lat: 25.2048,  lon:  55.2708 },
  { name: 'Mumbai',         country: 'IN', lat: 19.0760,  lon:  72.8777 },
  { name: 'Delhi',          country: 'IN', lat: 28.7041,  lon:  77.1025 },
  { name: 'Tokyo',          country: 'JP', lat: 35.6762,  lon: 139.6503 },
  { name: 'Beijing',        country: 'CN', lat: 39.9042,  lon: 116.4074 },
  { name: 'Sydney',         country: 'AU', lat:-33.8688,  lon: 151.2093 },
  { name: 'Sao Paulo',      country: 'BR', lat:-23.5505,  lon: -46.6333 },
  { name: 'Mexico City',    country: 'MX', lat: 19.4326,  lon: -99.1332 },
  { name: 'Seoul',          country: 'KR', lat: 37.5665,  lon: 126.9780 },
]

// ── City search ───────────────────────────────────────────────────────────────
async function searchCities(query, apiKey) {
  if (!query || query.trim().length < 2) return []

  const trimmedKey = (apiKey || '').trim()
  const hasKey = trimmedKey !== '' &&
                 trimmedKey !== 'YOUR_KEY_HERE' &&
                 trimmedKey !== 'YOUR_API_KEY_HERE'

  // Real OpenWeatherMap Geocoding API
  if (hasKey) {
    try {
      const url = 'https://api.openweathermap.org/geo/1.0/direct' +
        '?q=' + encodeURIComponent(query.trim()) +
        '&limit=8' +
        '&appid=' + trimmedKey

      const res = await fetch(url)

      if (!res.ok) {
        const errText = await res.text()
        console.warn('Geocoding API HTTP error', res.status, errText)
        // Key might be invalid or not activated yet — fall through to static list
      } else {
        const data = await res.json()

        if (!Array.isArray(data)) {
          // API returned an error object like { cod: '401', message: '...' }
          console.warn('Geocoding API returned error object:', data)
          // Fall through to static list
        } else {
          // Success — return real results (may be empty if city not found)
          return data.map(c => ({
            name:    c.name,
            country: c.country,
            state:   c.state || '',
            lat:     c.lat,
            lon:     c.lon,
          }))
        }
      }
    } catch (err) {
      console.warn('Geocoding fetch failed (CORS / network?):', err.message)
      // Fall through to static list
    }
  }

  // Fallback — filter static list by substring match (case-insensitive)
  const q = query.trim().toLowerCase()
  return FALLBACK_CITIES
    .filter(c => c.name.toLowerCase().includes(q))
    .slice(0, 8)
}

// ── Fetch real weather from OpenWeatherMap ────────────────────────────────────
async function fetchWeatherData(city, apiKey) {
  const trimmedKey = (apiKey || '').trim()
  const hasKey = trimmedKey !== '' &&
                 trimmedKey !== 'YOUR_KEY_HERE' &&
                 trimmedKey !== 'YOUR_API_KEY_HERE'

  if (hasKey && city.lat && city.lon) {
    try {
      const base = 'https://api.openweathermap.org'
      const key  = '&appid=' + trimmedKey

      const [wRes, aqRes, fcRes] = await Promise.all([
        fetch(base + '/data/2.5/weather?lat=' + city.lat + '&lon=' + city.lon + key + '&units=metric'),
        fetch(base + '/data/2.5/air_pollution?lat=' + city.lat + '&lon=' + city.lon + key),
        fetch(base + '/data/2.5/forecast?lat=' + city.lat + '&lon=' + city.lon + key + '&units=metric&cnt=56'),
      ])

      if (!wRes.ok) throw new Error('Weather API ' + wRes.status)

      const [w, aq, fc] = await Promise.all([wRes.json(), aqRes.json(), fcRes.json()])

      const aqiRaw = aq.list?.[0]?.main?.aqi || 1
      const aqi    = aqiRaw * 40
      const comp   = aq.list?.[0]?.components || {}

      const icons = { Clear:'☀️', Clouds:'☁️', Rain:'🌧️', Drizzle:'🌦️', Thunderstorm:'⛈️', Snow:'🌨️', Mist:'🌫️', Fog:'🌫️' }
      const getIcon = (main) => icons[main] || '⛅'

      // Build 7-day from 3-hourly
      const dayMap = {}
      fc.list?.forEach(item => {
        const date = item.dt_txt.split(' ')[0]
        if (!dayMap[date]) dayMap[date] = []
        dayMap[date].push(item)
      })
      const forecast = Object.entries(dayMap).slice(0, 7).map(([date, items], i) => {
        const temps = items.map(it => it.main.temp)
        const d = new Date(date)
        return {
          day:       i === 0 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' }),
          high:      Math.round(Math.max(...temps)),
          low:       Math.round(Math.min(...temps)),
          icon:      getIcon(items[Math.floor(items.length / 2)]?.weather[0]?.main),
          condition: items[0]?.weather[0]?.description || '',
          rain:      Math.round((items.filter(it => (it.pop || 0) > 0.3).length / items.length) * 100),
        }
      })

      const hourly = (fc.list || []).slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        icon: getIcon(item.weather?.[0]?.main),
        rain: Math.round((item.pop || 0) * 100),
      }))

      return {
        temp:       Math.round(w.main.temp),
        feelsLike:  Math.round(w.main.feels_like),
        humidity:   w.main.humidity,
        windSpeed:  Math.round((w.wind?.speed || 0) * 3.6),
        windDir:    ['N','NE','E','SE','S','SW','W','NW'][Math.round((w.wind?.deg || 0) / 45) % 8],
        pressure:   w.main.pressure,
        visibility: Math.round((w.visibility || 10000) / 1000),
        uvIndex:    4,
        dewPoint:   Math.round(w.main.temp - ((100 - w.main.humidity) / 5)),
        condition:  w.weather?.[0]?.main || 'Clear',
        icon:       getIcon(w.weather?.[0]?.main),
        aqi,
        pm25:  Math.round(comp.pm2_5 || 20),
        pm10:  Math.round(comp.pm10  || 35),
        co2:   380,
        no2:   Math.round(comp.no2   || 30),
        o3:    Math.round(comp.o3    || 60),
        forecast,
        hourly,
        aqTrend: simulateWeather(city.name).aqTrend,
      }
    } catch (err) {
      console.error('fetchWeatherData error:', err.message)
    }
  }

  // Fallback — simulated data
  return simulateWeather(city.name)
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [theme, toggleTheme] = useTheme()

  const apiKey = (import.meta.env.VITE_OWM_KEY || '').trim()

  const [city,        setCity]        = useState({ name: 'Lagos', country: 'NG', lat: 6.5244, lon: 3.3792 })
  const [weatherData, setWeatherData] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [favorites,   setFavorites]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('ep_favs') || '[]') } catch { return [] }
  })

  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchTimeout = useRef(null)

  useEffect(() => {
    localStorage.setItem('ep_favs', JSON.stringify(favorites))
  }, [favorites])

  const loadWeather = useCallback(async (c) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeatherData(c, apiKey)
      setWeatherData({ ...data, aqiInfo: getAQI(data.aqi), city: c })
    } catch {
      setError('Failed to load weather data. Check your API key.')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => { loadWeather(city) }, [city, loadWeather])

  // Debounced city search
  const handleSearchChange = useCallback((q) => {
    setSearchQuery(q)
    clearTimeout(searchTimeout.current)
    if (!q.trim()) { setSearchResults([]); return }
    setSearchLoading(true)
    searchTimeout.current = setTimeout(async () => {
      try {
        const results = await searchCities(q, apiKey)
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 350)
  }, [apiKey])

  const selectCity = useCallback((c) => {
    setCity(c)
    setSearchQuery('')
    setSearchResults([])
  }, [])

  const toggleFavorite = (id) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  return (
    <Ctx.Provider value={{
      theme, toggleTheme,
      city, selectCity,
      weatherData, loading, error,
      favorites, toggleFavorite,
      searchQuery, handleSearchChange,
      searchResults, searchLoading,
      refetch: () => loadWeather(city),
      getAQI,
    }}>
      {children}
    </Ctx.Provider>
  )
}
