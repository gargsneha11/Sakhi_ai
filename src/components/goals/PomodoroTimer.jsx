import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import { usePomodoro } from '../../context/PomodoroContext'

const MOOD_CONFIG = {
  stressed:  { study: 25, break: 5 },
  tired:     { study: 25, break: 5 },
  motivated: { study: 25, break: 5 },
  confused:  { study: 25, break: 5 },
  happy:     { study: 25, break: 5 },
  sad:       { study: 25, break: 5 },
  anxious:   { study: 25, break: 5 },
  neutral:   { study: 25, break: 5 },
}

function pad(n) { return String(n).padStart(2, '0') }

function todayKey() { return new Date().toISOString().slice(0, 10) }

// Save session count for today + keep 7-day history
function saveSession(count) {
  const history = JSON.parse(localStorage.getItem('sakhi-pomodoro-history') || '{}')
  history[todayKey()] = count
  // Keep only last 7 days
  const keys = Object.keys(history).sort().slice(-7)
  const trimmed = {}
  keys.forEach(k => { trimmed[k] = history[k] })
  localStorage.setItem('sakhi-pomodoro-history', JSON.stringify(trimmed))
  // Also update today's quick-access key
  localStorage.setItem('sakhi-pomodoro-sessions', JSON.stringify({ date: todayKey(), count }))
}

function loadTodaySessions() {
  const saved = JSON.parse(localStorage.getItem('sakhi-pomodoro-sessions') || '{}')
  return saved.date === todayKey() ? (saved.count || 0) : 0
}

export default function PomodoroTimer({ onDismiss }) {
  const mood   = (localStorage.getItem('userMood') || 'neutral').toLowerCase()
  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.neutral
  const { setPomodoroState, sessions, setSessions } = usePomodoro()

  const [phase,    setPhase]    = useState('focus')
  const [seconds,  setSeconds]  = useState(config.study * 60)
  const [running,  setRunning]  = useState(true)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  // Load today's sessions from localStorage
  useEffect(() => {
    setSessions(loadTodaySessions())
  }, [])

  // Persist sessions to localStorage daily
  function saveSession(count) {
    localStorage.setItem('sakhi-pomodoro-sessions', JSON.stringify({ date: todayKey(), count }))
  }

  // Sync global pomodoro state
  useEffect(() => {
    if (finished)      setPomodoroState('finished')
    else if (running)  setPomodoroState('running')
    else               setPomodoroState('paused')
  }, [running, finished])

  // Cleanup
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    setPomodoroState('idle')
  }, [])

  // Tick
  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!running || finished) return
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          handlePhaseEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, phase, finished])

  function handlePhaseEnd() {
    if (phase === 'focus') {
      const newCount = sessions + 1
      setSessions(newCount)
      saveSession(newCount)
      setPhase('break')
      setSeconds(config.break * 60)
      setRunning(true)
    } else {
      setPhase('focus')
      setSeconds(config.study * 60)
      setRunning(true)
    }
  }

  function handlePause()  { setRunning(false) }
  function handleResume() { setRunning(true) }

  function handleStop() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setFinished(true)
    setPomodoroState('idle')
  }

  function handleDone() {
    setSessions(0)
    saveSession(0)
    onDismiss?.()
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  // ── Finished summary ──────────────────────────────────────────────────────
  if (finished) return null  // handled in Navbar finished state

  // ── Active: render nothing here — all UI is in Navbar ────────────────────
  // Expose state via context only; Navbar reads from context
  return null
}

// ── Focus History Card (used on Home page) ───────────────────────────────────
export function FocusHistory() {
  const history    = JSON.parse(localStorage.getItem('sakhi-pomodoro-history') || '{}')
  const today      = todayKey()

  const days = Array.from({ length: 7 }, (_, i) => {
    const d     = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key   = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    return { key, label, count: history[key] || 0, isToday: key === today }
  })

  const totalToday = days.find(d => d.isToday)?.count || 0
  const totalWeek  = days.reduce((s, d) => s + d.count, 0)
  const maxCount   = Math.max(...days.map(d => d.count), 1)

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm">

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-gray-800">⏱ Focus Sessions</h3>
          <p className="text-xs text-gray-400 mt-0.5">Your last 7 days</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-center px-3 py-1.5 rounded-2xl border"
            style={{ background: 'var(--mood-accent-light,#ede9fe)', borderColor: 'var(--mood-accent-light,#ede9fe)' }}>
            <p className="text-base font-extrabold" style={{ color: 'var(--mood-accent,#7c3aed)' }}>{totalToday}</p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--mood-accent-text,#4c1d95)' }}>Today</p>
          </div>
          <div className="text-center px-3 py-1.5 rounded-2xl border border-emerald-100 bg-emerald-50">
            <p className="text-base font-extrabold text-emerald-600">{totalWeek}</p>
            <p className="text-[10px] font-medium text-emerald-500">This week</p>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2" style={{ height: '80px' }}>
        {days.map(d => (
          <div key={d.key} className="flex-1 flex flex-col items-center justify-end gap-1">
            {d.count > 0 && (
              <span className="text-[10px] font-bold" style={{ color: d.isToday ? 'var(--mood-accent,#7c3aed)' : '#9ca3af' }}>
                {d.count}
              </span>
            )}
            <div
              className="w-full rounded-xl transition-all duration-700"
              style={{
                height: `${Math.max((d.count / maxCount) * 52, 6)}px`,
                background: d.isToday
                  ? 'var(--mood-accent, #7c3aed)'
                  : d.count > 0
                    ? 'var(--mood-accent-light, #ede9fe)'
                    : '#f1f5f9',
              }}
            />
          </div>
        ))}
      </div>

      {/* Day labels */}
      <div className="flex justify-between mt-2">
        {days.map(d => (
          <div key={d.key} className="flex-1 text-center">
            <span className={`text-[10px] font-semibold ${
              d.isToday ? 'text-gray-800' : 'text-gray-400'
            }`}>
              {d.isToday ? 'Today' : d.label}
            </span>
          </div>
        ))}
      </div>

      {/* Empty state message */}
      {totalWeek === 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          No sessions yet — start your first focus session from the Home page! 🎯
        </p>
      )}
    </div>
  )
}
export function NavbarTimerBar() {
  const mood   = (localStorage.getItem('userMood') || 'neutral').toLowerCase()
  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.neutral
  const { pomodoroState, setPomodoroState, sessions, setSessions, setShowTimer } = usePomodoro()

  const [phase,   setPhase]   = useState('focus')
  const [seconds, setSeconds] = useState(config.study * 60)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef(null)

  // Load today's sessions
  useEffect(() => {
    setSessions(loadTodaySessions())
    setRunning(true)
  }, [])

  function saveSession(count) { /* uses global saveSession above */ }

  useEffect(() => {
    if (running) setPomodoroState('running')
    else         setPomodoroState('paused')
  }, [running])

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          handlePhaseEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, phase])

  function handlePhaseEnd() {
    if (phase === 'focus') {
      const newCount = sessions + 1
      setSessions(newCount)
      saveSession(newCount)
      setPhase('break')
      setSeconds(config.break * 60)
      setRunning(true)
    } else {
      setPhase('focus')
      setSeconds(config.study * 60)
      setRunning(true)
    }
  }

  function handleStop() {
    clearInterval(intervalRef.current)
    setPomodoroState('idle')
    setShowTimer(false)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isBreak = phase === 'break'

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-semibold shadow-sm"
      style={{
        background: isBreak ? '#ecfdf5' : 'var(--mood-accent-light, #ede9fe)',
        borderColor: isBreak ? '#a7f3d0' : 'var(--mood-accent-light, #ede9fe)',
        color: isBreak ? '#065f46' : 'var(--mood-accent-text, #4c1d95)',
      }}
    >
      {/* Phase + time */}
      <span>{isBreak ? '☕' : '📚'}</span>
      <span className="tabular-nums font-bold">{pad(mins)}:{pad(secs)}</span>

      {/* Sessions today */}
      {sessions > 0 && (
        <span className="hidden sm:inline text-[10px] opacity-70">
          ✅ {sessions} today
        </span>
      )}

      {/* Controls */}
      {running ? (
        <button
          onClick={() => setRunning(false)}
          className="w-5 h-5 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-all"
          style={{ background: isBreak ? '#10b981' : 'var(--mood-accent, #7c3aed)' }}
        >
          <Pause size={10} />
        </button>
      ) : (
        <button
          onClick={() => setRunning(true)}
          className="w-5 h-5 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-all"
          style={{ background: isBreak ? '#10b981' : 'var(--mood-accent, #7c3aed)' }}
        >
          <Play size={10} />
        </button>
      )}

      <button
        onClick={handleStop}
        className="w-5 h-5 rounded-lg flex items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 transition-all"
        title="Stop & unlock Mood Booster"
      >
        <Square size={10} />
      </button>
    </div>
  )
}
