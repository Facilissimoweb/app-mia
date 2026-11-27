import {
  contactQuestions,
  buildQuestionnaireMessage,
  getWhatsAppHref,
} from './contact.js'

const CHAT_INTRO =
  'Ciao Teresa, ti contatto dalla guida sul sito: vorrei parlare di un progetto.'

/** Passi della guida: stesse domande del mini-questionario Contatto. */
export const chatGuideSteps = contactQuestions.map((question) => ({
  id: question.id,
  prompt: question.prompt,
  options: question.options,
  allowFreeText: Boolean(question.allowFreeText),
  freeTextLabel: question.freeTextLabel || '',
  freeTextPlaceholder: question.freeTextPlaceholder || '',
}))

export const chatGuideCopy = {
  launcherLabel: 'Apri la guida',
  launcherCloseLabel: 'Chiudi la guida',
  title: 'Guida rapida',
  subtitle: 'Quattro domande, poi WhatsApp o Contatto.',
  welcome:
    'Ciao! Ti aiuto a inquadrare il progetto in pochi passi. Puoi saltare e scrivere subito su WhatsApp, oppure completare le domande.',
  restart: 'Ricomincia',
  skipFreeText: 'Continua senza dettaglio',
  addFreeText: 'Aggiungi un dettaglio (facoltativo)',
  closing:
    'Perfetto. Ecco la traccia pronta: aprila su WhatsApp, oppure continua dal modulo Contatto se preferisci scegliere con calma.',
  whatsappCta: 'Apri WhatsApp',
  contactCta: 'Vai a Contatto',
  progressLabel: (current, total) => `Domanda ${current} di ${total}`,
}

/**
 * Messaggio WhatsApp dalla guida: stessa struttura del questionario,
 * con intro che indica la provenienza dalla chat.
 */
export function buildGuideChatMessage(answers = {}) {
  const base = buildQuestionnaireMessage(answers)
  if (base.startsWith('Ciao Teresa, vorrei parlare di un progetto.')) {
    return base.replace(
      'Ciao Teresa, vorrei parlare di un progetto.',
      CHAT_INTRO,
    )
  }
  return `${CHAT_INTRO}\n\n${base}`
}

export function getGuideChatWhatsAppHref(answers = {}) {
  return getWhatsAppHref(buildGuideChatMessage(answers))
}
