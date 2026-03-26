import { useState, useEffect, useRef } from 'react'
import MoodTimer from '../components/mood/MoodTimer'
import MoodCard from '../components/mood/MoodCard'
import MemoryGame from '../components/mood/MemoryGame'
import BreathingExercise from '../components/mood/BreathingExercise'
import WordGame from '../components/mood/WordGame'
import { useAuth } from '../context/AuthContext'
import { usePomodoro } from '../context/PomodoroContext'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { id: 'memory',    label: '🧠 Memory',    desc: 'Flip cards and match pairs' },
  { id: 'breathing', label: '🌬️ Breathing', desc: 'Calm your mind with guided breathing' },
  { id: 'words',     label: '📝 Words',     desc: 'Unscramble words for a quick brain boost' },
]

const BREAK_SECONDS = 10 * 60 // 10 minutes

function pad(n) { return String(n).padStart(2, '0') }

export default function MoodBooster() {
  const [tab, setTab]           = useState('memory')
  const { user }                = useAuth()
  const { isMoodBoosterBlocked } = usePomodoro()

  const [seconds,  setSeconds]  = useState(BREAK_SECONDS)
  const [showPopup, setShowPopup] = useState(false)
  const intervalRef = useRef(null)

  // Start 10-min timer automatically when page loads
  useEffect(() => {
    setSeconds(BREAK_SECONDS)
    setShowPopup(false)
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setShowPopup(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const progress = ((BREAK_SECONDS - seconds) / BREAK_SECONDS) * 100

  if (isMoodBoosterBlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-md"
          style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>🔒</div>
        <h2 className="text-2xl font-bold text-gray-800">Mood Booster Locked</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          You're in a focus session right now! 💪<br />
          Mood Booster will unlock once you <strong>stop</strong> the timer.
        </p>
        <div className="px-4 py-3 rounded-2xl border text-sm font-medium"
          style={{ background: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)', borderColor: 'var(--mood-accent-light,#ede9fe)' }}>
          ⏱ Go back to Study Goals to manage your timer
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* ── Time's up popup ── */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-2xl">
              <div className="text-5xl">⏰</div>
              <h2 className="text-xl font-extrabold text-gray-800">Break's Over!</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your 10-minute break is done. Time to get back to work! You've got this 💪
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
                style={{ background: 'var(--mood-accent, #7c3aed)' }}
              >
                Back to Work 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl">😊</div>
        <h1 className="text-3xl font-bold text-gray-800">Mood Booster</h1>
        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">Take a short break and refresh your mind</p>
      </div>

      {/* ── 10-min break countdown bar ── */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
        <div className="text-2xl">{seconds === 0 ? '⏰' : '🌟'}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-600">Break Timer</span>
            <span className="text-sm font-extrabold tabular-nums" style={{ color: 'var(--mood-accent,#7c3aed)' }}>
              {pad(mins)}:{pad(secs)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%`, background: 'var(--mood-accent,#7c3aed)' }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {seconds > 0 ? `${mins}m ${pad(secs)}s remaining — enjoy your break!` : 'Time\'s up! Head back to work.'}
          </p>
        </div>
      </div>

      {/* ── Activity Tabs ── */}
      <div className="flex flex-col gap-4">
        <p className="section-title">🎮 Mini Activities</p>

        {/* Tab buttons */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200
                ${tab === t.id
                  ? 'bg-white shadow text-violet-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p className="text-xs text-gray-400 text-center">
          {TABS.find(t => t.id === tab)?.desc}
        </p>

        {/* Tab content */}
        <div className="card p-6">
          {tab === 'memory'    && <MemoryGame />}
          {tab === 'breathing' && <BreathingExercise />}
          {tab === 'words'     && <WordGame />}
        </div>
      </div>

      {/* ── Tips (existing) ── */}
      <div className="flex flex-col gap-3">
        <p className="section-title">💡 While you rest, try this</p>
        <MoodCard />
        <MoodCard />
      </div>

    </div>
  )
}
