import { useState, useEffect } from 'react'

const TODAY = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
const STORAGE_KEY = 'sakhi-selfcare'

const ITEMS = [
  { emoji: '💧', label: 'Drink a glass of water' },
  { emoji: '🚶', label: 'Take a 5-minute walk' },
  { emoji: '🧘', label: 'Take 3 deep breaths' },
  { emoji: '🍎', label: 'Eat something healthy' },
  { emoji: '📵', label: 'Put your phone down for 10 min' },
  { emoji: '😴', label: 'Rest your eyes for 2 minutes' },
  { emoji: '📓', label: 'Write one thing you\'re grateful for' },
  { emoji: '🤗', label: 'Give yourself a compliment' },
]

export default function SelfCareChecklist() {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      return saved?.date === TODAY ? saved.checked : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: TODAY, checked }))
  }, [checked])

  function toggle(i) {
    setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const done = checked.length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">{done}/{ITEMS.length} completed</p>
        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${(done / ITEMS.length) * 100}%` }}
          />
        </div>
      </div>

      {ITEMS.map((item, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all duration-200
            ${checked.includes(i)
              ? 'bg-violet-50 border-violet-200 text-violet-700'
              : 'bg-white border-gray-100 text-gray-600 hover:border-violet-200 hover:bg-violet-50/40'
            }`}
        >
          <span className="text-lg">{item.emoji}</span>
          <span className={`text-sm font-medium flex-1 ${checked.includes(i) ? 'line-through opacity-60' : ''}`}>
            {item.label}
          </span>
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all
            ${checked.includes(i) ? 'bg-violet-500 border-violet-500 text-white' : 'border-gray-300'}`}>
            {checked.includes(i) ? '✓' : ''}
          </span>
        </button>
      ))}

      {done === ITEMS.length && (
        <p className="text-center text-sm text-emerald-600 font-semibold bg-emerald-50 rounded-2xl py-3">
          🎉 Amazing! You took great care of yourself today!
        </p>
      )}
    </div>
  )
}
