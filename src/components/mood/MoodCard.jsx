import { useState } from 'react'

const tips = [
  { emoji: '🧘', title: 'Breathe Deeply', desc: 'Take 5 slow deep breaths. Inhale for 4 counts, hold for 4, exhale for 4.' },
  { emoji: '🚶', title: 'Stretch & Move', desc: 'Stand up, stretch your arms and neck. A short walk refreshes your mind.' },
  { emoji: '💧', title: 'Drink Water', desc: 'Hydration improves focus. Drink a full glass of water right now.' },
  { emoji: '🎵', title: 'Listen to Music', desc: 'Play a calming or uplifting song. Let your mind rest for a moment.' },
  { emoji: '📓', title: 'Write It Down', desc: 'Jot down one thing you are grateful for today. It shifts your mindset.' },
  { emoji: '😊', title: 'Smile!', desc: 'Smiling — even briefly — signals your brain to feel better. Try it!' },
]

export default function MoodCard() {
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)])

  return (
    <div className="card p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
      <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center text-xl shrink-0">
        {tip.emoji}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{tip.title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.desc}</p>
      </div>
    </div>
  )
}
