import { useState } from 'react'
import Icon from './Icon.jsx'
import {
  WHATSAPP_DISPLAY_NUMBER,
  contactQuestions,
  getQuestionnaireWhatsAppHref,
  getWhatsAppHref,
  buildEmptyQuestionnaireMessage,
} from '../data/contact.js'

const emptyAnswers = {
  goal: '',
  blocker: '',
  blockerNote: '',
  channel: '',
  formula: '',
}

function hasQuestionnaireInput(answers) {
  return contactQuestions.some((question) => {
    const selected = String(answers[question.id] || '').trim()
    const freeText = question.allowFreeText
      ? String(answers.blockerNote || '').trim()
      : ''
    return Boolean(selected || freeText)
  })
}

export default function ContactSection() {
  const [answers, setAnswers] = useState(emptyAnswers)
  const filled = hasQuestionnaireInput(answers)
  const whatsappHref = getQuestionnaireWhatsAppHref(answers)
  const ctaLabel = filled ? 'Invia su WhatsApp' : 'Parliamone su WhatsApp'

  function selectOption(questionId, option) {
    setAnswers((current) => ({
      ...current,
      [questionId]: current[questionId] === option ? '' : option,
    }))
  }

  function updateBlockerNote(event) {
    setAnswers((current) => ({
      ...current,
      blockerNote: event.target.value,
    }))
  }

  return (
    <section className="contact-section section-pad page-width" id="contatto">
      <div className="contact-intro">
        <span className="eyebrow"><span className="eyebrow-line" />Il prossimo passo</span>
        <h2>Ogni buon progetto<br />inizia con <span>una conversazione.</span></h2>
        <p>
          Quattro risposte rapide e ti preparo una traccia già pronta su WhatsApp:
          niente form lunghi, solo ciò che serve per partire bene.
        </p>
        <a
          aria-label={`Contattami su WhatsApp al ${WHATSAPP_DISPLAY_NUMBER}`}
          className="contact-whatsapp"
          href={getWhatsAppHref(buildEmptyQuestionnaireMessage())}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon>chat</Icon>{WHATSAPP_DISPLAY_NUMBER}
        </a>
      </div>

      <div className="contact-form contact-questionnaire" role="form" aria-label="Mini-questionario strategico">
        {contactQuestions.map((question, index) => (
          <fieldset className="contact-question" key={question.id}>
            <legend>
              <span className="contact-question-index">{index + 1}</span>
              {question.prompt}
            </legend>
            <div className="contact-chip-group" role="group" aria-label={question.prompt}>
              {question.options.map((option) => {
                const selected = answers[question.id] === option
                return (
                  <button
                    key={option}
                    type="button"
                    className={`contact-chip${selected ? ' is-selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => selectOption(question.id, option)}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {question.allowFreeText && (
              <label className="contact-free-text" htmlFor="contact-blocker-note">
                <span>{question.freeTextLabel}</span>
                <textarea
                  id="contact-blocker-note"
                  name="blockerNote"
                  rows="2"
                  value={answers.blockerNote}
                  onChange={updateBlockerNote}
                  placeholder={question.freeTextPlaceholder}
                />
              </label>
            )}
          </fieldset>
        ))}

        <a
          className="button button-cyan submit-button"
          href={whatsappHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {ctaLabel} <Icon>arrow_forward</Icon>
        </a>

        <p className="privacy-note">
          Il sito non conserva le risposte: le scelte restano nel browser e diventano
          il testo precompilato di WhatsApp, che puoi rivedere prima di inviare.
          Preferisci scrivere subito? Usa {WHATSAPP_DISPLAY_NUMBER}.
        </p>
      </div>
    </section>
  )
}
