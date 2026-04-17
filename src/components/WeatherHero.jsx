import { MapPin, Star, Droplets, Wind, Eye, Gauge, Thermometer, ArrowUp, ArrowDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

function StatPill({ icon: Icon, label, value, color = '' }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 ${color}`}>
        <Icon size={13} />
      </div>
      <div>
        <p className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none">{value}</p>
      </div>
    </div>
  )
}

export default function WeatherHero() {
  const { weatherData: w, loading, city, favorites, toggleFavorite } = useApp()
  const favId = `city-${city.name}`
  const isFav = favorites.includes(favId)

  if (loading) return (
    <div className="glass-card p-7 animate-fade-up">
      <div className="skeleton h-6 w-48 mb-4" />
      <div className="skeleton h-20 w-40 mb-4" />
      <div className="skeleton h-4 w-64 mb-6" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_,i) => <div key={i} className="skeleton h-12" />)}
      </div>
    </div>
  )

  if (!w) return null

  const aqiInfo = w.aqiInfo

  return (
    <div className="
      glass-card p-6 sm:p-8 overflow-hidden relative
      animate-fade-up
    ">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-glow-green opacity-60 dark:opacity-40 pointer-events-none rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-glow-blue opacity-40 dark:opacity-20 pointer-events-none rounded-full blur-3xl" />

      <div className="relative">
        {/* City name + favorite */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={13} className="text-brand-green" />
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {city.country}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              {city.name}
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en', { weekday:'long', month:'long', day:'numeric' })}
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(favId)}
            className={`
              w-10 h-10 flex items-center justify-center rounded-xl border
              transition-all duration-200 cursor-pointer flex-shrink-0
              ${isFav
                ? 'bg-brand-amber/10 border-brand-amber/40 text-brand-amber'
                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-400 hover:text-brand-amber hover:border-brand-amber/40'
              }
            `}
          >
            <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Main temp + condition */}
        <div className="flex items-end gap-6 mb-6">
          <div className="flex items-start gap-2">
            <span className="font-display font-extrabold text-7xl sm:text-8xl text-slate-900 dark:text-white leading-none tracking-tighter">
              {w.temp}
            </span>
            <span className="font-mono text-2xl text-slate-400 dark:text-slate-500 mt-3">°C</span>
          </div>
          <div className="mb-2">
            <div className="text-5xl mb-1 animate-float">{w.icon}</div>
            <p className="text-base font-semibold text-slate-600 dark:text-slate-300">{w.condition}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Feels like {w.feelsLike}°C</p>
          </div>
        </div>

        {/* AQI badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${aqiInfo.bg} ${aqiInfo.text}`}
          style={{ borderColor: aqiInfo.color + '40' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: aqiInfo.color }} />
          <span className="font-mono text-xs font-bold uppercase tracking-wide">AQI {w.aqi} · {aqiInfo.label}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-black/6 dark:border-white/6">
          <StatPill icon={Droplets}    label="Humidity"    value={`${w.humidity}%`}         color="text-brand-blue"  />
          <StatPill icon={Wind}        label="Wind"        value={`${w.windSpeed} km/h ${w.windDir}`} color="text-brand-green" />
          <StatPill icon={Eye}         label="Visibility"  value={`${w.visibility} km`}      color="text-brand-purple" />
          <StatPill icon={Gauge}       label="Pressure"    value={`${w.pressure} hPa`}       color="text-brand-amber" />
          <StatPill icon={Thermometer} label="Dew Point"   value={`${w.dewPoint}°C`}         color="text-brand-blue"  />
          <StatPill icon={ArrowUp}     label="UV Index"    value={w.uvIndex > 7 ? `${w.uvIndex} High` : `${w.uvIndex} Mod`} color="text-brand-amber" />
        </div>
      </div>
    </div>
  )
}
