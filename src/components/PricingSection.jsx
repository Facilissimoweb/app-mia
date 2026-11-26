import Icon from './Icon.jsx'
import SectionHeading from './SectionHeading.jsx'
import FaqAccordion from './FaqAccordion.jsx'
import { plans } from '../data/pricing.js'

export default function PricingSection({ onSelectService }) {
  return (
    <section className="services-section section-pad" id="tariffe">
      <div className="page-width">
        <SectionHeading
          eyebrow="Servizi & investimenti"
          title="Un investimento chiaro, senza vincoli chiusi."
          description="Investimenti trasparenti, supporto diretto e codice di tua proprietà: puoi scegliere la gestione continua in abbonamento, riscattare il codice in seguito o richiederlo subito per gestirlo in autonomia."
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
                onClick={() => onSelectService(plan.name)}
              >
                {plan.action}<Icon>arrow_forward</Icon>
              </a>
            </article>
          ))}
        </div>
        <aside className="pricing-info" aria-label="Proprietà e gestione del codice">
          <span className="pricing-info-icon"><Icon>code</Icon></span>
          <div>
            <h3>Nessun vincolo chiuso · Il codice resta tuo</h3>
            <p>Puoi partire con un piano di gestione continua e riscattare il codice sorgente quando vuoi, oppure richiedere direttamente la consegna del codice una tantum per gestirlo in autonomia. I prezzi indicati sono orientativi: scrivimi per definire insieme il perimetro.</p>
          </div>
        </aside>
        <FaqAccordion />
      </div>
    </section>
  )
}
