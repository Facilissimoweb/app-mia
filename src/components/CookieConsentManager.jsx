import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CONSENT_STORAGE_KEY = 'mtrdesign-cookie-consent-v1'
const CookieConsentContext = createContext(null)
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'

function readStoredConsent() {
  let serialized

  try {
    serialized = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch (error) {
    console.error('Unable to read cookie preferences from localStorage.', error)
    return {
      consent: null,
      notice: 'Il browser non consente di leggere le preferenze salvate. Puoi scegliere per questa visita.',
    }
  }

  if (!serialized) return { consent: null, notice: '' }

  let stored
  try {
    stored = JSON.parse(serialized)
  } catch (error) {
    console.warn('Stored cookie preferences are invalid; a new choice is required.', error)
    return {
      consent: null,
      notice: 'La scelta precedente non era leggibile: seleziona di nuovo le preferenze.',
    }
  }

  if (
    stored?.version === 1
    && stored.necessary === true
    && typeof stored.externalMedia === 'boolean'
  ) {
    return {
      consent: { necessary: true, externalMedia: stored.externalMedia },
      notice: '',
    }
  }

  console.warn('Stored cookie preferences use an unsupported format.')
  return {
    consent: null,
    notice: 'La scelta precedente non era aggiornata: seleziona di nuovo le preferenze.',
  }
}

function ExternalResourceGate({ enabled }) {
  useEffect(() => {
    if (!enabled) return undefined

    const googlePreconnect = document.createElement('link')
    googlePreconnect.rel = 'preconnect'
    googlePreconnect.href = 'https://fonts.googleapis.com'
    googlePreconnect.dataset.cookieCategory = 'external-media'

    const fontPreconnect = document.createElement('link')
    fontPreconnect.rel = 'preconnect'
    fontPreconnect.href = 'https://fonts.gstatic.com'
    fontPreconnect.crossOrigin = 'anonymous'
    fontPreconnect.dataset.cookieCategory = 'external-media'

    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = GOOGLE_FONTS_URL
    stylesheet.dataset.cookieCategory = 'external-media'

    document.head.append(googlePreconnect, fontPreconnect, stylesheet)
    document.documentElement.classList.add('external-resources-enabled')

    return () => {
      googlePreconnect.remove()
      fontPreconnect.remove()
      stylesheet.remove()
      document.documentElement.classList.remove('external-resources-enabled')
    }
  }, [enabled])

  return null
}

function CookieConsentBanner({
  customizing,
  draftExternalMedia,
  isOpen,
  onAcceptAll,
  onCustomize,
  onDismissStorageWarning,
  onDraftExternalMediaChange,
  onRejectOptional,
  onSavePreferences,
  storageNotice,
}) {
  if (!isOpen) return null

  return (
    <aside aria-label="Preferenze cookie" className="cookie-banner" role="region">
      <div className="cookie-banner-heading">
        <strong>Le tue preferenze</strong>
        <p>
          I font Google e le immagini Unsplash vengono caricati solo se autorizzi le risorse esterne.
          I collegamenti WhatsApp si aprono solo quando li selezioni.
        </p>
      </div>

      {customizing && (
        <div className="cookie-category-list">
          <label className="cookie-category">
            <input checked disabled type="checkbox" />
            <span>
              <strong>Tecnici / necessari</strong>
              <small>Memorizzano questa scelta e sono sempre attivi. Non effettuano profilazione.</small>
            </span>
            <span className="cookie-category-status">Sempre attivi</span>
          </label>
          <label className="cookie-category">
            <input
              checked={draftExternalMedia}
              onChange={(event) => onDraftExternalMediaChange(event.target.checked)}
              type="checkbox"
            />
            <span>
              <strong>Risorse / media esterni</strong>
              <small>
                Google Fonts (caratteri e icone) e immagini Unsplash. Se disattivati, restano
                bloccati e la pagina usa caratteri e icone locali di fallback.
              </small>
            </span>
            <span className="cookie-category-status">Facoltativi</span>
          </label>
        </div>
      )}

      {storageNotice && (
        <div className="cookie-storage-notice" role="status">
          <p>{storageNotice}</p>
          <button onClick={onDismissStorageWarning} type="button">Continua per questa visita</button>
        </div>
      )}

      <div className="cookie-banner-actions">
        {customizing ? (
          <>
            <button className="cookie-button cookie-button-primary" onClick={onSavePreferences} type="button">
              Salva preferenze
            </button>
            <button className="cookie-button" onClick={onAcceptAll} type="button">Accetta tutto</button>
            <button className="cookie-button" onClick={onRejectOptional} type="button">Rifiuta non essenziali</button>
          </>
        ) : (
          <>
            <button className="cookie-button cookie-button-primary" onClick={onAcceptAll} type="button">
              Accetta tutto
            </button>
            <button className="cookie-button" onClick={onRejectOptional} type="button">
              Rifiuta non essenziali
            </button>
            <button className="cookie-button" onClick={onCustomize} type="button">Personalizza</button>
          </>
        )}
      </div>
    </aside>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (!context) throw new Error('useCookieConsent must be used within CookieConsentManager')
  return context
}

export default function CookieConsentManager({ children }) {
  const [initialState] = useState(readStoredConsent)
  const [consent, setConsent] = useState(initialState.consent)
  const [isOpen, setIsOpen] = useState(initialState.consent === null)
  const [customizing, setCustomizing] = useState(false)
  const [draftExternalMedia, setDraftExternalMedia] = useState(
    initialState.consent?.externalMedia ?? false,
  )
  const [storageNotice, setStorageNotice] = useState(initialState.notice)

  const openCookieSettings = useCallback(() => {
    setDraftExternalMedia(consent?.externalMedia ?? false)
    setCustomizing(true)
    setIsOpen(true)
  }, [consent])

  const applyChoice = useCallback((externalMedia) => {
    const nextConsent = { necessary: true, externalMedia }
    setConsent(nextConsent)
    setDraftExternalMedia(externalMedia)

    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ version: 1, ...nextConsent }),
      )
      setStorageNotice('')
      setIsOpen(false)
      setCustomizing(false)
    } catch (error) {
      console.error('Unable to save cookie preferences to localStorage.', error)
      setStorageNotice(
        'La scelta è attiva per questa visita ma non è stata salvata: il browser non consente la memorizzazione.',
      )
      setCustomizing(true)
      setIsOpen(true)
    }
  }, [])

  const dismissStorageNotice = useCallback(() => {
    setStorageNotice('')
    setIsOpen(false)
    setCustomizing(false)
  }, [])

  const contextValue = useMemo(() => ({
    consent,
    externalMediaAllowed: consent?.externalMedia === true,
    openCookieSettings,
  }), [consent, openCookieSettings])

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
      <ExternalResourceGate enabled={consent?.externalMedia === true} />
      <CookieConsentBanner
        customizing={customizing}
        draftExternalMedia={draftExternalMedia}
        isOpen={isOpen}
        onAcceptAll={() => applyChoice(true)}
        onCustomize={() => {
          setDraftExternalMedia(consent?.externalMedia ?? false)
          setCustomizing(true)
        }}
        onDismissStorageWarning={dismissStorageNotice}
        onDraftExternalMediaChange={setDraftExternalMedia}
        onRejectOptional={() => applyChoice(false)}
        onSavePreferences={() => applyChoice(draftExternalMedia)}
        storageNotice={storageNotice}
      />
    </CookieConsentContext.Provider>
  )
}
