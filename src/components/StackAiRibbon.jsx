import { CodespacesIcon } from '@primer/octicons-react'
import {
  siClaude,
  siCursor,
  siFirebase,
  siGithub,
  siGooglegemini,
  siGooglejules,
  siKimi,
  siReact,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
} from 'simple-icons'
import googleStitchLogo from '../assets/tool-logos/google-stitch.svg'
import groqLogo from '../assets/tool-logos/groq.svg'

const brandColor = (icon) => (
  icon.hex === '000000' || icon.hex === '181717' ? '#f4f5f7' : `#${icon.hex}`
)

const tools = [
  { name: 'React', icon: siReact },
  { name: 'Google AI Studio', icon: siGooglegemini },
  { name: 'Vite', icon: siVite },
  { name: 'Google Stitch', asset: googleStitchLogo, color: '#8ab4f8' },
  { name: 'Tailwind CSS', icon: siTailwindcss },
  { name: 'Cursor', icon: siCursor },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'GitHub Codespaces', octicon: CodespacesIcon, color: '#f4f5f7' },
  { name: 'GitHub', icon: siGithub },
  { name: 'Jules', icon: siGooglejules },
  { name: 'Vercel', icon: siVercel },
  { name: 'Kimi', icon: siKimi },
  { name: 'Supabase', icon: siSupabase },
  { name: 'Claude', icon: siClaude },
  { name: 'Firebase', icon: siFirebase },
  { name: 'Groq', asset: groqLogo, color: '#f43e01' },
  { name: 'Stripe', icon: siStripe },
]

function ToolItems({ duplicate = false }) {
  return (
    <ul className="stack-ribbon-group" aria-hidden={duplicate || undefined}>
      {tools.map((tool) => {
        const color = tool.color || brandColor(tool.icon)

        return (
          <li
            className="stack-ribbon-item"
            key={tool.name}
            style={{ '--tool-color': color }}
          >
            <span className="stack-ribbon-mark" aria-hidden="true">
              {tool.asset ? (
                <img src={tool.asset} alt="" />
              ) : tool.octicon ? (
                <tool.octicon size={19} />
              ) : (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d={tool.icon.path} />
                </svg>
              )}
            </span>
            <span>{tool.name}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default function StackAiRibbon() {
  return (
    <section
      className="stack-ribbon"
      aria-label="Stack e workflow di intelligenza artificiale"
    >
      <p className="stack-ribbon-label">
        STACK &amp; AI WORKFLOW <span>·</span> DAL CODICE ALL’INTELLIGENZA ARTIFICIALE
      </p>
      <div className="stack-ribbon-viewport">
        <div className="stack-ribbon-track">
          <ToolItems />
          <ToolItems duplicate />
        </div>
      </div>
    </section>
  )
}
