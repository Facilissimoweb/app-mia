export const WHATSAPP_NUMBER = '393793603321'
export const WHATSAPP_DISPLAY_NUMBER = '+39 379 360 3321'
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export function getWhatsAppHref(message) {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`
}

export const contactQuestions = [
  {
    id: 'goal',
    prompt: 'Cosa vuoi ottenere in concreto?',
    options: [
      'Sito vetrina curato',
      'Web app operativa / ordini e fasce',
      'Migliorare una base esistente es. WordPress',
    ],
  },
  {
    id: 'blocker',
    prompt: 'Qual è oggi l’intoppo principale?',
    options: [
      'Troppe telefonate in fascia di punta',
      'Commissioni portali esterni',
      'Sito poco chiaro da smartphone',
      'Parto da zero',
    ],
    allowFreeText: true,
    freeTextLabel: 'Aggiungi un dettaglio sull’intoppo (facoltativo)',
    freeTextPlaceholder: 'Es. gestione prenotazioni confusa, menu poco leggibile…',
  },
  {
    id: 'channel',
    prompt: 'Da dove arrivano i tuoi clienti?',
    options: [
      'Soprattutto smartphone',
      'Soprattutto computer',
      'Entrambi',
    ],
  },
  {
    id: 'formula',
    prompt: 'Che formula preferisci valutare?',
    options: [
      'Partenza leggera · SaaS Essential',
      'Su misura con riscatto codice · SaaS Pro Sartoriale',
      'Da valutare insieme',
    ],
  },
]

const INTRO = 'Ciao Teresa, vorrei parlare di un progetto.'

function formatAnswer(value) {
  const trimmed = String(value || '').trim()
  return trimmed || '—'
}

function formatBlockerAnswer(selection, freeText) {
  const chip = String(selection || '').trim()
  const note = String(freeText || '').trim()
  if (!chip && !note) return '—'
  if (chip && note) return `${chip}\nDettaglio: ${note}`
  return chip || `Dettaglio: ${note}`
}

/** Messaggio con traccia delle 4 domande, da compilare in chat se non ci sono scelte. */
export function buildEmptyQuestionnaireMessage() {
  return [
    INTRO,
    '',
    ...contactQuestions.flatMap((question, index) => [
      `${index + 1}) ${question.prompt}`,
      '—',
      '',
    ]),
  ]
    .join('\n')
    .trimEnd()
}

/**
 * Compone il testo WhatsApp dalle risposte del mini-questionario.
 * Se non c’è alcuna selezione (né testo libero), restituisce la traccia vuota.
 */
export function buildQuestionnaireMessage(answers = {}) {
  const hasAnySelection = contactQuestions.some((question) => {
    const selected = String(answers[question.id] || '').trim()
    const freeText = question.allowFreeText
      ? String(answers.blockerNote || '').trim()
      : ''
    return Boolean(selected || freeText)
  })

  if (!hasAnySelection) {
    return buildEmptyQuestionnaireMessage()
  }

  return [
    INTRO,
    '',
    ...contactQuestions.flatMap((question, index) => {
      const answer = question.allowFreeText
        ? formatBlockerAnswer(answers[question.id], answers.blockerNote)
        : formatAnswer(answers[question.id])

      return [
        `${index + 1}) ${question.prompt}`,
        answer,
        '',
      ]
    }),
  ]
    .join('\n')
    .trimEnd()
}

export function getQuestionnaireWhatsAppHref(answers = {}) {
  return getWhatsAppHref(buildQuestionnaireMessage(answers))
}

/** CTA “Parliamone” e link generali: stessa traccia precompilata delle 4 domande. */
export const GENERAL_WHATSAPP_MESSAGE = buildEmptyQuestionnaireMessage()
