import { useState } from 'react'
import Icon from './Icon.jsx'
import { pricingFaqs } from '../data/pricing.js'

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="pricing-faq" aria-labelledby="pricing-faq-title">
      <div className="pricing-faq-heading">
        <span className="eyebrow"><span className="eyebrow-line" />DOMANDE FREQUENTI</span>
        <h2 id="pricing-faq-title">Tutto chiaro prima di iniziare.</h2>
      </div>
      <div className="pricing-faq-list">
        {pricingFaqs.map((faq, index) => {
          const isOpen = openIndex === index
          const questionId = `pricing-faq-question-${index + 1}`
          const answerId = `pricing-faq-answer-${index + 1}`

          return (
            <article className={`pricing-faq-item${isOpen ? ' is-open' : ''}`} key={faq.question}>
              <h3>
                <button
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  className="pricing-faq-toggle"
                  id={questionId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  type="button"
                >
                  <span>{faq.question}</span>
                  <Icon>expand_more</Icon>
                </button>
              </h3>
              <div
                aria-hidden={!isOpen}
                className="pricing-faq-answer"
                id={answerId}
                role="region"
                aria-labelledby={questionId}
              >
                <div className="pricing-faq-answer-inner">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
