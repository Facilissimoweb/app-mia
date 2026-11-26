import { useState } from 'react'
import Icon from './components/Icon.jsx'
import ContactSection from './components/ContactSection.jsx'
import ExamplesSection from './components/ExamplesSection.jsx'
import MethodSection from './components/MethodSection.jsx'
import PricingSection from './components/PricingSection.jsx'
import StackAiRibbon from './components/StackAiRibbon.jsx'
import brandLogo from './assets/mtrdesignlogo.png'

const EMAIL = 'studio@teresarogani.design'

function App() {
  const [service, setService] = useState('Consulenza strategica')

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#inizio" aria-label="M. Teresa Rogani, torna all'inizio">
            <img className="brand-logo" src={brandLogo} alt="" aria-hidden="true" />
            <span className="brand-copy">
              <strong>mtrdesign.me</strong>
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

          <div className="hero-art">
            <div className="hero-logo-lockup">
              <img className="hero-logo" src={brandLogo} alt="" />
              <div className="hero-logo-caption">
                <strong>mtrdesign.me</strong>
                <span>STUDIO DI DESIGN</span>
                <span>di M. Teresa Rogani</span>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div><strong>01</strong><span>referente, sempre</span></div>
            <div><strong>360°</strong><span>dall’idea alla cura</span></div>
            <div><strong>Su misura</strong><span>nessun modello preconfezionato</span></div>
          </div>
        </section>

        <StackAiRibbon />
        <MethodSection />

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

        <ExamplesSection />
        <PricingSection onSelectService={setService} />

        <ContactSection email={EMAIL} onServiceChange={setService} service={service} />
      </main>

      <footer className="site-footer">
        <div className="footer-inner page-width">
          <a className="brand footer-brand" href="#inizio">
            <img className="brand-logo" src={brandLogo} alt="" aria-hidden="true" />
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
