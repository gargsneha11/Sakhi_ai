import { useState, useEffect, useRef } from 'react'

const TOTAL = 15 * 60

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function useMoodTimer(email = 'guest') {
  const STORAGE_KEY = `sakhi-mood-timer-${email}`

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (saved && saved.date === getTodayKey()) return saved
    } catch {}
    return { date: getTodayKey(), elapsed: 0, running: false }
  }
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  const [elapsed, setElapsed] = useState(() => loadState().elapsed)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const remaining = TOTAL - elapsed
  const finished = elapsed >= TOTAL

  // Persist on every change
  useEffect(() => {
    saveState({ date: getTodayKey(), elapsed, running })
  }, [elapsed, running])

  // Tick
  useEffect(() => {
    if (running && !finished) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= TOTAL) { clearInterval(intervalRef.current); return TOTAL }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, finished])

  // Pause when tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setRunning(false)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const start = () => { if (!finished) setRunning(true) }
  const pause = () => setRunning(false)
  const reset = () => { setRunning(false); setElapsed(0) }

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
  const seconds = String(remaining % 60).padStart(2, '0')

  return { minutes, seconds, running, finished, elapsed, total: TOTAL, start, pause, reset }
}
