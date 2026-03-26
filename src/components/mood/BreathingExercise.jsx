import { useState, useEffect } from 'react'

const PHASES = [
  { label: 'Inhale',  duration: 4, scale: 'scale-150', color: 'bg-blue-200',   text: 'text-blue-600' },
  { label: 'Hold',    duration: 4, scale: 'scale-150', color: 'bg-purple-200', text: 'text-purple-600' },
  { label: 'Exhale',  duration: 6, scale: 'scale-100', color: 'bg-pink-200',   text: 'text-pink-600' },
]

export default function BreathingExercise() {
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(PHASES[0].duration)
  const [active, setActive] = useState(false)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!active) return
    if (count === 0) {
      const next = (phase + 1) % PHASES.length
      if (next === 0) setCycles(c => c + 1)
      setPhase(next)
      setCount(PHASES[next].duration)
      return
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [active, count, phase])

  function toggle() {
    if (!active) { setPhase(0); setCount(PHASES[0].duration) }
    setActive(a => !a)
  }

  const current = PHASES[phase]

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <p className="text-sm text-gray-400 text-center max-w-xs">
        Follow the circle. Breathe slowly and let your mind relax.
      </p>

      {/* Animated circle */}
      <div className="relative flex items-center justify-center w-52 h-52">
        {/* Outer glow ring */}
        <div className={`absolute w-full h-full rounded-full ${current.color} opacity-30 transition-transform duration-[4000ms] ease-in-out ${active ? current.scale : 'scale-100'}`} />
        <div className={`absolute w-3/4 h-3/4 rounded-full ${current.color} opacity-50 transition-transform duration-[4000ms] ease-in-out ${active ? current.scale : 'scale-100'}`} />
        {/* Core */}
        <div className={`relative z-10 w-28 h-28 rounded-full ${current.color} flex flex-col items-center justify-center shadow-lg transition-transform duration-[4000ms] ease-in-out ${active ? current.scale : 'scale-100'}`}>
          <span className={`text-lg font-bold ${current.text}`}>{current.label}</span>
          <span className={`text-3xl font-bold ${current.text}`}>{count}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggle} className={active ? 'btn-outline' : 'btn-primary'}>
          {active ? '⏸ Pause' : '▶ Start'}
        </button>
        {cycles > 0 && <span className="text-sm text-gray-400">🔄 {cycles} cycle{cycles > 1 ? 's' : ''}</span>}
      </div>

      {/* Phase indicators */}
      <div className="flex gap-3">
        {PHASES.map((p, i) => (
          <div key={p.label} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${i === phase && active ? `${p.color} ${p.text}` : 'bg-gray-100 text-gray-400'}`}>
            {p.label} {p.duration}s
          </div>
        ))}
      </div>
    </div>
  )
}
