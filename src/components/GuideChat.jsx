import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import {
  chatGuideCopy,
  chatGuideSteps,
  getGuideChatWhatsAppHref,
  getGuideTopic,
  guideMenuTopics,
} from '../data/chatGuide.js'

const emptyAnswers = {
  goal: '',
  blocker: '',
  blockerNote: '',
  channel: '',
  formula: '',
}

function createBotMessage(text) {
  return { id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role: 'bot', text }
}

function createUserMessage(text) {
  return { id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role: 'user', text }
}

export default function GuideChat() {
  const panelId = useId()
  const titleId = useId()
  const toggleRef = useRef(null)
  const panelRef = useRef(null)
  const logRef = useRef(null)
  const freeTextRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  // menu | topic | question | note | done
  const [phase, setPhase] = useState('menu')
  const [activeTopicId, setActiveTopicId] = useState(null)
  const [answers, setAnswers] = useState(emptyAnswers)
  const [noteDraft, setNoteDraft] = useState('')
  const [messages, setMessages] = useState(() => [
    createBotMessage(chatGuideCopy.welcome),
    createBotMessage(chatGuideCopy.menuPrompt),
  ])

  const totalSteps = chatGuideSteps.length
  const currentStep = chatGuideSteps[stepIndex]
  const activeTopic = activeTopicId ? getGuideTopic(activeTopicId) : null
  const whatsappHref = getGuideChatWhatsAppHref(answers)

  useEffect(() => {
    if (!open) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    const focusTarget = panelRef.current?.querySelector('button, a, textarea')
    focusTarget?.focus()

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!logRef.current) return
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, phase, open, activeTopicId])

  useEffect(() => {
    if (phase === 'note') {
      freeTextRef.current?.focus()
    }
  }, [phase])

  function appendMessages(...next) {
    setMessages((current) => [...current, ...next])
  }

  function showMenu(promptAgain = true) {
    setPhase('menu')
    setActiveTopicId(null)
    if (promptAgain) {
      appendMessages(createBotMessage(chatGuideCopy.menuPrompt))
    }
  }

  function openTopic(topicId) {
    const topic = getGuideTopic(topicId)
    if (!topic) return

    setActiveTopicId(topic.id)
    setPhase('topic')
    appendMessages(createUserMessage(topic.label), createBotMessage(topic.reply))
  }

  function startQuiz() {
    setActiveTopicId(null)
    setPhase('question')
    setStepIndex(0)
    appendMessages(
      createBotMessage(chatGuideCopy.quizIntro),
      createBotMessage(chatGuideSteps[0].prompt),
    )
  }

  function handleFollowUp(followUp) {
    if (followUp.action === 'quiz') {
      appendMessages(createUserMessage(followUp.label))
      startQuiz()
      return
    }

    if (followUp.action === 'whatsapp') {
      appendMessages(createUserMessage(followUp.label))
      return
    }

    if (followUp.topicId) {
      openTopic(followUp.topicId)
    }
  }

  function restart() {
    setAnswers(emptyAnswers)
    setNoteDraft('')
    setStepIndex(0)
    setActiveTopicId(null)
    setPhase('menu')
    setMessages([
      createBotMessage(chatGuideCopy.welcome),
      createBotMessage(chatGuideCopy.menuPrompt),
    ])
  }

  function advanceAfterAnswer() {
    const nextIndex = stepIndex + 1
    if (nextIndex >= totalSteps) {
      setPhase('done')
      appendMessages(createBotMessage(chatGuideCopy.closing))
      return
    }
    setStepIndex(nextIndex)
    setPhase('question')
    appendMessages(createBotMessage(chatGuideSteps[nextIndex].prompt))
  }

  function selectOption(option) {
    if (phase !== 'question' || !currentStep) return

    const nextAnswers = {
      ...answers,
      [currentStep.id]: option,
    }
    setAnswers(nextAnswers)
    appendMessages(createUserMessage(option))

    if (currentStep.allowFreeText) {
      setPhase('note')
      appendMessages(createBotMessage(chatGuideCopy.addFreeText))
      return
    }

    advanceAfterAnswer()
  }

  function submitNote(skip) {
    const note = skip ? '' : String(noteDraft || '').trim()
    const nextAnswers = {
      ...answers,
      blockerNote: note,
    }
    setAnswers(nextAnswers)
    setNoteDraft('')

    if (note) {
      appendMessages(createUserMessage(note))
    } else {
      appendMessages(createUserMessage('Nessun dettaglio aggiuntivo'))
    }

    advanceAfterAnswer()
  }

  function toggleOpen() {
    setOpen((wasOpen) => {
      const next = !wasOpen
      if (!next) {
        queueMicrotask(() => toggleRef.current?.focus())
      }
      return next
    })
  }

  function goToContact() {
    setOpen(false)
  }

  function goToSection() {
    setOpen(false)
  }

  const topicFollowUps = activeTopic?.followUps || []
  const showWhatsAppInTopic = topicFollowUps.some((item) => item.action === 'whatsapp')

  return (
    <div className={`guide-chat${open ? ' is-open' : ''}`}>
      <button
        ref={toggleRef}
        type="button"
        className="guide-chat-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleOpen}
      >
        <Icon>{open ? 'close' : 'chat'}</Icon>
        <span className="guide-chat-toggle-label">
          {open ? chatGuideCopy.launcherCloseLabel : chatGuideCopy.launcherLabel}
        </span>
      </button>

      {open && (
        <section
          ref={panelRef}
          id={panelId}
          className="guide-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <header className="guide-chat-header">
            <div>
              <h2 id={titleId}>{chatGuideCopy.title}</h2>
              <p>{chatGuideCopy.subtitle}</p>
            </div>
            <button
              type="button"
              className="guide-chat-icon-button"
              aria-label={chatGuideCopy.launcherCloseLabel}
              onClick={toggleOpen}
            >
              <Icon>close</Icon>
            </button>
          </header>

          {(phase === 'question' || phase === 'note') && (
            <p className="guide-chat-progress" aria-live="polite">
              {chatGuideCopy.progressLabel(Math.min(stepIndex + 1, totalSteps), totalSteps)}
            </p>
          )}

          <div className="guide-chat-log" ref={logRef} aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`guide-chat-bubble guide-chat-bubble-${message.role}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="guide-chat-actions">
            {phase === 'menu' && (
              <>
                <div className="guide-chat-chips" role="group" aria-label={chatGuideCopy.menuPrompt}>
                  {guideMenuTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      className="contact-chip guide-chat-chip"
                      onClick={() => openTopic(topic.id)}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
                <a
                  className="button button-outline guide-chat-secondary"
                  href={whatsappHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp subito
                </a>
              </>
            )}

            {phase === 'topic' && activeTopic && (
              <>
                {topicFollowUps.length > 0 && (
                  <div
                    className="guide-chat-chips"
                    role="group"
                    aria-label={`Approfondimenti su ${activeTopic.label}`}
                  >
                    {topicFollowUps.map((followUp) => {
                      if (followUp.action === 'whatsapp') {
                        return (
                          <a
                            key={followUp.label}
                            className="contact-chip guide-chat-chip guide-chat-chip-link"
                            href={whatsappHref}
                            rel="noopener noreferrer"
                            target="_blank"
                            onClick={() => appendMessages(createUserMessage(followUp.label))}
                          >
                            {followUp.label}
                          </a>
                        )
                      }

                      return (
                        <button
                          key={followUp.label}
                          type="button"
                          className="contact-chip guide-chat-chip"
                          onClick={() => handleFollowUp(followUp)}
                        >
                          {followUp.label}
                        </button>
                      )
                    })}
                  </div>
                )}
                <div className="guide-chat-topic-nav">
                  {activeTopic.sectionHref && (
                    <a
                      className="button button-outline guide-chat-secondary"
                      href={activeTopic.sectionHref}
                      onClick={goToSection}
                    >
                      {activeTopic.sectionLabel || 'Vai alla sezione'}
                    </a>
                  )}
                  <button
                    type="button"
                    className="button button-cyan guide-chat-primary"
                    onClick={() => showMenu(true)}
                  >
                    {chatGuideCopy.backToMenu}
                  </button>
                  {!showWhatsAppInTopic && (
                    <a
                      className="button button-outline guide-chat-secondary"
                      href={whatsappHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {chatGuideCopy.whatsappCta}
                    </a>
                  )}
                </div>
              </>
            )}

            {phase === 'question' && currentStep && (
              <div className="guide-chat-chips" role="group" aria-label={currentStep.prompt}>
                {currentStep.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="contact-chip guide-chat-chip"
                    onClick={() => selectOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {phase === 'note' && (
              <div className="guide-chat-note">
                <label htmlFor="guide-chat-blocker-note">
                  <span>{currentStep?.freeTextLabel || chatGuideCopy.addFreeText}</span>
                  <textarea
                    ref={freeTextRef}
                    id="guide-chat-blocker-note"
                    rows="2"
                    value={noteDraft}
                    onChange={(event) => setNoteDraft(event.target.value)}
                    placeholder={currentStep?.freeTextPlaceholder || ''}
                  />
                </label>
                <div className="guide-chat-note-actions">
                  <button
                    type="button"
                    className="button button-cyan guide-chat-primary"
                    onClick={() => submitNote(false)}
                  >
                    Continua <Icon>arrow_forward</Icon>
                  </button>
                  <button
                    type="button"
                    className="button button-outline guide-chat-secondary"
                    onClick={() => submitNote(true)}
                  >
                    {chatGuideCopy.skipFreeText}
                  </button>
                </div>
              </div>
            )}

            {phase === 'done' && (
              <>
                <a
                  className="button button-cyan guide-chat-primary"
                  href={whatsappHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {chatGuideCopy.whatsappCta} <Icon>north_east</Icon>
                </a>
                <a
                  className="button button-outline guide-chat-secondary"
                  href="#contatto"
                  onClick={goToContact}
                >
                  {chatGuideCopy.contactCta}
                </a>
                <button type="button" className="guide-chat-restart" onClick={restart}>
                  {chatGuideCopy.restart}
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
