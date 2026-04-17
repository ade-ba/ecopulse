# 🌿 EcoPulse — Sustainability Dashboard

> Single-page weather & air quality dashboard · Vite + React + Tailwind CSS

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 API Integration (OpenWeatherMap)

### Step 1 — Get a free API key
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Create a free account
3. Go to **API Keys** tab in your profile
4. Copy your key (it activates within ~10 minutes)

### Step 2 — Add the key to your project
Create a `.env` file in the project root:
```
VITE_OWM_KEY=your_actual_key_here
```

> ⚠️ **Important:** In Vite, env variables must start with `VITE_` to be accessible in the browser.
> Never commit your `.env` file — it is already in `.gitignore`.

### Step 3 — That's it!
The app automatically detects the key in `src/context/AppContext.jsx` via:
```js
const apiKey = import.meta.env.VITE_OWM_KEY || 'YOUR_API_KEY_HERE'
```
When a real key is present, the app calls:
- `GET /data/2.5/weather` — current conditions
- `GET /data/2.5/air_pollution` — AQI, PM2.5, PM10, NO₂, O₃
- `GET /data/2.5/forecast` — 5-day / 3-hour data → built into 7-day + hourly
- `GET /geo/1.0/direct` — **city search** (any city in the world)

Without a key, the app runs with realistic **simulated data** so you can still develop and demo.

---

## 🌍 City Search

- Type any city name in the search bar
- With an API key: returns real results from OpenWeatherMap's global geocoding database (millions of cities)
- Without a key: filters a built-in list of 20 major cities

---

## 🌙 Dark / Light Mode

Click the **sun/moon** icon in the top-right navbar. The preference is saved to `localStorage` and persists across sessions. The toggle works by adding/removing the `dark` class on `<html>`, which Tailwind's `darkMode: 'class'` strategy uses.

---

## ⭐ Favorites

- Star (☆) the **current city** using the button in the weather hero card
- Saved cities appear in the **Saved Locations** panel on the right
- Click any saved city card to instantly switch to it
- Remove favorites by hovering the card and clicking the trash icon

---

## 📁 File Structure

```
ecopulse/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env                    ← Create this (not included)
├── .gitignore
├── README.md
├── vercel.json
├── netlify.toml
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css           ← Tailwind directives + base styles
    ├── App.jsx             ← Single page layout
    ├── context/
    │   └── AppContext.jsx  ← All state, API calls, theme, city search
    └── components/
        ├── Navbar.jsx        ← Top bar with search + theme toggle
        ├── CitySearch.jsx    ← Real-time city search with dropdown
        ├── WeatherHero.jsx   ← Current weather + stats
        ├── HourlyForecast.jsx← Next 24h hourly strip
        ├── WeeklyForecast.jsx← 7-day forecast with temp range bars
        ├── AirQuality.jsx    ← Gauge rings + 7-day trend chart
        └── Favorites.jsx     ← Saved cities panel
```

---

## 🛠 Tech Stack

| | |
|---|---|
| Bundler | Vite 5 |
| Framework | React 18 |
| Styling | Tailwind CSS 3 (dark mode via `class`) |
| Charts | Recharts 2 |
| Icons | Lucide React |
| State | React Context API |
| HTTP | fetch / Axios |
| Persistence | localStorage (theme + favorites) |
| Fonts | Syne · Space Mono · DM Sans |

---

## 🚀 Deploy

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag the /dist folder to netlify.com/drop
```

Add your `VITE_OWM_KEY` as an **environment variable** in the Vercel/Netlify dashboard.
