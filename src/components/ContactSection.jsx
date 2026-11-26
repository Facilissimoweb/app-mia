import { useState } from 'react'
import Icon from './Icon.jsx'
import { WHATSAPP_DISPLAY_NUMBER, getWhatsAppHref } from '../data/contact.js'
import { plans } from '../data/pricing.js'

export default function ContactSection() {
  const [service, setService] = useState('Consulenza strategica')
  const [notice, setNotice] = useState('')

  function submitRequest(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const body = [
      'Ciao Teresa, vorrei parlare di un progetto.',
      `Nome: ${name}`,
      `Servizio di interesse: ${service}`,
      message ? `Messaggio: ${message}` : '',
    ].filter(Boolean).join('\n\n')

    window.open(getWhatsAppHref(body), '_blank', 'noopener,noreferrer')
    setNotice('WhatsApp si apre con il messaggio già pronto: potrai rivederlo e inviarlo direttamente da lì.')
  }

  return (
    <section className="contact-section section-pad page-width" id="contatto">
      <div className="contact-intro">
        <span className="eyebrow"><span className="eyebrow-line" />Il prossimo passo</span>
        <h2>Ogni buon progetto<br />inizia con <span>una conversazione.</span></h2>
        <p>Al momento il contatto avviene solo via WhatsApp: una risposta diretta, pratica e veloce, anche da smartphone.</p>
        <a
          aria-label={`Contattami su WhatsApp al ${WHATSAPP_DISPLAY_NUMBER}`}
          className="contact-whatsapp"
          href={getWhatsAppHref('Ciao Teresa, vorrei parlare del mio progetto.')}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon>chat</Icon>{WHATSAPP_DISPLAY_NUMBER}
        </a>
      </div>
      <form className="contact-form" onSubmit={submitRequest}>
        <label htmlFor="contact-name">Come ti chiami?</label>
        <input id="contact-name" name="name" autoComplete="name" placeholder="Il tuo nome" required />
        <label htmlFor="contact-service">Di cosa hai bisogno?</label>
        <select id="contact-service" name="service" value={service} onChange={(event) => setService(event.target.value)}>
          {plans.map((plan) => <option key={plan.name} value={plan.name}>{plan.name}</option>)}
          <option value="Acquisto codice sorgente (una tantum)">Acquisto codice sorgente (una tantum)</option>
          <option value="Altro progetto">Altro progetto</option>
        </select>
        <label htmlFor="contact-message">Aggiungi un messaggio (facoltativo)</label>
        <textarea id="contact-message" name="message" rows="4" placeholder="La tua attività, i tuoi obiettivi o le idee che hai in mente..." />
        <button className="button button-cyan submit-button" type="submit">Continua su WhatsApp <Icon>arrow_forward</Icon></button>
        {notice && <p className="form-notice" role="status">{notice} Se preferisci, scrivimi al {WHATSAPP_DISPLAY_NUMBER}.</p>}
        <p className="privacy-note">Il sito non conserva i dati: il messaggio viene passato a WhatsApp perché tu possa rivederlo prima di inviarlo.</p>
      </form>
    </section>
  )
}
