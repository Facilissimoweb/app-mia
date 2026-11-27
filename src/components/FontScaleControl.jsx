import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export const FONT_SCALE_STORAGE_KEY = 'mtrdesign-type-scale'
export const FONT_SCALE_STEPS = ['sm', 'md', 'lg']
export const FONT_SCALE_DEFAULT = 'md'

const LABELS = {
  sm: 'Testo più piccolo',
  md: 'Testo predefinito',
  lg: 'Testo più grande',
}

const MOBILE_QUERY = '(max-width: 640px)'

export function readStoredFontScale() {
  try {
    const stored = window.localStorage.getItem(FONT_SCALE_STORAGE_KEY)
    if (FONT_SCALE_STEPS.includes(stored)) return stored
  } catch {
    // Storage may be blocked; keep the default for this visit.
  }
  return FONT_SCALE_DEFAULT
}

export function applyFontScale(scale) {
  const next = FONT_SCALE_STEPS.includes(scale) ? scale : FONT_SCALE_DEFAULT
  document.documentElement.dataset.typeScale = next
  return next
}

function useMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  ))

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return isMobile
}

export default function FontScaleControl() {
  const isMobile = useMobileViewport()
  const [scale, setScale] = useState(() => (
    typeof document === 'undefined'
      ? FONT_SCALE_DEFAULT
      : (document.documentElement.dataset.typeScale || FONT_SCALE_DEFAULT)
  ))

  useEffect(() => {
    applyFontScale(scale)
    try {
      window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, scale)
    } catch {
      // Preference still applies for the current session.
    }
  }, [scale])

  const index = FONT_SCALE_STEPS.indexOf(scale)
  const canDecrease = index > 0
  const canIncrease = index < FONT_SCALE_STEPS.length - 1

  const control = (
    <div
      className={`font-scale${isMobile ? ' font-scale-mobile' : ''}`}
      role="group"
      aria-label="Grandezza del testo"
    >
      <button
        type="button"
        className="font-scale-button"
        aria-label="Riduci grandezza del testo"
        disabled={!canDecrease}
        onClick={() => setScale(FONT_SCALE_STEPS[index - 1])}
      >
        <span aria-hidden="true">A−</span>
      </button>
      <button
        type="button"
        className={`font-scale-button font-scale-reset${scale === FONT_SCALE_DEFAULT ? ' is-active' : ''}`}
        aria-label={LABELS.md}
        aria-pressed={scale === FONT_SCALE_DEFAULT}
        onClick={() => setScale(FONT_SCALE_DEFAULT)}
      >
        <span aria-hidden="true">A</span>
      </button>
      <button
        type="button"
        className="font-scale-button font-scale-plus"
        aria-label="Aumenta grandezza del testo"
        disabled={!canIncrease}
        onClick={() => setScale(FONT_SCALE_STEPS[index + 1])}
      >
        <span aria-hidden="true">A+</span>
      </button>
      <span className="visually-hidden" aria-live="polite">
        {LABELS[scale]}
      </span>
    </div>
  )

  if (isMobile && typeof document !== 'undefined') {
    return createPortal(control, document.body)
  }

  return control
}
