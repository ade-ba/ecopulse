import { AppProvider, useApp } from './context/AppContext'
import Navbar           from './components/Navbar'
import WeatherHero      from './components/WeatherHero'
import HourlyForecast   from './components/HourlyForecast'
import WeeklyForecast   from './components/WeeklyForecast'
import AirQuality       from './components/AirQuality'
import WeatherCharts    from './components/WeatherCharts'
import Favorites        from './components/Favorites'

function Dashboard() {
  const { error } = useApp()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        className="dark:block hidden fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,160,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.025) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 pb-16">

          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm font-medium animate-fade-in">
              ⚠ {error}
            </div>
          )}

          {/* Live indicator */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-blink" />
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Live data · {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Main grid layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Left column — weather */}
            <div className="xl:col-span-2 flex flex-col gap-5">
              <WeatherHero />
              <HourlyForecast />
              <AirQuality />
              <WeatherCharts />
            </div>

            {/* Right column — forecast + favorites */}
            <div className="flex flex-col gap-5">
              <WeeklyForecast />
              <Favorites />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 pt-5 border-t border-black/6 dark:border-white/6 flex items-center justify-between flex-wrap gap-2">
            <p className="font-mono text-[10px] text-slate-300 dark:text-slate-600 uppercase tracking-widest">
              EcoPulse · SWD 413 Project
            </p>
            <p className="font-mono text-[10px] text-slate-300 dark:text-slate-600">
              Powered by OpenWeatherMap API
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
