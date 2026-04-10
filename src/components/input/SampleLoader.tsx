import { useState, useRef, useEffect } from 'react'
import { SAMPLE_MESSAGES } from '../../constants/sampleMessages'

interface SampleLoaderProps {
  onLoad: (message: string) => void
}

export function SampleLoader({ onLoad }: SampleLoaderProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Load sample
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
          {Object.entries(SAMPLE_MESSAGES).map(([key, { label, message }]) => (
            <button
              key={key}
              onClick={() => {
                onLoad(message)
                setOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brand-primary hover:text-white transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
