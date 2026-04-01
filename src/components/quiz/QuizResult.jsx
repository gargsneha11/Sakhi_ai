import { motion } from 'framer-motion'

export default function QuizResult({ score, total, onRetry, onNew }) {
  const percent = Math.round((score / total) * 100)

  const feedback =
    percent === 100 ? { emoji: '🏆', msg: 'Perfect score! Absolutely brilliant!',      color: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200'  } :
    percent >= 70   ? { emoji: '🎉', msg: 'Great job! You really know your stuff!',     color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200' } :
    percent >= 40   ? { emoji: '📚', msg: 'Good effort! A little more practice helps.', color: '#3b82f6', bg: 'bg-blue-50',    border: 'border-blue-200'   } :
                      { emoji: '💪', msg: "Keep going! Every attempt makes you better.", color: '#f43f5e', bg: 'bg-red-50',     border: 'border-red-200'    }

  const circumference = 2 * Math.PI * 44
  const dash = circumference - (percent / 100) * circumference

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl shadow-sm overflow-hidden max-w-md mx-auto">

      {/* Top result banner */}
      <div className={`${feedback.bg} ${feedback.border} border-b px-6 py-6 flex flex-col items-center gap-3`}>
        <div className="text-5xl">{feedback.emoji}</div>
        <p className="text-base font-extrabold text-gray-800">{feedback.msg}</p>
      </div>

      {/* Score ring + stats */}
      <div className="px-6 py-6 flex items-center gap-6">
        {/* Ring */}
        <div className="relative w-28 h-28 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <motion.circle cx="50" cy="50" r="44" fill="none"
              stroke={feedback.color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dash }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-gray-800">{percent}%</span>
            <span className="text-[10px] text-gray-400 font-medium">Score</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-600">✅ Correct</span>
            <span className="text-sm font-extrabold text-emerald-700">{score}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-red-50 border border-red-100">
            <span className="text-xs font-semibold text-red-500">❌ Wrong</span>
            <span className="text-sm font-extrabold text-red-600">{total - score}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-semibold text-gray-500">📝 Total</span>
            <span className="text-sm font-extrabold text-gray-700">{total}</span>
          </div>
        </div>
      </div>

      {/* Per-question badges */}
      <div className="px-6 pb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Question breakdown</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
              i < score ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400'
            }`}>
              {i < score ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-3">
        <button onClick={onRetry}
          className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all hover:opacity-80"
          style={{ borderColor: 'var(--mood-accent,#7c3aed)', color: 'var(--mood-accent,#7c3aed)' }}>
          🔄 Retry
        </button>
        <button onClick={onNew}
          className="flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
          style={{ background: 'var(--mood-accent,#7c3aed)' }}>
          ✨ New Quiz
        </button>
      </div>
    </motion.div>
  )
}
