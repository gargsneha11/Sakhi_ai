import { useState, useEffect } from 'react'

const WORDS = [
  { word: 'FOCUS',   hint: 'Concentrate your attention' },
  { word: 'CALM',    hint: 'Peaceful and relaxed state' },
  { word: 'SMILE',   hint: 'A happy facial expression' },
  { word: 'BREATH',  hint: 'What you do to relax' },
  { word: 'ENERGY',  hint: 'Vitality and strength' },
  { word: 'HAPPY',   hint: 'Feeling of joy' },
  { word: 'RELAX',   hint: 'Let go of tension' },
  { word: 'MINDFUL', hint: 'Being aware of the present' },
  { word: 'PEACE',   hint: 'Quiet and tranquil' },
  { word: 'GROWTH',  hint: 'Getting better over time' },
]

function scramble(word) {
  let s
  do { s = word.split('').sort(() => Math.random() - 0.5).join('') }
  while (s === word)
  return s
}

function getWord() {
  const w = WORDS[Math.floor(Math.random() * WORDS.length)]
  return { ...w, scrambled: scramble(w.word) }
}

export default function WordGame() {
  const [current, setCurrent] = useState(getWord)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [seconds, setSeconds] = useState(30)
  const [status, setStatus] = useState(null) // 'correct' | 'wrong' | 'timeout'
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active || seconds === 0) return
    const t = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(t); setStatus('timeout'); setActive(false); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(t)
  }, [active, seconds])

  function handleSubmit(e) {
    e.preventDefault()
    if (!active) { setActive(true) }
    if (input.trim().toUpperCase() === current.word) {
      setScore(s => s + 1)
      setStatus('correct')
      setTimeout(next, 800)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 600)
    }
    setInput('')
  }

  function next() {
    setCurrent(getWord())
    setInput('')
    setSeconds(30)
    setStatus(null)
    setActive(false)
  }

  const timerColor = seconds <= 10 ? 'text-red-500' : seconds <= 20 ? 'text-amber-500' : 'text-emerald-600'

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* Stats */}
      <div className="flex gap-6 text-sm font-medium text-gray-600">
        <span>⭐ Score: {score}</span>
        <span className={`font-bold ${timerColor}`}>⏱ {seconds}s</span>
      </div>

      {/* Card */}
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center gap-4 shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Unscramble the word</p>

        <div className="flex gap-2">
          {current.scrambled.split('').map((ch, i) => (
            <span key={i} className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg font-bold text-violet-700 border border-violet-100">
              {ch}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-500 italic">💡 {current.hint}</p>

        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <input
            className={`input flex-1 text-center uppercase tracking-widest font-semibold transition-colors
              ${status === 'correct' ? 'border-emerald-400 bg-emerald-50' : ''}
              ${status === 'wrong'   ? 'border-red-400 bg-red-50' : ''}
            `}
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            placeholder="Your answer..."
            maxLength={current.word.length + 2}
            disabled={status === 'timeout'}
          />
          <button type="submit" className="btn-primary px-4" disabled={status === 'timeout'}>
            ✓
          </button>
        </form>

        {status === 'correct' && <p className="text-emerald-600 font-semibold text-sm">✅ Correct!</p>}
        {status === 'timeout' && (
          <p className="text-red-500 font-semibold text-sm">⏰ Time's up! Answer: <span className="underline">{current.word}</span></p>
        )}
      </div>

      <button onClick={next} className="btn-outline text-sm">
        ⏭ Next Word
      </button>
    </div>
  )
}
