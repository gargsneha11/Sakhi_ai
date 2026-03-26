import { motion } from 'framer-motion'

export default function QuizResult({ score, total, onRetry, onNew }) {
  const percent = Math.round((score / total) * 100)

  const feedback =
    percent === 100 ? { emoji: '🏆', msg: 'Perfect score! Absolutely brilliant!',      color: '#f59e0b' } :
    percent >= 70   ? { emoji: '🎉', msg: 'Great job! You really know your stuff!',     color: '#10b981' } :
    percent >= 40   ? { emoji: '📚', msg: 'Good effort! A little more practice helps.', color: '#3b82f6' } :
                      { emoji: '💪', msg: "Keep going! Every attempt makes you better.", color: '#f43f5e' }

  const circumference = 2 * Math.PI * 40
  const dash = circumference - (percent / 100) * circumference

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl p-8 flex flex-col items-center gap-6 shadow-sm max-w-md mx-auto">

      {/* Score ring */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <motion.circle cx="50" cy="50" r="40" fill="none"
            stroke={feedback.color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-800">{score}</span>
          <span className="text-xs text-gray-400 font-medium">of {total}</span>
        </div>
      </div>

      {/* Emoji + message */}
      <div className="text-center">
        <div className="text-4xl mb-2">{feedback.emoji}</div>
        <p className="text-base font-bold text-gray-800">{percent}% Score</p>
        <p className="text-sm mt-1 font-medium" style={{ color: feedback.color }}>{feedback.msg}</p>
      </div>

      {/* Per-question badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: total }).map((_, i) => {
          const qId = i + 1
          const correct = Object.keys({}).length === 0 ? null : null // placeholder
          return (
            <span key={i} className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ background: i < score ? '#10b981' : '#f1f5f9', color: i < score ? 'white' : '#9ca3af' }}>
              {i < score ? '✓' : '✗'}
            </span>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button onClick={onRetry}
          className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all hover:opacity-80"
          style={{ borderColor: 'var(--mood-accent,#7c3aed)', color: 'var(--mood-accent,#7c3aed)' }}>
          Retry Quiz
        </button>
        <button onClick={onNew}
          className="flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
          style={{ background: 'var(--mood-accent,#7c3aed)' }}>
          New Quiz ✨
        </button>
      </div>
    </motion.div>
  )
}
