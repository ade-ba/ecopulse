import { Star, MapPin, Trash2, Wind, Droplets } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Favorites() {
  const { favorites, toggleFavorite, weatherData: w, city, selectCity } = useApp()

  // Only show city favorites (not section favorites)
  const cityFavs = favorites.filter(f => f.startsWith('city-'))

  if (cityFavs.length === 0 && !favorites.includes('section-airquality')) return null

  return (
    <div className="glass-card p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          ⭐ Saved Locations
        </p>
        {cityFavs.length > 0 && (
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            {cityFavs.length} saved
          </span>
        )}
      </div>

      {cityFavs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500">
          <Star size={32} strokeWidth={1} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Star any city to save it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cityFavs.map((fav, i) => {
            const cityName = fav.replace('city-', '')
            const isCurrent = city.name === cityName
            // Simulate quick stats for saved cities
            const seed = cityName.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
            const temp = 15 + (seed % 23)
            const hum  = 30 + (seed % 60)
            const wind = 5  + (seed % 35)
            const icons = ['☀️','⛅','🌤️','☁️','🌦️']
            const icon  = icons[seed % icons.length]

            return (
              <button
                key={fav}
                onClick={() => selectCity({ name: cityName, country: '', lat: 0, lon: 0 })}
                className={`
                  relative text-left p-4 rounded-xl border
                  transition-all duration-200 cursor-pointer group
                  ${isCurrent
                    ? 'bg-brand-green/8 dark:bg-brand-green/10 border-brand-green/30'
                    : 'bg-black/3 dark:bg-white/3 border-black/6 dark:border-white/6 hover:border-black/12 dark:hover:border-white/12'
                  }
                `}
              >
                {/* Remove button */}
                <button
                  onClick={e => { e.stopPropagation(); toggleFavorite(fav) }}
                  className="
                    absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center
                    rounded-lg opacity-0 group-hover:opacity-100
                    bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white
                    transition-all duration-200
                  "
                >
                  <Trash2 size={11} />
                </button>

                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={11} className="text-brand-green" />
                  <p className="font-display font-bold text-sm text-slate-800 dark:text-white">{cityName}</p>
                  {isCurrent && (
                    <span className="font-mono text-[9px] text-brand-green border border-brand-green/30 bg-brand-green/10 px-1.5 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-display font-extrabold text-xl text-slate-800 dark:text-white">{temp}°</span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    <Droplets size={9} className="text-brand-blue" />{hum}%
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    <Wind size={9} className="text-brand-green" />{wind} km/h
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
