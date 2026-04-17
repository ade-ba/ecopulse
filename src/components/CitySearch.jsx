import { useRef, useState, useEffect } from 'react'
import { Search, MapPin, Loader2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function CitySearch() {
  const {
    searchQuery, handleSearchChange,
    searchResults, searchLoading,
    selectCity, city,
  } = useApp()

  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const hasKey = (import.meta.env.VITE_OWM_KEY || '').trim() !== '' &&
                 (import.meta.env.VITE_OWM_KEY || '').trim() !== 'YOUR_KEY_HERE' &&
                 (import.meta.env.VITE_OWM_KEY || '').trim() !== 'YOUR_API_KEY_HERE'

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Open when results arrive or when typing
  useEffect(() => {
    if (searchResults.length > 0 || (searchQuery.length >= 2 && !searchLoading)) {
      setOpen(true)
    }
  }, [searchResults, searchQuery, searchLoading])

  const handleInput = (e) => {
    handleSearchChange(e.target.value)
    if (e.target.value.length >= 2) setOpen(true)
    else setOpen(false)
  }

  const handleSelect = (c) => {
    selectCity(c)
    setOpen(false)
  }

  const handleClear = () => {
    handleSearchChange('')
    setOpen(false)
  }

  const showDropdown = open && searchQuery.trim().length >= 2

  return (
    <div ref={wrapRef} className="relative w-full max-w-sm">
      {/* Input */}
      <div className="relative flex items-center">
        {searchLoading
          ? <Loader2 size={15} className="absolute left-3.5 text-brand-green animate-spin-slow pointer-events-none" />
          : <Search size={15} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        }
        <input
          type="text"
          value={searchQuery}
          onChange={handleInput}
          onFocus={() => { if (searchQuery.length >= 2) setOpen(true) }}
          placeholder={hasKey ? `Search any city worldwide…` : `Search city… (${city.name})`}
          className="
            w-full pl-10 pr-9 py-2.5 rounded-xl text-sm font-sans
            bg-black/5 dark:bg-white/5
            border border-black/10 dark:border-white/10
            text-slate-800 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            focus:outline-none focus:border-brand-green/60 focus:ring-2 focus:ring-brand-green/15
            transition-all duration-200
          "
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="
          absolute top-full left-0 right-0 mt-1.5 z-50
          bg-white dark:bg-dark-700
          border border-black/10 dark:border-white/10
          rounded-xl shadow-card-hover overflow-hidden
          animate-slide-down
        ">
          {searchLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-4 text-slate-400 dark:text-slate-500">
              <Loader2 size={14} className="animate-spin-slow" />
              <span className="text-sm">Searching cities…</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((c, i) => (
                <li key={`${c.name}-${c.country}-${c.lat}-${i}`}>
                  <button
                    onClick={() => handleSelect(c)}
                    className="
                      w-full flex items-center gap-3 px-4 py-3
                      hover:bg-brand-green/8 dark:hover:bg-brand-green/10
                      text-left transition-colors duration-150
                      border-b border-black/5 dark:border-white/5 last:border-0
                      cursor-pointer
                    "
                  >
                    <MapPin size={13} className="text-brand-green flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight">
                        {c.name}
                        {c.state ? (
                          <span className="text-slate-400 dark:text-slate-500">, {c.state}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{c.country}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-sm text-slate-400 dark:text-slate-500 text-center">
              {hasKey
                ? <>No cities found for "<strong className="text-slate-600 dark:text-slate-300">{searchQuery}</strong>"</>
                : <>
                    No match in offline list.<br />
                    <span className="text-xs mt-1 block">Add your API key in <code className="text-brand-green">.env</code> to search any city.</span>
                  </>
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}
