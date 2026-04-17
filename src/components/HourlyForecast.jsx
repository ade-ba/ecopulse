import { useApp } from '../context/AppContext'
import { Droplets } from 'lucide-react'

export default function HourlyForecast() {
  const { weatherData: w, loading } = useApp()

  if (loading) return (
    <div className="glass-card p-5 animate-fade-up">
      <div className="skeleton h-4 w-32 mb-4" />
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-20 w-16 flex-shrink-0 rounded-xl" />)}
      </div>
    </div>
  )

  if (!w?.hourly?.length) return null

  return (
    <div className="glass-card p-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
      <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Hourly Forecast</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {w.hourly.map((h, i) => (
          <div
            key={i}
            className={`
              flex-shrink-0 flex flex-col items-center gap-1.5 px-3.5 py-3 rounded-xl
              transition-all duration-200 cursor-default
              ${i === 0
                ? 'bg-brand-green/10 border border-brand-green/30 dark:bg-brand-green/15'
                : 'bg-black/4 dark:bg-white/4 border border-transparent hover:border-white/10'
              }
            `}
          >
            <p className={`font-mono text-[10px] ${i === 0 ? 'text-brand-green' : 'text-slate-400 dark:text-slate-500'}`}>
              {i === 0 ? 'Now' : h.time}
            </p>
            <span className="text-xl">{h.icon}</span>
            <p className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">{h.temp}°</p>
            {h.rain > 0 && (
              <div className="flex items-center gap-0.5 text-brand-blue">
                <Droplets size={9} />
                <span className="font-mono text-[9px]">{h.rain}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
