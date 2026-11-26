import { useState } from 'react'
import Icon from './Icon.jsx'
import { plans } from '../data/pricing.js'

export default function ContactSection({ email, service, onServiceChange }) {
  const [notice, setNotice] = useState('')

  function submitRequest(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const emailAddress = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const subject = `Richiesta informazioni — ${service}`
    const body = `Ciao Teresa,\n\n${message}\n\nIl mio nome: ${name}\nIl mio indirizzo email: ${emailAddress}\nServizio di interesse: ${service}`

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setNotice('Ho preparato la tua email. Si aprirà il programma di posta per inviarla.')
  }

  return (
    <section className="contact-section section-pad page-width" id="contatto">
      <div className="contact-intro">
        <span className="eyebrow"><span className="eyebrow-line" />Il prossimo passo</span>
        <h2>Ogni buon progetto<br />inizia con <span>una conversazione.</span></h2>
        <p>Raccontami a che punto sei e cosa vorresti realizzare. Ti risponderò personalmente entro due giorni lavorativi.</p>
        <a className="contact-email" href={`mailto:${email}`}><Icon>mail</Icon>{email}</a>
      </div>
      <form className="contact-form" onSubmit={submitRequest}>
        <label htmlFor="contact-name">Come ti chiami?</label>
        <input id="contact-name" name="name" autoComplete="name" placeholder="Il tuo nome" required />
        <label htmlFor="contact-email">La tua email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="nome@attivita.it" required />
        <label htmlFor="contact-service">Di cosa hai bisogno?</label>
        <select id="contact-service" name="service" value={service} onChange={(event) => onServiceChange(event.target.value)}>
          {plans.map((plan) => <option key={plan.name} value={plan.name}>{plan.name}</option>)}
          <option value="Acquisto codice sorgente (una tantum)">Acquisto codice sorgente (una tantum)</option>
          <option value="Altro progetto">Altro progetto</option>
        </select>
        <label htmlFor="contact-message">Raccontami il tuo progetto</label>
        <textarea id="contact-message" name="message" rows="4" placeholder="La tua attività, i tuoi obiettivi, le idee che hai in mente..." required />
        <button className="button button-cyan submit-button" type="submit">Prepara la richiesta <Icon>arrow_forward</Icon></button>
        {notice && <p className="form-notice" role="status">{notice} In alternativa, scrivimi a <a href={`mailto:${email}`}>{email}</a>.</p>}
        <p className="privacy-note">Il tasto prepara un messaggio nella tua app di posta: nessun dato viene inviato o conservato da questo sito.</p>
      </form>
    </section>
  )
}
