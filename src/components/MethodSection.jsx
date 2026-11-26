import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import EditorialPhoto from './EditorialPhoto.jsx'
import SectionHeading from './SectionHeading.jsx'
import methodPhoto from '../assets/editorial-method.jpg'
import {
  analysisSteps,
  careIntro,
  careSteps,
  designIntro,
  designSteps,
  method,
} from '../data/method.js'

function MethodCard({ step, onOpen, isOpen }) {
  function open(event) {
    onOpen(step, event.currentTarget)
  }

  return (
    <article
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className={`method-card accent-${step.accent} analysis-trigger`}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          open(event)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="card-topline"><span>{step.number}</span><Icon>{step.icon}</Icon></div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <span className="card-arrow" aria-hidden="true"><Icon>arrow_outward</Icon></span>
    </article>
  )
}

function MethodDialog({ step, onClose }) {
  const [activeStep, setActiveStep] = useState(0)
  const closeRef = useRef(null)
  const isAnalysis = step.number === '01'
  const isDesign = step.number === '02'
  const detailSteps = isAnalysis ? analysisSteps : isDesign ? designSteps : careSteps
  const selected = detailSteps[activeStep]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll(
          '.analysis-dialog button:not([disabled]), .analysis-dialog [href], .analysis-dialog input, .analysis-dialog select, .analysis-dialog textarea',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

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
    }
  }, [onClose])

  return (
    <div
      className="analysis-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="method-dialog-title"
        aria-modal="true"
        className={`analysis-dialog method-dialog accent-${step.accent}`}
        role="dialog"
      >
        <button
          aria-label="Chiudi approfondimento"
          className="analysis-close"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          <span>Chiudi</span><Icon>close</Icon>
        </button>
        <div className="analysis-dialog-heading">
          <span className="eyebrow"><span className="eyebrow-line" />{step.number} · Il mio metodo</span>
          <h2 id="method-dialog-title">{step.number} · {step.title}</h2>
          <p className="analysis-claim">{step.description}</p>
          <p className="analysis-intro">
            {isAnalysis
              ? 'Prima di aprire il canvas o scrivere codice, facciamo ordine su ciò che conta davvero. Molti siti non convertono o appesantiscono la gestione quotidiana perché nascono senza una direzione precisa: partiamo invece da un confronto pratico per definire cosa deve fare il progetto, a chi parla e quale azione deve generare.'
              : isDesign ? designIntro : careIntro}
          </p>
        </div>
        <div className="analysis-explorer">
          <div className="analysis-step-list">
            <span className="analysis-label">Cosa facciamo insieme</span>
            <div className="analysis-step-options" role="group" aria-label="Passaggi del metodo">
              {detailSteps.map((item, index) => (
                <button
                  aria-pressed={activeStep === index}
                  className={`analysis-step-button${activeStep === index ? ' is-active' : ''}`}
                  key={item.title}
                  onClick={() => setActiveStep(index)}
                  type="button"
                >
                  <span className="analysis-step-index">0{index + 1}</span>
                  <span>{item.title}</span>
                  <Icon>chevron_right</Icon>
                </button>
              ))}
            </div>
          </div>
          <div className="analysis-step-detail" aria-live="polite">
            <div className="analysis-detail-heading">
              <Icon>{selected.icon}</Icon>
              <span>Passaggio 0{activeStep + 1}</span>
            </div>
            <h3>{selected.title}</h3>
            <p>{selected.detail}</p>
            <div className="analysis-deliverable">
              <span>Output prima del design</span>
              <strong><Icon>task_alt</Icon>{selected.output}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function MethodSection() {
  const [openMethod, setOpenMethod] = useState(null)
  const methodTriggerRef = useRef(null)

  function openMethodDialog(step, trigger) {
    methodTriggerRef.current = trigger
    setOpenMethod(step)
  }

  const closeMethodDialog = useCallback(() => {
    setOpenMethod(null)
    methodTriggerRef.current?.focus()
  }, [])

  return (
    <section className="method-section section-pad" id="metodo">
      <div className="page-width">
        <div className="method-intro">
          <SectionHeading
            eyebrow="Il mio metodo"
            title={<>Progettare con intenzione,<br className="desktop-break" /> seguire con attenzione.</>}
            description="Un percorso chiaro, costruito insieme. Ogni fase ha uno scopo: dare valore alla tua attività, online e nel tempo."
          />
          <EditorialPhoto
            alt="Postazione di progettazione digitale con interfacce scure su monitor e tablet e schizzi di layout su un quaderno."
            className="editorial-image-method"
            src={methodPhoto}
          />
        </div>
        <div className="method-grid">
          {method.map((step) => (
            <MethodCard
              isOpen={openMethod?.number === step.number}
              key={step.number}
              onOpen={openMethodDialog}
              step={step}
            />
          ))}
        </div>
        {openMethod && (
          <MethodDialog
            key={openMethod.number}
            onClose={closeMethodDialog}
            step={openMethod}
          />
        )}
      </div>
    </section>
  )
}
