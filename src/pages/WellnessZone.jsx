import { useState, useEffect, useRef } from 'react'
import ColorTherapy from '../components/wellness/ColorTherapy'
import Affirmations from '../components/wellness/Affirmations'
import SelfCareChecklist from '../components/wellness/SelfCareChecklist'
import { useAuth } from '../context/AuthContext'
import { apiGetNotes, apiSaveNotes } from '../utils/api'

// ── Breathing ────────────────────────────────────────────────────────────────
const PHASES = [
  { label: 'Ready?',  duration: 2, scale: 1.0, color: 'from-violet-100 to-pink-100',  text: 'text-violet-500' },
  { label: 'Inhale',  duration: 4, scale: 1.5, color: 'from-blue-100 to-violet-100',  text: 'text-blue-600'   },
  { label: 'Hold',    duration: 4, scale: 1.5, color: 'from-purple-100 to-blue-100',  text: 'text-purple-600' },
  { label: 'Exhale',  duration: 6, scale: 1.0, color: 'from-pink-100 to-purple-100',  text: 'text-pink-600'   },
  { label: 'Hold',    duration: 2, scale: 1.0, color: 'from-violet-100 to-pink-100',  text: 'text-violet-500' },
]

function BreathingCard() {
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(PHASES[0].duration)
  const [active, setActive] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!active) return
    timerRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = (p + 1) % PHASES.length
            setCount(PHASES[next].duration)
            return next
          })
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [active])

  const cur = PHASES[phase]

  return (
    <div className="card p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-gray-800">🌬️ 4-4-6-2 Breathing</h2>
        <p className="text-xs text-gray-400 mt-0.5">Calm your mind before studying</p>
      </div>

      <div className="flex flex-col items-center gap-5">
        {/* Animated circle */}
        <div className="relative flex items-center justify-center w-40 h-40">
          <div
            className={`absolute rounded-full bg-gradient-to-br ${cur.color} opacity-30 transition-all ease-in-out`}
            style={{
              width: '100%', height: '100%',
              transform: `scale(${active ? cur.scale : 1})`,
              transitionDuration: `${cur.duration * 1000}ms`,
            }}
          />
          <div
            className={`absolute rounded-full bg-gradient-to-br ${cur.color} opacity-60 transition-all ease-in-out`}
            style={{
              width: '70%', height: '70%',
              transform: `scale(${active ? cur.scale : 1})`,
              transitionDuration: `${cur.duration * 1000}ms`,
            }}
          />
          <div className={`relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${cur.color} shadow-md transition-all ease-in-out`}
            style={{
              transform: `scale(${active ? cur.scale : 1})`,
              transitionDuration: `${cur.duration * 1000}ms`,
            }}
          >
            <span className={`text-sm font-bold ${cur.text}`}>{cur.label}</span>
            {active && <span className={`text-2xl font-bold ${cur.text}`}>{count}</span>}
          </div>
        </div>

        <button
          onClick={() => setActive(a => !a)}
          className={active ? 'btn-outline' : 'btn-primary'}
        >
          {active ? '⏸ Pause' : '▶ Start'}
        </button>

        <div className="flex gap-2 text-xs text-gray-400">
          {['Inhale 4s', 'Hold 4s', 'Exhale 6s', 'Hold 2s'].map(t => (
            <span key={t} className="bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Gratitude Journal ─────────────────────────────────────────────────────────
function GratitudeJournal({ email }) {
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    apiGetNotes(email).then(data => { if (data.notes) setNotes(data.notes) })
  }, [email])

  function persist(updated) {
    setNotes(updated)
    apiSaveNotes(email, updated)
  }

  function add() {
    if (!input.trim()) return
    const updated = [{ text: input.trim(), date: new Date().toLocaleDateString() }, ...notes]
    persist(updated)
    setInput('')
  }

  function remove(i) {
    persist(notes.filter((_, idx) => idx !== i))
  }

  return (
    <div className="card p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold text-gray-800">📓 Gratitude Journal</h2>
        <p className="text-xs text-gray-400 mt-0.5">Write 3 things you're grateful for. It shifts your mindset.</p>
      </div>

      <div className="flex gap-2">
        <input
          className="input flex-1 text-sm"
          placeholder="Something that made me smile today..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button onClick={add} className="btn-primary px-4 text-sm">Add</button>
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-hide">
        {notes.length === 0 && (
          <p className="text-xs text-gray-300 text-center py-4">Your gratitude notes will appear here 🌸</p>
        )}
        {notes.map((n, i) => (
          <div key={i} className="flex items-start gap-3 bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-2xl px-4 py-3">
            <span className="text-lg">🌸</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 leading-relaxed">{n.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
            </div>
            <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 transition-colors text-xs shrink-0">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Mood Swing Relief Cards ───────────────────────────────────────────────────
const MOOD_CARDS = [
  { emoji: '🎨', title: 'Color Therapy',        sub: 'Tap the circles to create a calming pattern',  component: ColorTherapy    },
  { emoji: '💜', title: 'Positive Affirmations', sub: 'Read and repeat these to yourself',            component: Affirmations    },
  { emoji: '✅', title: 'Self-Care Checklist',   sub: 'Small things that make a big difference',      component: SelfCareChecklist },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WellnessZone() {
  const [activeCard, setActiveCard] = useState(null)
  const { user } = useAuth()

  const ActiveComponent = activeCard !== null ? MOOD_CARDS[activeCard].component : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-10">

      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
          🌿
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Wellness Zone</h1>
        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
          A safe space to recharge, reflect, and find your calm.
        </p>
      </div>

      {/* Mood Swing Relief */}
      <section className="flex flex-col gap-4">
        <div className="bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-gray-800">🌊 Mood Swing Relief</h2>
          <p className="text-sm text-gray-500 mt-1">
            Feeling overwhelmed? These activities are designed to help you feel lighter and calmer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {MOOD_CARDS.map((card, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(activeCard === i ? null : i)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border text-center transition-all duration-200
                  ${activeCard === i
                    ? 'bg-white border-violet-300 shadow-md scale-[1.02]'
                    : 'bg-white/60 border-white hover:border-violet-200 hover:bg-white hover:shadow-sm'
                  }`}
              >
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-sm font-semibold text-gray-800">{card.title}</span>
                <span className="text-xs text-gray-400 leading-relaxed">{card.sub}</span>
                <span className={`text-xs font-medium mt-1 transition-colors ${activeCard === i ? 'text-violet-600' : 'text-gray-300'}`}>
                  {activeCard === i ? '▲ Close' : '▼ Open'}
                </span>
              </button>
            ))}
          </div>

          {/* Expanded activity */}
          {ActiveComponent && (
            <div className="mt-5 bg-white rounded-2xl border border-violet-100 p-5 shadow-sm">
              <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-4">
                {MOOD_CARDS[activeCard].title}
              </p>
              <ActiveComponent />
            </div>
          )}
        </div>
      </section>

      {/* Breathing + Gratitude */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BreathingCard />
        <GratitudeJournal email={user.email} />
      </div>

    </div>
  )
}
