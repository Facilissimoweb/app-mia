import { useEffect, useRef, useState } from 'react'

const EMAIL = 'studio@teresarogani.design'

const method = [
  {
    number: '01',
    icon: 'center_focus_strong',
    title: 'Analisi e chiarezza',
    description:
      'Mettiamo a fuoco obiettivi, pubblico e messaggi prima di disegnare. Ogni scelta parte da una direzione condivisa.',
    accent: 'cyan',
  },
  {
    number: '02',
    icon: 'draw',
    title: 'Progettazione visiva',
    description:
      'Identità e interfacce curate nei dettagli, per raccontare il valore del tuo lavoro con coerenza e personalità.',
    accent: 'violet',
  },
  {
    number: '03',
    icon: 'published_with_changes',
    title: 'Cura nel tempo',
    description:
      'Il progetto non si ferma alla pubblicazione: mi occupo di aggiornamenti, sicurezza e supporto evolutivo.',
    accent: 'green',
  },
]

const plans = [
  {
    name: 'Consulenza strategica',
    price: '180',
    period: 'una sessione',
    note: 'Un confronto concreto per fare ordine e definire le prossime mosse.',
    features: [
      'Audit della presenza digitale',
      'Obiettivi e pubblico di riferimento',
      'Roadmap personalizzata',
    ],
    action: 'Richiedi una consulenza',
    tone: 'quiet',
  },
  {
    name: 'SaaS Essential',
    price: '75',
    period: 'al mese · fatturazione annuale',
    note: 'Una presenza web essenziale, veloce e sempre aggiornata.',
    features: [
      'Sito web leggero e responsive',
      'Hosting e manutenzione inclusi',
      'Aggiornamenti contenuti mensili',
    ],
    action: 'Scopri Essential',
    tone: 'featured',
    badge: 'Il più scelto',
  },
  {
    name: 'SaaS Pro Sartoriale',
    price: '140',
    period: 'al mese · fatturazione annuale',
    note: 'Un’esperienza su misura e un supporto prioritario per il tuo business.',
    features: [
      'Sito multi-sezione personalizzato',
      'Supporto diretto prioritario',
      'Ottimizzazione SEO e performance',
    ],
    action: 'Scopri Pro',
    tone: 'violet',
  },
]

function Icon({ children, className = '' }) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      {children}
    </span>
  )
}

function SectionHeading({ eyebrow, title, description, id }) {
  return (
    <div className="section-heading" id={id}>
      <span className="eyebrow"><span className="eyebrow-line" />{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

const analysisSteps = [
  {
    title: 'Mappatura obiettivi',
    detail:
      'Definiamo il ruolo del sito o della web app (presentazione autorevole, generazione contatti, prenotazioni, servizio in abbonamento o gestione interna) e i criteri di successo.',
    output: 'Scheda obiettivi e azioni prioritarie.',
    icon: 'flag',
  },
  {
    title: 'Identikit del pubblico',
    detail:
      'Chiariamo chi deve capire subito il valore della tua proposta, quali dubbi ha prima di contattarti e quali resistenze vanno smontate.',
    output: 'Mappa domande/obiezioni del cliente tipo.',
    icon: 'groups',
  },
  {
    title: 'Gerarchia dei messaggi',
    detail:
      'Stabiliamo cosa va detto per primo, quali prove o dettagli aiutano la scelta e cosa tagliare perché distrae o complica.',
    output: 'Struttura dei contenuti e ordine delle sezioni.',
    icon: 'format_list_numbered',
  },
  {
    title: 'Perimetro tecnico e contenuti',
    detail:
      'Verifichiamo se serve un impianto leggero e veloce in codice o integrazioni mirate, così non compri funzioni inutili né vincoli rigidi.',
    output: 'Architettura funzionale su misura, senza costi superflui.',
    icon: 'account_tree',
  },
]

function AnalysisCard({ step }) {
  const [activeStep, setActiveStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)
  const selected = analysisSteps[activeStep]

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
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
  }, [isOpen])

  function closeDialog() {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <article
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`method-card accent-${step.accent} analysis-trigger`}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen(true)
          }
        }}
        ref={triggerRef}
        role="button"
        tabIndex={0}
      >
        <div className="card-topline"><span>{step.number}</span><Icon>{step.icon}</Icon></div>
        <h3>{step.title}</h3>
        <p>{step.description}</p>
        <span className="card-arrow" aria-hidden="true"><Icon>arrow_outward</Icon></span>
      </article>

      {isOpen && (
        <div
          className="analysis-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog()
          }}
        >
          <section
            aria-labelledby="analysis-dialog-title"
            aria-modal="true"
            className="analysis-dialog"
            role="dialog"
          >
            <button
              aria-label="Chiudi approfondimento"
              className="analysis-close"
              onClick={closeDialog}
              ref={closeRef}
              type="button"
            >
              <span>Chiudi</span><Icon>close</Icon>
            </button>
            <div className="analysis-dialog-heading">
              <span className="eyebrow"><span className="eyebrow-line" />01 · Il mio metodo</span>
              <h2 id="analysis-dialog-title">01 · Analisi e chiarezza</h2>
              <p className="analysis-claim">{step.description}</p>
              <p className="analysis-intro">
                Prima di aprire il canvas o scrivere codice, facciamo ordine su ciò che conta davvero. Molti siti non convertono o appesantiscono la gestione quotidiana perché nascono senza una direzione precisa: partiamo invece da un confronto pratico per definire cosa deve fare il progetto, a chi parla e quale azione deve generare.
              </p>
            </div>
            <div className="analysis-explorer">
              <div className="analysis-step-list">
                <span className="analysis-label">Cosa facciamo insieme</span>
                <div className="analysis-step-options" role="group" aria-label="Passaggi dell'analisi">
                  {analysisSteps.map((item, index) => (
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
      )}
    </>
  )
}

function App() {
  const [service, setService] = useState('Consulenza strategica')
  const [notice, setNotice] = useState('')

  function choosePlan(plan) {
    setService(plan)
    document.getElementById('contatto')?.scrollIntoView({ behavior: 'smooth' })
  }

  function submitRequest(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const subject = `Richiesta informazioni — ${service}`
    const body = `Ciao Teresa,\n\n${message}\n\nIl mio nome: ${name}\nIl mio indirizzo email: ${email}\nServizio di interesse: ${service}`

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setNotice('Ho preparato la tua email. Si aprirà il programma di posta per inviarla.')
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#inizio" aria-label="M. Teresa Rogani, torna all'inizio">
            <span className="brand-mark">T<span>.</span></span>
            <span className="brand-copy">
              <strong>M. Teresa Rogani</strong>
              <small>Studio di design</small>
            </span>
            <span className="availability-dot" aria-label="Disponibile per nuovi progetti" />
          </a>
          <nav className="desktop-nav" aria-label="Navigazione principale">
            <a href="#metodo">Metodo</a>
            <a href="#profilo">Profilo</a>
            <a href="#tariffe">Servizi</a>
          </nav>
          <a className="button button-small button-cyan header-cta" href="#contatto">
            Parliamone <Icon>north_east</Icon>
          </a>
        </div>
      </header>

      <main>
        <section className="hero page-width" id="inizio">
          <div className="hero-copy">
            <div className="status-pill"><span /> Design indipendente · Consulenza digitale</div>
            <p className="hero-kicker">Strategia, identità, presenza digitale.</p>
            <h1>Il tuo progetto<br />merita <span>una forma</span><br />che lo rappresenti.</h1>
            <p className="hero-description">
              Progetto esperienze digitali curate e siti web su misura per professioniste e piccole imprese.
              Un’unica interlocutrice, dall’idea alla cura quotidiana.
            </p>
            <div className="hero-actions">
              <a className="button button-cyan" href="#contatto">
                Raccontami il tuo progetto <Icon>arrow_forward</Icon>
              </a>
              <a className="text-link" href="#metodo">Scopri il mio metodo <Icon>south</Icon></a>
            </div>
            <div className="hero-proof">
              <div><Icon>verified_user</Icon><span>Un rapporto diretto</span></div>
              <div><Icon>auto_awesome</Icon><span>Progetti fatti con cura</span></div>
            </div>
          </div>

          <div className="hero-art" aria-label="Composizione grafica astratta nei colori dello studio">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-glow" />
            <div className="art-card art-card-back">
              <span className="art-micro">IDENTITÀ VISIVA · 2025</span>
              <div className="art-back-shape" />
            </div>
            <div className="art-card art-card-front">
              <span className="art-micro">STUDIO / 01</span>
              <div className="art-monogram">T<span>.</span></div>
              <div className="art-rule" />
              <span className="art-caption">Forma, funzione<br />e intenzione.</span>
            </div>
            <div className="art-label"><span className="label-spark">✳</span> Progettato intorno a te</div>
            <div className="art-index">MTR — 2026</div>
          </div>

          <div className="hero-stats">
            <div><strong>01</strong><span>referente, sempre</span></div>
            <div><strong>360°</strong><span>dall’idea alla cura</span></div>
            <div><strong>Su misura</strong><span>nessun modello preconfezionato</span></div>
          </div>
        </section>

        <section className="method-section section-pad" id="metodo">
          <div className="page-width">
            <SectionHeading
              eyebrow="Il mio metodo"
              title={<>Progettare con intenzione,<br className="desktop-break" /> seguire con attenzione.</>}
              description="Un percorso chiaro, costruito insieme. Ogni fase ha uno scopo: dare valore alla tua attività, online e nel tempo."
            />
            <div className="method-grid">
              {method.map((step) => step.number === '01' ? (
                <AnalysisCard key={step.number} step={step} />
              ) : (
                <article className={`method-card accent-${step.accent}`} key={step.number}>
                  <div className="card-topline"><span>{step.number}</span><Icon>{step.icon}</Icon></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <span className="card-arrow" aria-hidden="true"><Icon>arrow_outward</Icon></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="profile-section section-pad page-width" id="profilo">
          <div className="profile-visual">
            <div className="profile-visual-inner">
              <div className="profile-graphic-ring" />
              <div className="profile-graphic-letter">T<span>.</span></div>
              <span className="profile-vertical">COMUNICAZIONE VISIVA · INDIPENDENTE</span>
              <div className="profile-signature"><span>MT</span><small>Progetto con<br />cura, ogni giorno.</small></div>
            </div>
            <div className="profile-caption"><span>01 / 01</span><span>Uno studio, una persona.</span></div>
          </div>
          <div className="profile-copy">
            <span className="eyebrow"><span className="eyebrow-line" />Piacere, Teresa</span>
            <h2>Una mente creativa.<br /><span>Codice proprietario, zero vincoli.</span></h2>
            <p>
              Sono M. Teresa Rogani, designer della comunicazione visiva e sviluppatrice web freelance. Unisco progettazione grafica e tecnologie moderne per costruire siti e web app veloci, leggeri e facili da mantenere nel tempo. Lavorerai sempre direttamente con me: niente intermediari, niente template preconfezionati e nessuna dipendenza da piattaforme pesanti.
            </p>
            <div className="profile-stack" aria-label="Stack tecnico e vantaggi">
              <article className="stack-card">
                <div className="stack-card-heading">
                  <Icon>speed</Icon>
                  <h3>React &amp; Vite</h3>
                </div>
                <h4>Velocità istantanea e zero zavorra</h4>
                <p>Niente temi lenti o decine di plugin da aggiornare ogni settimana. Interfacce reattive e pulite che si caricano in una frazione di secondo, ottimizzate per mobile e motori di ricerca.</p>
              </article>
              <article className="stack-card stack-violet">
                <div className="stack-card-heading">
                  <Icon>palette</Icon>
                  <h3>Tailwind CSS &amp; Design System su misura</h3>
                </div>
                <h4>Coerenza visiva totale</h4>
                <p>Ogni colore, font e spaziatura nasce attorno all'identità del progetto. Codice ordinato e modulare, pronto a crescere nel tempo senza rifacimenti.</p>
              </article>
              <article className="stack-card stack-green">
                <div className="stack-card-heading">
                  <Icon>cloud_done</Icon>
                  <h3>Infrastruttura Cloud</h3>
                </div>
                <h4>Sicurezza e proprietà del codice</h4>
                <p>GitHub, Vercel e Supabase: codice versionato, protetto e distribuito su reti ad alta affidabilità, già predisposto per aree riservate, database e prenotazioni.</p>
              </article>
              <article className="stack-card stack-violet">
                <div className="stack-card-heading">
                  <Icon>auto_awesome</Icon>
                  <h3>Integrazioni AI mirate</h3>
                </div>
                <h4>Strumenti utili, non fumo</h4>
                <p>Assistenti conversazionali e automazioni integrati direttamente nell'interfaccia solo quando semplificano davvero il lavoro quotidiano.</p>
              </article>
            </div>
            <a className="text-link" href={`mailto:${EMAIL}`}>Scrivimi direttamente <Icon>arrow_forward</Icon></a>
          </div>
        </section>

        <section className="services-section section-pad" id="tariffe">
          <div className="page-width">
            <SectionHeading
              eyebrow="Servizi & investimenti"
              title={<>Una formula giusta<br className="desktop-break" /> per il tuo momento.</>}
              description="Investimenti trasparenti e supporto diretto. Partiamo da un confronto: troviamo insieme la soluzione più adatta."
            />
            <div className="pricing-grid">
              {plans.map((plan, index) => (
                <article className={`pricing-card plan-${plan.tone}`} key={plan.name}>
                  <div className="plan-heading">
                    <span className="plan-index">0{index + 1} / SERVIZIO</span>
                    {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                  </div>
                  <h3>{plan.name}</h3>
                  <div className="price"><span className="currency">€</span>{plan.price}<span className="price-period">/{plan.period}</span></div>
                  <p className="plan-note">{plan.note}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}><Icon>check</Icon>{feature}</li>
                    ))}
                  </ul>
                  <a
                    className={`button plan-button ${plan.tone === 'featured' ? 'button-cyan' : 'button-outline'}`}
                    href="#contatto"
                    onClick={() => setService(plan.name)}
                  >
                    {plan.action}<Icon>arrow_forward</Icon>
                  </a>
                </article>
              ))}
            </div>
            <p className="pricing-footnote">I prezzi indicati sono orientativi. Scrivimi per definire insieme il perimetro del tuo progetto.</p>
          </div>
        </section>

        <section className="contact-section section-pad page-width" id="contatto">
          <div className="contact-intro">
            <span className="eyebrow"><span className="eyebrow-line" />Il prossimo passo</span>
            <h2>Ogni buon progetto<br />inizia con <span>una conversazione.</span></h2>
            <p>Raccontami a che punto sei e cosa vorresti realizzare. Ti risponderò personalmente entro due giorni lavorativi.</p>
            <a className="contact-email" href={`mailto:${EMAIL}`}><Icon>mail</Icon>{EMAIL}</a>
          </div>
          <form className="contact-form" onSubmit={submitRequest}>
            <label htmlFor="contact-name">Come ti chiami?</label>
            <input id="contact-name" name="name" autoComplete="name" placeholder="Il tuo nome" required />
            <label htmlFor="contact-email">La tua email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="nome@attivita.it" required />
            <label htmlFor="contact-service">Di cosa hai bisogno?</label>
            <select id="contact-service" name="service" value={service} onChange={(event) => setService(event.target.value)}>
              {plans.map((plan) => <option key={plan.name} value={plan.name}>{plan.name}</option>)}
              <option value="Altro progetto">Altro progetto</option>
            </select>
            <label htmlFor="contact-message">Raccontami il tuo progetto</label>
            <textarea id="contact-message" name="message" rows="4" placeholder="La tua attività, i tuoi obiettivi, le idee che hai in mente..." required />
            <button className="button button-cyan submit-button" type="submit">Prepara la richiesta <Icon>arrow_forward</Icon></button>
            {notice && <p className="form-notice" role="status">{notice} In alternativa, scrivimi a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>}
            <p className="privacy-note">Il tasto prepara un messaggio nella tua app di posta: nessun dato viene inviato o conservato da questo sito.</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner page-width">
          <a className="brand footer-brand" href="#inizio">
            <span className="brand-mark">T<span>.</span></span>
            <span className="brand-copy"><strong>M. Teresa Rogani</strong><small>Studio di design indipendente</small></span>
          </a>
          <div className="footer-links">
            <a href="#metodo">Metodo</a>
            <a href="#profilo">Profilo</a>
            <a href="#tariffe">Servizi</a>
            <a href={`mailto:${EMAIL}`}>Email</a>
          </div>
          <div className="footer-meta"><span>© {new Date().getFullYear()} M. Teresa Rogani</span><a href="#inizio">Torna all’inizio ↑</a></div>
        </div>
      </footer>

      <nav className="mobile-nav" aria-label="Navigazione rapida">
        <a href="#inizio"><Icon>home</Icon><span>Home</span></a>
        <a href="#metodo"><Icon>architecture</Icon><span>Metodo</span></a>
        <a href="#tariffe"><Icon>grid_view</Icon><span>Servizi</span></a>
        <a href="#contatto"><Icon>mail</Icon><span>Contatto</span></a>
      </nav>
    </>
  )
}

export default App
