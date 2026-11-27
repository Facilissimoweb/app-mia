import {
  contactQuestions,
  buildQuestionnaireMessage,
  getWhatsAppHref,
} from './contact.js'
import { plans } from './pricing.js'
import { method } from './method.js'
import { examples } from './examples.js'

const CHAT_INTRO =
  'Ciao Teresa, ti contatto dalla guida sul sito: vorrei parlare di un progetto.'

/** Passi del questionario Contatto, riusati dalla guida in «Parliamone». */
export const chatGuideSteps = contactQuestions.map((question) => ({
  id: question.id,
  prompt: question.prompt,
  options: question.options,
  allowFreeText: Boolean(question.allowFreeText),
  freeTextLabel: question.freeTextLabel || '',
  freeTextPlaceholder: question.freeTextPlaceholder || '',
}))

/**
 * Argomenti della guida ai contenuti: copy allineato a hero, profilo,
 * metodo, tariffe, esempi e contatto della landing.
 */
export const guideTopics = [
  {
    id: 'offer',
    label: 'Cosa offriamo',
    sectionHref: '#inizio',
    sectionLabel: 'Vai all’inizio',
    reply: [
      'Progetto esperienze digitali curate e siti web su misura per professioniste e piccole imprese.',
      'Un’unica interlocutrice — M. Teresa Rogani — dall’idea alla cura quotidiana: strategia, identità e presenza digitale, senza intermediari né template preconfezionati.',
      'Puoi partire da un sito vetrina, da una web app operativa (ordini, fasce, contatti) o dal miglioramento di una base già online, anche WordPress.',
    ].join('\n\n'),
    followUps: [
      { label: 'Formule e investimenti', topicId: 'formulas' },
      { label: 'Come lavoriamo', topicId: 'method' },
      { label: 'Per chi è', topicId: 'audience' },
    ],
  },
  {
    id: 'formulas',
    label: 'Formule',
    sectionHref: '#tariffe',
    sectionLabel: 'Vai a Servizi',
    reply: [
      'Tre percorsi chiari, con codice di tua proprietà e senza vincoli chiusi:',
      ...plans.map((plan) => {
        const badge = plan.badge ? ` · ${plan.badge}` : ''
        return `• ${plan.name}${badge} — € ${plan.price}/${plan.period}. ${plan.note}`
      }),
      'Puoi restare in gestione continua, riscattare il codice in seguito o richiederlo subito per gestirlo in autonomia. I prezzi sono orientativi: li definiamo sul perimetro reale.',
    ].join('\n\n'),
    followUps: [
      { label: 'Essential vs Pro', topicId: 'formulas-compare' },
      { label: 'Codice tuo / riscatto', topicId: 'code-ownership' },
      { label: 'Parliamone', action: 'quiz' },
    ],
  },
  {
    id: 'formulas-compare',
    label: 'Essential vs Pro',
    sectionHref: '#tariffe',
    sectionLabel: 'Vai a Servizi',
    menuHidden: true,
    reply: [
      'SaaS Essential (€ 75/mese · primi 6 mesi, poi mensile): presenza web essenziale, responsive, con hosting, manutenzione e aggiornamenti contenuti mensili. È la formula più scelta per partire leggeri.',
      'SaaS Pro Sartoriale (€ 140/mese · stessi termini): esperienza multi-sezione personalizzata, supporto prioritario, SEO e performance. Ideale quando serve più profondità e un rapporto più stretto.',
      'Se le idee non sono ancora chiare, la Consulenza strategica (€ 180, una sessione) mette ordine su obiettivi, pubblico e roadmap prima di investire.',
    ].join('\n\n'),
    followUps: [
      { label: 'Torniamo alle formule', topicId: 'formulas' },
      { label: 'Come lavoriamo', topicId: 'method' },
      { label: 'Parliamone', action: 'quiz' },
    ],
  },
  {
    id: 'code-ownership',
    label: 'Codice tuo',
    sectionHref: '#tariffe',
    sectionLabel: 'Vai a Servizi',
    menuHidden: true,
    reply: [
      'Il sito non nasce in un builder chiuso o in un template «in affitto»: è codice pulito su misura. Se un giorno vuoi spostarlo o affidarlo altrove, hai un asset reale e portabile.',
      'Puoi partire in abbonamento (primi 6 mesi di avvio, poi mensile) e riscattare il codice concordando una quota trasparente, oppure commissionare subito solo il codice sorgente con consegna e istruzioni base — hosting e aggiornamenti restano a tuo carico.',
      'A differenza dei generatori AI a pochi euro al mese, qui c’è una regia progettuale: obiettivi, messaggi e identità visiva, senza lasciarti sola davanti a una chat generica.',
    ].join('\n\n'),
    followUps: [
      { label: 'Formule', topicId: 'formulas' },
      { label: 'Casi e esempi', topicId: 'cases' },
      { label: 'Parliamone', action: 'quiz' },
    ],
  },
  {
    id: 'method',
    label: 'Come lavoriamo',
    sectionHref: '#metodo',
    sectionLabel: 'Vai al Metodo',
    reply: [
      'Tre fasi, una referente:',
      ...method.map(
        (step) => `• ${step.number} ${step.title} — ${step.description}`,
      ),
      'Analisi (obiettivi, pubblico, messaggi, perimetro tecnico), progettazione visiva mobile-first in React & Vite, poi cura nel tempo: sicurezza, contenuti, performance e nuove funzioni quando l’attività cresce.',
    ].join('\n\n'),
    followUps: [
      { label: 'Cosa offriamo', topicId: 'offer' },
      { label: 'Formule', topicId: 'formulas' },
      { label: 'Parliamone', action: 'quiz' },
    ],
  },
  {
    id: 'audience',
    label: 'Per chi è',
    sectionHref: '#profilo',
    sectionLabel: 'Vai al Profilo',
    reply: [
      'Per professioniste e piccole imprese che vogliono una presenza digitale chiara, veloce e riconoscibile — senza piattaforme pesanti né template già visti.',
      'Lavori sempre direttamente con Teresa: design della comunicazione visiva + sviluppo in codice proprietario (React, Vite, design system su misura, cloud). Niente intermediari.',
      'Ha senso se cerchi un sito vetrina curato, una web app operativa, o se hai già una base (anche WordPress) da migliorare con più chiarezza e resa da smartphone.',
    ].join('\n\n'),
    followUps: [
      { label: 'Casi e esempi', topicId: 'cases' },
      { label: 'Come lavoriamo', topicId: 'method' },
      { label: 'Parliamone', action: 'quiz' },
    ],
  },
  {
    id: 'cases',
    label: 'Casi e esempi',
    sectionHref: '#esempi',
    sectionLabel: 'Vai agli esempi',
    reply: [
      'Due riferimenti sulla landing:',
      `• ${examples[0].badge} — ${examples[0].title}: base WordPress già online, con cura di struttura, gerarchia e resa da smartphone. Se hai già un sito, la piattaforma di partenza non decide da sola la soluzione.`,
      `• ${examples[1].badge} — ${examples[1].title}: web app per ordini e fasce di ritiro dal telefono, meno telefonate al banco e senza commissioni dei portali. Codice tuo, con possibilità di riscatto.`,
      'Il metodo vale per attività diverse: obiettivi chiari, interfaccia leggera, codice proprietario. Nella sezione Esempi puoi anche provare il concept interattivo.',
    ].join('\n\n'),
    followUps: [
      { label: 'Formule', topicId: 'formulas' },
      { label: 'Cosa offriamo', topicId: 'offer' },
      { label: 'Parliamone', action: 'quiz' },
    ],
  },
  {
    id: 'talk',
    label: 'Parliamone',
    sectionHref: '#contatto',
    sectionLabel: 'Vai a Contatto',
    reply:
      'Quando sei pronta, quattro risposte rapide preparano una traccia già pronta su WhatsApp — le stesse del modulo Contatto. Oppure puoi scrivere subito o aprire la sezione Contatto.',
    followUps: [
      { label: 'Inizia le 4 domande', action: 'quiz' },
      { label: 'WhatsApp subito', action: 'whatsapp' },
    ],
  },
]

export const guideMenuTopics = guideTopics.filter((topic) => !topic.menuHidden)

export function getGuideTopic(topicId) {
  return guideTopics.find((topic) => topic.id === topicId) || null
}

export const chatGuideCopy = {
  launcherLabel: 'Apri la guida',
  launcherCloseLabel: 'Chiudi la guida',
  title: 'Guida al sito',
  subtitle: 'Esplora i contenuti, poi Contatto o WhatsApp.',
  welcome:
    'Ciao! Ti accompagno tra le sezioni del sito: cosa offriamo, formule, metodo, per chi è e i casi. Scegli un tema, oppure vai dritta a Contatto / WhatsApp.',
  menuPrompt: 'Di cosa vuoi saperne di più?',
  backToMenu: 'Altri temi',
  restart: 'Ricomincia',
  skipFreeText: 'Continua senza dettaglio',
  addFreeText: 'Aggiungi un dettaglio (facoltativo)',
  quizIntro:
    'Perfetto. Sono le stesse quattro domande del modulo Contatto: le risposte finiscono nel messaggio WhatsApp, che puoi rivedere prima di inviare.',
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
