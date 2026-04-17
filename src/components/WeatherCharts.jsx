import { useState } from 'react'
import { BarChart2, TrendingUp } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts'
import { useApp } from '../context/AppContext'

// Generate 7-day weather data from city name seed
function genWeeklyStats(cityName) {
  const s = cityName.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const r = (min, max, o = 0) => min + ((s + o) % (max - min))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      day:      i === 6 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' }),
      high:     r(18, 38, i * 3 + 1),
      low:      r(8,  20, i * 3 + 2),
      humidity: r(28, 90, i * 4 + 3),
      wind:     r(4,  42, i * 5 + 4),
      rain:     r(0,  80, i * 6 + 5),
    }
  })
}

// Pie data — breakdown of today's weather metrics as %of their max
function genPieData(w) {
  if (!w) return []
  return [
    { name: 'Humidity',    value: w.humidity,                 color: '#00aaff' },
    { name: 'Wind',        value: Math.min(w.windSpeed, 100), color: '#00e5a0' },
    { name: 'UV Index',    value: w.uvIndex * 9,              color: '#ffb800' },
    { name: 'Cloud Cover', value: 100 - Math.min(w.visibility * 5, 100), color: '#a855f7' },
  ]
}

const METRICS = ['high', 'low', 'humidity', 'wind']
const METRIC_LABELS = { high: 'High °C', low: 'Low °C', humidity: 'Humidity %', wind: 'Wind km/h' }
const METRIC_COLORS = { high: '#ff4757', low: '#00aaff', humidity: '#a855f7', wind: '#00e5a0' }

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-dark-700 border border-black/8 dark:border-white/10 rounded-xl px-3.5 py-2.5 shadow-card">
      <p className="font-mono text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-xs mt-0.5" style={{ color: METRIC_COLORS[p.dataKey] || p.color }}>
          {METRIC_LABELS[p.dataKey] || p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function PieTip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-dark-700 border border-black/8 dark:border-white/10 rounded-xl px-3.5 py-2.5 shadow-card">
      <p className="text-xs font-semibold" style={{ color: payload[0].payload.color }}>
        {payload[0].name}
      </p>
      <p className="font-mono text-xs text-slate-400">{payload[0].value}%</p>
    </div>
  )
}

export default function WeatherCharts() {
  const { weatherData: w, city } = useApp()
  const [chartType, setChartType] = useState('bar')
  const [filter,    setFilter]    = useState('all')

  const weeklyData   = genWeeklyStats(city.name)
  const pieData      = genPieData(w)
  const activeMetrics = filter === 'all' ? METRICS : [filter]

  const tickStyle = { fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Mono' }

  return (
    <div className="glass-card p-5 sm:p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
            Weather Analytics
          </h2>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
            {city.name} · 7-day breakdown
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Bar / Line toggle */}
          <div className="flex bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 rounded-xl overflow-hidden">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
                ${chartType === 'bar'
                  ? 'bg-brand-green/10 text-brand-green'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              <BarChart2 size={13} /> Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer
                ${chartType === 'line'
                  ? 'bg-brand-green/10 text-brand-green'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              <TrendingUp size={13} /> Line
            </button>
          </div>

          {/* Metric filter */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="
              bg-black/5 dark:bg-white/5
              border border-black/8 dark:border-white/8
              rounded-xl text-xs font-sans
              text-slate-700 dark:text-slate-200
              px-3 py-1.5 cursor-pointer appearance-none
              focus:outline-none focus:border-brand-green/50
              transition-all duration-200
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '26px',
            }}
          >
            <option value="all">All Metrics</option>
            {METRICS.map(m => <option key={m} value={m}>{METRIC_LABELS[m]}</option>)}
          </select>
        </div>
      </div>

      {/* Bar / Line chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={240}>
          {chartType === 'bar' ? (
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans', paddingTop: 12 }} />
              {activeMetrics.map(m => (
                <Bar key={m} dataKey={m} name={METRIC_LABELS[m]} fill={METRIC_COLORS[m]} radius={[4, 4, 0, 0]} maxBarSize={28} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans', paddingTop: 12 }} />
              {activeMetrics.map(m => (
                <Line key={m} type="monotone" dataKey={m} name={METRIC_LABELS[m]} stroke={METRIC_COLORS[m]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Pie + Today's Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-black/5 dark:border-white/5">

        {/* Pie chart — today's conditions breakdown */}
        <div>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Today's Conditions
          </p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={32} outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-2 flex-1">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">{d.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7-day summary stats */}
        <div>
          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            7-Day Summary
          </p>
          <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
            {[
              { label: 'Avg High',     value: `${Math.round(weeklyData.reduce((a,d) => a + d.high, 0) / 7)}°C`,     color: 'text-brand-red'    },
              { label: 'Avg Low',      value: `${Math.round(weeklyData.reduce((a,d) => a + d.low, 0) / 7)}°C`,      color: 'text-brand-blue'   },
              { label: 'Avg Humidity', value: `${Math.round(weeklyData.reduce((a,d) => a + d.humidity, 0) / 7)}%`,  color: 'text-brand-purple' },
              { label: 'Avg Wind',     value: `${Math.round(weeklyData.reduce((a,d) => a + d.wind, 0) / 7)} km/h`,  color: 'text-brand-green'  },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">{f.label}</span>
                <span className={`font-display font-bold text-base ${f.color}`}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
