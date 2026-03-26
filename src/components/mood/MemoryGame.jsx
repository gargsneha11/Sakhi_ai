import { useState, useEffect } from 'react'

const EMOJIS = ['🌸', '🎯', '🦋', '🌈', '⭐', '🎵', '🍀', '🔥']

function createDeck() {
  return [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
}

export default function MemoryGame() {
  const [cards, setCards] = useState(createDeck)
  const [selected, setSelected] = useState([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)

  useEffect(() => {
    if (!running || won) return
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [running, won])

  useEffect(() => {
    if (selected.length !== 2) return
    const [a, b] = selected
    if (cards[a].emoji === cards[b].emoji) {
      setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c))
    } else {
      setTimeout(() => {
        setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c))
      }, 800)
    }
    setMoves(m => m + 1)
    setSelected([])
  }, [selected])

  useEffect(() => {
    if (cards.every(c => c.matched)) { setWon(true); setRunning(false) }
  }, [cards])

  function flip(i) {
    if (selected.length === 2 || cards[i].flipped || cards[i].matched) return
    if (!running) setRunning(true)
    setCards(prev => prev.map((c, idx) => idx === i ? { ...c, flipped: true } : c))
    setSelected(prev => [...prev, i])
  }

  function restart() {
    setCards(createDeck())
    setSelected([])
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setWon(false)
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Stats */}
      <div className="flex gap-6 text-sm font-medium text-gray-600">
        <span>🕐 {fmt(seconds)}</span>
        <span>🔄 {moves} moves</span>
        <span>✅ {cards.filter(c => c.matched).length / 2}/{EMOJIS.length} pairs</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => flip(i)}
            className={`w-16 h-16 rounded-2xl text-2xl flex items-center justify-center transition-all duration-300 shadow-sm
              ${card.flipped || card.matched
                ? 'bg-violet-100 scale-105'
                : 'bg-gray-100 hover:bg-gray-200'
              }
              ${card.matched ? 'opacity-60 cursor-default' : 'cursor-pointer'}
            `}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </button>
        ))}
      </div>

      {won && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-6 py-3 rounded-2xl text-center">
          🎉 You won in {moves} moves and {fmt(seconds)}!
        </div>
      )}

      <button onClick={restart} className="btn-outline text-sm">
        🔁 Play Again
      </button>
    </div>
  )
}
