import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AFFIRMATIONS = [
  "I am capable of achieving great things. 🌟",
  "I choose peace over worry. 🕊️",
  "Every day I grow stronger and wiser. 🌱",
  "I am enough, exactly as I am. 💜",
  "Challenges help me grow. I embrace them. 💪",
  "I deserve rest, joy, and kindness. 🌸",
  "My mind is calm and my focus is clear. 🧘",
  "I am proud of how far I've come. 🎯",
  "Good things are coming my way. ✨",
  "I trust myself to handle whatever comes. 🦋",
]

export default function Affirmations() {
  const { user } = useAuth()
  const key = `sakhi-affirmations-${user?.email}`

  const [index, setIndex] = useState(0)
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || [] }
    catch { return [] }
  })

  function next() {
    setIndex(i => (i + 1) % AFFIRMATIONS.length)
  }

  function save() {
    const text = AFFIRMATIONS[index]
    if (saved.includes(text)) return
    const updated = [text, ...saved]
    setSaved(updated)
    localStorage.setItem(key, JSON.stringify(updated))
  }

  function remove(i) {
    const updated = saved.filter((_, idx) => idx !== i)
    setSaved(updated)
    localStorage.setItem(key, JSON.stringify(updated))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-6 text-center flex flex-col gap-3 border border-violet-100">
        <p className="text-base font-medium text-gray-700 leading-relaxed">
          {AFFIRMATIONS[index]}
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={next} className="btn-primary text-xs px-4 py-2">Next ✨</button>
          <button onClick={save} className="btn-outline text-xs px-4 py-2">Save 💜</button>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Saved</p>
          {saved.map((a, i) => (
            <div key={i} className="flex items-center justify-between text-xs text-gray-600 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
              <span>{a}</span>
              <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 transition-colors ml-2 shrink-0">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
