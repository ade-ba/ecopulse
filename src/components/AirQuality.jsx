import { Star } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { useApp } from '../context/AppContext'

const POLLUTANTS = [
  { key:'pm25', label:'PM2.5', unit:'μg/m³', safe:25,  max:80,  color:'#00e5a0' },
  { key:'pm10', label:'PM10',  unit:'μg/m³', safe:50,  max:110, color:'#00aaff' },
  { key:'no2',  label:'NO₂',   unit:'μg/m³', safe:40,  max:80,  color:'#ffb800' },
  { key:'o3',   label:'O₃',    unit:'μg/m³', safe:100, max:130, color:'#a855f7' },
]

function GaugeRing({ value, max, color, label, unit, safe }) {
  const pct = Math.min((value / max) * 100, 100)
  const r   = 32
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const isSafe = value <= safe

  return (
    <div className="
      flex flex-col items-center gap-2 p-4
      bg-black/4 dark:bg-white/4
      border border-black/6 dark:border-white/6
      rounded-2xl
      hover:border-black/12 dark:hover:border-white/12
      transition-all duration-200
    ">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={r} fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-lg leading-none text-slate-800 dark:text-white" style={{ color }}>
            {value}
          </span>
          <span className="font-mono text-[8px] text-slate-400 dark:text-slate-500">{unit}</span>
        </div>
      </div>
      <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
      <span className={`font-mono text-[10px] font-bold uppercase tracking-wide ${isSafe ? 'text-brand-green' : 'text-brand-red'}`}>
        {isSafe ? '✓ Safe' : '⚠ High'}
      </span>
    </div>
  )
}

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-dark-700 border border-black/8 dark:border-white/10 rounded-xl px-3.5 py-2.5 shadow-card">
      <p className="font-mono text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs mt-0.5">
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function AirQualitySection() {
  const { weatherData: w, loading, favorites, toggleFavorite } = useApp()
  const favId = 'section-airquality'
  const isFav = favorites.includes(favId)

  if (loading) return (
    <div className="glass-card p-5 animate-fade-up">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
      </div>
      <div className="skeleton h-52 rounded-xl" />
    </div>
  )

  if (!w) return null

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide border"
              style={{ color: w.aqiInfo.color, background: w.aqiInfo.color + '18', borderColor: w.aqiInfo.color + '40' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: w.aqiInfo.color }} />
              AQI {w.aqi} · {w.aqiInfo.label}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Air Quality</h2>
        </div>
        <button
          onClick={() => toggleFavorite(favId)}
          className={`
            w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer
            transition-all duration-200
            ${isFav
              ? 'bg-brand-amber/10 border-brand-amber/40 text-brand-amber'
              : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-400 hover:text-brand-amber hover:border-brand-amber/40'
            }
          `}
        >
          <Star size={15} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {POLLUTANTS.map(p => (
          <GaugeRing key={p.key} value={w[p.key]} {...p} />
        ))}
      </div>

      {/* Trend chart */}
      <div>
        <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          7-Day Air Quality Trend
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={w.aqTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="gPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00e5a0" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#00aaff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00aaff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill:'#94a3b8', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
            <YAxis                tick={{ fill:'#94a3b8', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize:11, fontFamily:'DM Sans', paddingTop:8 }} />
            <Area type="monotone" dataKey="pm25" name="PM2.5" stroke="#00e5a0" strokeWidth={2} fill="url(#gPm25)" dot={false} />
            <Area type="monotone" dataKey="pm10" name="PM10"  stroke="#00aaff" strokeWidth={2} fill="url(#gPm10)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
