import { Droplets } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function WeeklyForecast() {
  const { weatherData: w, loading } = useApp()

  if (loading) return (
    <div className="glass-card p-5 animate-fade-up">
      <div className="skeleton h-4 w-36 mb-4" />
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-7 w-7 rounded-full" />
          <div className="skeleton h-3 w-20 ml-auto" />
        </div>
      ))}
    </div>
  )

  if (!w?.forecast?.length) return null

  const allTemps = w.forecast.flatMap(d => [d.high, d.low])
  const minT = Math.min(...allTemps)
  const maxT = Math.max(...allTemps)

  return (
    <div className="glass-card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">7-Day Forecast</p>

      <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
        {w.forecast.map((day, i) => {
          const barLeft  = ((day.low - minT) / (maxT - minT)) * 100
          const barWidth = ((day.high - day.low) / (maxT - minT)) * 100

          return (
            <div key={i} className="flex items-center gap-3 py-2.5 group">
              {/* Day */}
              <p className={`font-mono text-xs w-10 flex-shrink-0 ${i === 0 ? 'text-brand-green font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {day.day}
              </p>

              {/* Icon */}
              <span className="text-lg w-7 flex-shrink-0 text-center">{day.icon}</span>

              {/* Rain chance */}
              {day.rain > 10 ? (
                <div className="flex items-center gap-0.5 text-brand-blue w-10 flex-shrink-0">
                  <Droplets size={10} />
                  <span className="font-mono text-[10px]">{day.rain}%</span>
                </div>
              ) : <div className="w-10 flex-shrink-0" />}

              {/* Temp range bar */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 w-8 text-right flex-shrink-0">{day.low}°</span>
                <div className="relative flex-1 h-1.5 bg-black/6 dark:bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-amber"
                    style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-200 w-8 flex-shrink-0">{day.high}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
