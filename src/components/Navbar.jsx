import { Sun, Moon, RefreshCw, Leaf } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CitySearch from './CitySearch'

export default function Navbar() {
  const { theme, toggleTheme, loading, refetch } = useApp()

  return (
    <nav className="
      sticky top-0 z-40
      bg-white/80 dark:bg-dark-900/80
      backdrop-blur-xl
      border-b border-black/6 dark:border-white/6
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="
              w-8 h-8 flex items-center justify-center rounded-lg
              bg-brand-green/15 dark:bg-brand-green/10
              border border-brand-green/40
              text-brand-green
            ">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              EcoPulse
            </span>
          </div>

          {/* Spacer */}
          <div className="hidden sm:block flex-1" />

          {/* City search */}
          <div className="flex-1 sm:flex-none sm:w-80">
            <CitySearch />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={refetch}
              disabled={loading}
              className="
                w-9 h-9 flex items-center justify-center rounded-xl
                text-slate-500 dark:text-slate-400
                hover:bg-black/5 dark:hover:bg-white/5
                hover:text-brand-green
                transition-all duration-200
                disabled:opacity-50
              "
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin-slow' : ''} />
            </button>

            <button
              onClick={toggleTheme}
              className="
                w-9 h-9 flex items-center justify-center rounded-xl
                text-slate-500 dark:text-slate-400
                hover:bg-black/5 dark:hover:bg-white/5
                hover:text-brand-amber
                transition-all duration-200
              "
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark'
                ? <Sun size={16} />
                : <Moon size={16} />
              }
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}
