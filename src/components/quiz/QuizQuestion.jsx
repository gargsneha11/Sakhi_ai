import { motion } from 'framer-motion'

const LABELS = ['A', 'B', 'C', 'D']

// Normalize for comparison — trim + lowercase to avoid mismatch
function match(a, b) {
  return a?.trim().toLowerCase() === b?.trim().toLowerCase()
}

export default function QuizQuestion({ question, index, total, onAnswer, selected, showExplanationAlways }) {
  const isCorrect = (option) => match(option, question.answer)
  const isSelected = (option) => match(option, selected)

  const getStyle = (option) => {
    if (!selected) return {
      wrapper: 'border-gray-100 bg-white/80 hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm',
      label:   'bg-gray-100 text-gray-500',
    }
    if (isCorrect(option)) return {
      wrapper: 'border-emerald-300 bg-emerald-50',
      label:   'bg-emerald-500 text-white',
    }
    if (isSelected(option)) return {
      wrapper: 'border-red-300 bg-red-50',
      label:   'bg-red-400 text-white',
    }
    return { wrapper: 'border-gray-100 bg-white/40 opacity-50', label: 'bg-gray-100 text-gray-400' }
  }

  const answered      = !!selected
  const gotItRight    = answered && isCorrect(selected)
  const showExplanation = answered || showExplanationAlways

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl shadow-sm overflow-hidden">

      {/* Question header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: 'var(--mood-accent,#7c3aed)' }}>
            Q{index + 1}
          </span>
          <span className="text-xs text-gray-400 font-medium">of {total}</span>
        </div>
        <p className="text-base font-bold text-gray-800 leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="px-6 pb-2 flex flex-col gap-2.5">
        {question.options.map((option, i) => {
          const s = getStyle(option)
          return (
            <button key={option} onClick={() => !selected && onAnswer(option)}
              className={`text-left px-4 py-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${s.wrapper}`}>
              <span className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 transition-all ${s.label}`}>
                {LABELS[i]}
              </span>
              <span className="text-sm font-medium text-gray-700 flex-1">{option}</span>
              {answered && isCorrect(option) && <span className="text-emerald-500 font-bold text-lg shrink-0">✓</span>}
              {answered && isSelected(option) && !isCorrect(option) && <span className="text-red-400 font-bold text-lg shrink-0">✗</span>}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`mx-6 mb-6 mt-3 text-sm px-4 py-3.5 rounded-2xl leading-relaxed flex items-start gap-3 ${
            !answered || gotItRight
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
          <span className="text-base shrink-0 mt-0.5">
            {!answered ? '💡' : gotItRight ? '✅' : '❌'}
          </span>
          <div>
            {answered && <strong className="block mb-0.5">{gotItRight ? 'Correct!' : 'Wrong!'}</strong>}
            <span>{question.explanation}</span>
          </div>
        </motion.div>
      )}
      {selected && !question.explanation && <div className="pb-4" />}
    </div>
  )
}
