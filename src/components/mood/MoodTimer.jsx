import useMoodTimer from '../../hooks/useMoodTimer'
import { useAuth } from '../../context/AuthContext'
import { Play, Pause, RotateCcw } from 'lucide-react'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function MoodTimer() {
  const { user } = useAuth()
  const { minutes, seconds, running, finished, elapsed, total, start, pause, reset } = useMoodTimer(user?.email)

  const progress = elapsed / total
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-6 w-full">

      {/* Ring */}
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="9" />
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke={finished ? '#22c55e' : '#7c3aed'}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">
            {finished ? '🎉' : `${minutes}:${seconds}`}
          </span>
          <span className="text-xs text-gray-400 mt-1 font-medium">
            {finished ? 'Complete!' : 'remaining'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!finished && (
          running
            ? <button onClick={pause} className="btn-outline">
                <Pause size={14} /> Pause
              </button>
            : <button onClick={start} className="btn-primary">
                <Play size={14} /> {elapsed > 0 ? 'Resume' : 'Start'}
              </button>
        )}
        <button onClick={reset} className="btn-ghost">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {finished && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium px-5 py-3 rounded-xl text-center">
          ⏰ Time is over for today! Great job taking a break 🌸
        </div>
      )}
    </div>
  )
}
