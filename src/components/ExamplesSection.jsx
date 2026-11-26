import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { useCookieConsent } from './CookieConsentManager.jsx'
import SectionHeading from './SectionHeading.jsx'
import { getWhatsAppHref } from '../data/contact.js'
import { examples, pizzeriaDemo } from '../data/examples.js'

function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function hideFailedImage(event) {
  event.currentTarget.style.display = 'none'
}

export default function ExamplesSection() {
  const { externalMediaAllowed } = useCookieConsent()
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [pickupSlot, setPickupSlot] = useState(pizzeriaDemo.initialPickupSlot)
  const [quantities, setQuantities] = useState({ ...pizzeriaDemo.initialQuantities })
  const [selectedNotes, setSelectedNotes] = useState([...pizzeriaDemo.initialNotes])
  const [orderSimulated, setOrderSimulated] = useState(false)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)

  const closeDemo = useCallback(() => {
    setIsDemoOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isDemoOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeDemo()
        return
      }

      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll(
          '.example-demo-dialog button:not([disabled]), .example-demo-dialog [href]',
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
  }, [closeDemo, isDemoOpen])

  const totalItems = Object.values(quantities).reduce((total, quantity) => total + quantity, 0)
  const totalAmount = pizzeriaDemo.menuItems.reduce(
    (total, item) => total + item.price * quantities[item.id],
    0,
  )
  const illustrativeCommission = totalAmount * pizzeriaDemo.illustrativeCommissionRate
  const selectedPickup = pizzeriaDemo.pickupSlots.find((slot) => slot.id === pickupSlot)
  const orderLines = pizzeriaDemo.menuItems.filter((item) => quantities[item.id] > 0)

  function updateQuantity(itemId, amount) {
    setOrderSimulated(false)
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, current[itemId] + amount),
    }))
  }

  function toggleNote(note) {
    setOrderSimulated(false)
    setSelectedNotes((current) =>
      current.includes(note) ? current.filter((item) => item !== note) : [...current, note],
    )
  }

  function openDemo(event) {
    triggerRef.current = event.currentTarget
    setOrderSimulated(false)
    setIsDemoOpen(true)
  }

  return (
    <>
      <section className="examples-section section-pad" id="esempi">
        <div className="page-width">
          <SectionHeading
            eyebrow="Esempi concreti"
            title="Un sito curato. Uno strumento che lavora."
            description="Due situazioni diverse, un approccio su misura: valorizzare una base già online oppure progettare una web app operativa pensata per lo smartphone, con codice proprietario e zero commissioni di intermediazione."
          />
          <div className="examples-grid">
            {examples.map((example) => {
              const isConcept = example.type === 'concept'

              return (
                <article
                  className={`example-card${isConcept ? ' example-card-concept' : ''}`}
                  key={example.number}
                >
                  <div className="example-card-top">
                    <span className={`example-card-number${isConcept ? ' is-warm' : ''}`}>
                      {example.number} / {isConcept ? 'ESEMPIO · WEB APP' : 'ESEMPIO'}
                    </span>
                    <span className={`example-card-icon${isConcept ? ' is-warm' : ''}`}>
                      <Icon>{example.icon}</Icon>
                    </span>
                  </div>
                  <span className={`example-badge${isConcept ? ' example-badge-concept' : ''}`}>
                    {example.badge}
                  </span>
                  <h3>{example.title}</h3>
                  <p className="example-description">{example.description}</p>
                  {isConcept && (
                    <div className="example-preview">
                      {externalMediaAllowed && (
                        <img
                          alt={example.preview.imageAlt}
                          decoding="async"
                          loading="lazy"
                          onError={hideFailedImage}
                          src={example.preview.image}
                        />
                      )}
                      <div className="example-preview-overlay">
                        <div className="example-preview-brand">
                          <span><Icon>local_fire_department</Icon>{example.preview.brand}</span>
                          <span className="example-commission-pill">0% intermediazione</span>
                        </div>
                        <strong>{example.preview.headline}</strong>
                        <div className="example-preview-stats">
                          <span><small>Fascia</small>{example.preview.pickup}</span>
                          <span><small>Ordine</small>{example.preview.order}</span>
                          <span><small>Asset</small>{example.preview.ownership}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <ul className={`example-features${isConcept ? ' is-warm' : ''}`}>
                    {example.features.map((feature) => (
                      <li key={feature}><Icon>check_circle</Icon>{feature}</li>
                    ))}
                  </ul>
                  {isConcept ? (
                    <button className="button example-action example-action-warm" onClick={openDemo} type="button">
                      {example.action}<Icon>arrow_forward</Icon>
                    </button>
                  ) : (
                    <a
                      className="button button-outline example-action"
                      href={getWhatsAppHref(example.contactMessage)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {example.action}<Icon>arrow_forward</Icon>
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {isDemoOpen && (
        <div
          className="analysis-backdrop example-demo-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDemo()
          }}
        >
          <section
            aria-labelledby="pizzeria-demo-title"
            aria-modal="true"
            className="analysis-dialog example-demo-dialog"
            role="dialog"
          >
            <header className="example-demo-header">
              <div>
                <span className="example-demo-eyebrow">
                  <Icon>auto_awesome</Icon>Concept dimostrativo · Web app su codice proprietario
                </span>
                <h2 id="pizzeria-demo-title">Forno Cortile — prenotazione tranci &amp; asporto</h2>
                <p id="pizzeria-demo-intro">
                  Simulazione interattiva: prova l’esperienza dal telefono e scopri cosa può semplificare per l’attività.
                </p>
              </div>
              <button
                aria-label="Chiudi concept dimostrativo"
                className="analysis-close"
                onClick={closeDemo}
                ref={closeRef}
                type="button"
              >
                <span>Chiudi</span><Icon>close</Icon>
              </button>
            </header>

            <div className="example-demo-columns">
              <div className="example-demo-phone-column">
                <div className="example-phone">
                  <div className="example-phone-hero">
                    {externalMediaAllowed && (
                      <img
                        alt={pizzeriaDemo.imageAlt}
                        decoding="async"
                        loading="lazy"
                        onError={hideFailedImage}
                        src={pizzeriaDemo.image}
                      />
                    )}
                    <div className="example-phone-hero-overlay" />
                    <div className="example-phone-brand">
                      <span><Icon>local_fire_department</Icon>Forno Cortile</span>
                      <span>Sfornata continua</span>
                    </div>
                    <div className="example-phone-title">
                      <strong>Prenota i tuoi tranci caldi</strong>
                      <span>Scegli l’orario, salti la fila al banco</span>
                    </div>
                  </div>

                  <div className="example-phone-content">
                    <div className="example-demo-block">
                      <div className="example-demo-block-heading">
                        <span>01 · Scegli fascia di ritiro</span>
                        <small><Icon>schedule</Icon>Ritiro al banco</small>
                      </div>
                      <div aria-label="Fasce orarie di ritiro" className="example-slot-grid" role="group">
                        {pizzeriaDemo.pickupSlots.map((slot) => (
                          <button
                            aria-pressed={pickupSlot === slot.id}
                            className={`example-slot${pickupSlot === slot.id ? ' is-selected' : ''}`}
                            key={slot.id}
                            onClick={() => {
                              setOrderSimulated(false)
                              setPickupSlot(slot.id)
                            }}
                            type="button"
                          >
                            <strong>{slot.time}</strong><span>{slot.status}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="example-demo-block">
                      <div className="example-demo-block-heading">
                        <span>02 · Componi l’ordine</span>
                      </div>
                      <div className="example-menu">
                        {pizzeriaDemo.menuItems.map((item) => (
                          <article className={`example-menu-item accent-${item.accent}`} key={item.id}>
                            {externalMediaAllowed && (
                              <img
                                alt={item.imageAlt}
                                decoding="async"
                                loading="lazy"
                                onError={hideFailedImage}
                                src={item.image}
                              />
                            )}
                            <div className="example-menu-item-content">
                              <div className="example-menu-item-heading">
                                <strong>{item.name}</strong>
                                <span>{formatCurrency(item.price)}</span>
                              </div>
                              <p>{item.description}</p>
                              <div className="example-menu-item-controls">
                                <span>{item.tag}</span>
                                <div className="example-quantity">
                                  <button
                                    aria-label={`Rimuovi ${item.name}`}
                                    disabled={quantities[item.id] === 0}
                                    onClick={() => updateQuantity(item.id, -1)}
                                    type="button"
                                  ><Icon>remove</Icon></button>
                                  <span>{quantities[item.id]}</span>
                                  <button
                                    aria-label={`Aggiungi ${item.name}`}
                                    onClick={() => updateQuantity(item.id, 1)}
                                    type="button"
                                  ><Icon>add</Icon></button>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>

                    <div className="example-demo-block">
                      <div className="example-demo-block-heading">
                        <span>03 · Preferenze forno</span><small>Note rapide</small>
                      </div>
                      <div className="example-note-list">
                        {pizzeriaDemo.quickNotes.map((note) => (
                          <button
                            aria-pressed={selectedNotes.includes(note)}
                            className={selectedNotes.includes(note) ? 'is-selected' : ''}
                            key={note}
                            onClick={() => toggleNote(note)}
                            type="button"
                          >
                            <span>{selectedNotes.includes(note) ? '✓' : '+'}</span>{note}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="example-phone-order">
                      <div className="example-phone-order-total">
                        <span>Ritiro <strong>{selectedPickup?.time}</strong> · <strong>{totalItems}</strong> pezzi</span>
                        <strong>{formatCurrency(totalAmount)}</strong>
                      </div>
                      {selectedNotes.length > 0 && (
                        <p>Note: {selectedNotes.join(' · ')}</p>
                      )}
                      {orderSimulated ? (
                        <div className="example-order-confirmation" role="status">
                          <Icon>check_circle</Icon>
                          <span><strong>Ordine simulato!</strong> In un progetto reale, il banco riceverebbe fascia, prodotti e note. Qui non parte alcuna comunicazione.</span>
                        </div>
                      ) : (
                        <button
                          className="example-simulate-button"
                          disabled={totalItems === 0}
                          onClick={() => setOrderSimulated(true)}
                          type="button"
                        >
                          Simula invio ordine al banco<Icon>arrow_forward</Icon>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <p className="example-demo-price-note">Prezzi e disponibilità sono puramente dimostrativi.</p>
              </div>

              <aside className="example-demo-value">
                <section className="example-value-card example-value-economy" aria-live="polite">
                  <span className="example-value-eyebrow"><Icon>receipt_long</Icon>Impatto economico · esempio</span>
                  <h3>Il riepilogo dell’ordine</h3>
                  <div className="example-value-order">
                    <span>Ritiro <strong>{selectedPickup?.time}</strong></span>
                    {orderLines.length ? orderLines.map((item) => (
                      <span key={item.id}>{item.name} × {quantities[item.id]}<strong>{formatCurrency(item.price * quantities[item.id])}</strong></span>
                    )) : <span>Nessun prodotto selezionato</span>}
                    <span className="example-value-total">Totale dimostrativo<strong>{formatCurrency(totalAmount)}</strong></span>
                  </div>
                  {selectedNotes.length > 0 && <p className="example-value-notes">Note al banco: {selectedNotes.join(' · ')}</p>}
                  <div className="example-commission-box">
                    <span><Icon>payments</Icon>Commissioni di intermediazione</span>
                    <strong>0%</strong>
                    <p>Su un ordine da {formatCurrency(totalAmount)}, il 25% ipotetico di un portale esterno sarebbe {formatCurrency(illustrativeCommission)}. Un canale diretto non applica commissioni di marketplace.</p>
                  </div>
                  <small className="example-estimate-note">Stima illustrativa, non tariffa universale: le commissioni variano per servizio. Restano eventuali costi di hosting e pagamenti elettronici.</small>
                </section>

                <section className="example-value-card example-value-ownership">
                  <span className="example-value-eyebrow"><Icon>verified_user</Icon>Proprietà del progetto</span>
                  <h3>Lo strumento resta tuo</h3>
                  <ul>
                    <li><Icon>check_circle</Icon><span><strong>Meno passaggi al banco:</strong> fasce, quantità e preferenze arrivano già ordinate.</span></li>
                    <li><Icon>check_circle</Icon><span><strong>Codice proprietario:</strong> niente dipendenza da un portale chiuso.</span></li>
                    <li><Icon>check_circle</Icon><span><strong>Riscatto concordato:</strong> puoi acquisire il codice e gestirlo in autonomia secondo gli accordi di progetto.</span></li>
                  </ul>
                </section>

                <p className="example-demo-disclaimer"><Icon>info</Icon><span><strong>Concept dimostrativo.</strong> Non invia ordini reali né elabora pagamenti: l’interazione resta in questa schermata.</span></p>
              </aside>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
