import { useState } from 'react'

const COLORS = ['#c4b5fd','#fbcfe8','#bfdbfe','#a7f3d0','#fde68a','#fed7aa','#e9d5ff','#99f6e4']
const SIZE = 6

function makeGrid() {
  return Array.from({ length: SIZE * SIZE }, () => '#f1f5f9')
}

export default function ColorTherapy() {
  const [grid, setGrid] = useState(makeGrid)
  const [active, setActive] = useState(COLORS[0])

  function paint(i) {
    setGrid(prev => prev.map((c, idx) => idx === i ? active : c))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 flex-wrap justify-center">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`w-7 h-7 rounded-full transition-transform ${active === c ? 'scale-125 ring-2 ring-offset-2 ring-violet-400' : 'hover:scale-110'}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {grid.map((color, i) => (
          <button
            key={i}
            onClick={() => paint(i)}
            className="w-9 h-9 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
            style={{ background: color }}
          />
        ))}
      </div>
      <button
        onClick={() => setGrid(makeGrid())}
        className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
      >
        Clear canvas
      </button>
    </div>
  )
}
