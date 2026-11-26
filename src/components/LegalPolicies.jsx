import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { cookiePolicy, privacyPolicy } from '../data/legalPolicies.js'

function PolicyDialog({ policy, onClose }) {
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea',
        )
        const first = focusable?.[0]
        const last = focusable?.[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="analysis-backdrop legal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-describedby="legal-policy-intro"
        aria-labelledby="legal-policy-title"
        aria-modal="true"
        className="analysis-dialog legal-dialog"
        ref={dialogRef}
        role="dialog"
      >
        <button
          aria-label="Chiudi informativa"
          className="analysis-close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <span>Chiudi</span><Icon>close</Icon>
        </button>
        <header className="legal-dialog-heading">
          <span className="eyebrow"><span className="eyebrow-line" />Informativa</span>
          <h2 id="legal-policy-title">{policy.title}</h2>
          <p id="legal-policy-intro">{policy.intro}</p>
        </header>
        <div className="legal-policy-content">
          {policy.sections.map((section) => (
            <section className="legal-policy-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function LegalPolicies() {
  const [activePolicy, setActivePolicy] = useState(null)
  const triggerRef = useRef(null)

  function openPolicy(policy, event) {
    triggerRef.current = event.currentTarget
    setActivePolicy(policy)
  }

  const closePolicy = useCallback(() => {
    setActivePolicy(null)
    triggerRef.current?.focus()
  }, [])

  return (
    <>
      <button
        aria-expanded={activePolicy === privacyPolicy}
        aria-haspopup="dialog"
        className="footer-policy-trigger"
        onClick={(event) => openPolicy(privacyPolicy, event)}
        type="button"
      >
        Privacy Policy
      </button>
      <button
        aria-expanded={activePolicy === cookiePolicy}
        aria-haspopup="dialog"
        className="footer-policy-trigger"
        onClick={(event) => openPolicy(cookiePolicy, event)}
        type="button"
      >
        Cookie Policy
      </button>
      {activePolicy && <PolicyDialog onClose={closePolicy} policy={activePolicy} />}
    </>
  )
}
