import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'

const SUGGESTED = [
  'How should I study today?',
  'Generate a roadmap for Java',
  'Help me plan my exam preparation',
  'What should I revise today?',
  'Give me study tips for focus',
  'Explain the Pomodoro technique',
]

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleSend = (msg) => {
    const val = (msg || text).trim()
    if (!val) return
    onSend(val)
    setText('')
    setShowSuggestions(false)
  }

  return (
    <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-sm">

      {/* Suggested questions */}
      {showSuggestions && (
        <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider self-center">
            <Sparkles size={10} /> Try asking
          </span>
          {SUGGESTED.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-40"
              style={{
                background: 'var(--mood-accent-light, #ede9fe)',
                color: 'var(--mood-accent-text, #4c1d95)',
                borderColor: 'var(--mood-accent-light, #ede9fe)',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !disabled && handleSend()}
          onFocus={() => setShowSuggestions(false)}
          placeholder={disabled ? 'Sakhi is typing...' : 'Type a message...'}
          disabled={disabled}
          className="flex-1 px-4 py-2.5 text-sm rounded-2xl border border-gray-200 outline-none bg-gray-50 disabled:opacity-50 transition-all focus:bg-white"
          style={{ '--tw-ring-color': 'var(--mood-accent-light, #ede9fe)' }}
        />
        {!showSuggestions && (
          <button
            onClick={() => setShowSuggestions(true)}
            className="text-[10px] text-gray-400 hover:text-gray-600 px-2 transition-colors"
            title="Show suggestions"
          >
            <Sparkles size={14} />
          </button>
        )}
        <button
          onClick={() => handleSend()}
          disabled={disabled || !text.trim()}
          className="w-10 h-10 flex items-center justify-center text-white rounded-2xl shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 shrink-0"
          style={{ background: 'var(--mood-accent, #7c3aed)' }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
