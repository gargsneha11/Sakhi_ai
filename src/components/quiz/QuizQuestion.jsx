import { motion } from 'framer-motion'

const LABELS = ['A', 'B', 'C', 'D']

export default function QuizQuestion({ question, index, total, onAnswer, selected }) {
  const getStyle = (option) => {
    if (!selected) return {
      wrapper: 'border-gray-100 hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer',
      label:   'bg-gray-100 text-gray-500',
    }
    if (option === question.answer) return {
      wrapper: 'border-emerald-300 bg-emerald-50',
      label:   'bg-emerald-400 text-white',
    }
    if (option === selected) return {
      wrapper: 'border-red-300 bg-red-50',
      label:   'bg-red-400 text-white',
    }
    return { wrapper: 'border-gray-100 opacity-50', label: 'bg-gray-100 text-gray-400' }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col gap-5">

      {/* Question number badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background: 'var(--mood-accent,#7c3aed)' }}>
          Question {index + 1}
        </span>
      </div>

      {/* Question text */}
      <p className="text-base font-semibold text-gray-800 leading-relaxed">{question.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, i) => {
          const s = getStyle(option)
          return (
            <button key={option} onClick={() => !selected && onAnswer(option)}
              className={`text-left px-4 py-3.5 text-sm rounded-2xl border-2 transition-all flex items-center gap-3 ${s.wrapper}`}>
              <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-all ${s.label}`}>
                {LABELS[i]}
              </span>
              <span className="text-gray-700 font-medium">{option}</span>
              {selected && option === question.answer && (
                <span className="ml-auto text-emerald-500 text-base">✓</span>
              )}
              {selected && option === selected && option !== question.answer && (
                <span className="ml-auto text-red-400 text-base">✗</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`text-sm px-4 py-3.5 rounded-2xl leading-relaxed flex items-start gap-2 ${
            selected === question.answer
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
          <span className="text-base shrink-0">{selected === question.answer ? '✅' : '❌'}</span>
          <span><strong>{selected === question.answer ? 'Correct! ' : 'Wrong! '}</strong>{question.explanation}</span>
        </motion.div>
      )}
    </div>
  )
}
