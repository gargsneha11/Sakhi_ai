import { useState } from 'react'
import { Trash2, Plus, X } from 'lucide-react'
import ProgressBar from './ProgressBar'

function getDaysInfo(createdAt, examDate) {
  const now = new Date()
  const start = new Date(createdAt)
  const end = examDate ? new Date(examDate) : null

  if (!end) return { daysLeft: null, pct: 0, label: 'No exam date set' }

  const totalDays = Math.max(1, Math.round((end - start) / 86400000))
  const elapsed   = Math.max(0, Math.round((now  - start) / 86400000))
  const daysLeft  = Math.max(0, Math.round((end  - now)   / 86400000))
  const pct       = Math.min(100, Math.round((elapsed / totalDays) * 100))

  return { daysLeft, pct, totalDays }
}

const URGENCY = (days) => {
  if (days === null) return { bg: 'bg-gray-50',    border: 'border-gray-100',   badge: 'bg-gray-100 text-gray-500',    bar: 'from-gray-300 to-gray-400' }
  if (days <= 3)     return { bg: 'bg-red-50',     border: 'border-red-100',    badge: 'bg-red-100 text-red-600',      bar: 'from-red-400 to-orange-400' }
  if (days <= 7)     return { bg: 'bg-amber-50',   border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-600',  bar: 'from-amber-400 to-yellow-400' }
  return               { bg: 'bg-white',           border: 'border-gray-100',   badge: 'bg-violet-100 text-violet-600', bar: 'from-violet-400 to-pink-400' }
}

export default function GoalCard({ goal, onDelete, onUpdate }) {
  const { daysLeft, totalDays } = getDaysInfo(goal.createdAt, goal.examDate)
  const style = URGENCY(daysLeft)

  const completed   = goal.completedTopics || []
  const total       = goal.topics?.length || 0
  const pct         = total > 0 ? Math.round((completed.length / total) * 100) : 0

  const [addingTopic, setAddingTopic] = useState(false)
  const [topicInput, setTopicInput]   = useState('')

  function toggleTopic(topic) {
    const already = completed.includes(topic)
    const updated = already ? completed.filter(t => t !== topic) : [...completed, topic]
    onUpdate({ ...goal, completedTopics: updated })
  }

  function addTopic() {
    const t = topicInput.trim()
    if (!t) return
    const topics = [...(goal.topics || [])]
    if (!topics.includes(t)) onUpdate({ ...goal, topics: [...topics, t] })
    setTopicInput('')
  }

  function removeTopic(topic) {
    onUpdate({
      ...goal,
      topics: goal.topics.filter(t => t !== topic),
      completedTopics: completed.filter(t => t !== topic),
    })
  }

  return (
    <div className={`${style.bg} border ${style.border} rounded-3xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-gray-800">{goal.subject}</h3>
          {goal.examName && <p className="text-xs text-gray-400 mt-0.5">{goal.examName}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {daysLeft !== null && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
              {daysLeft === 0 ? '🎯 Today!' : `${daysLeft}d left`}
            </span>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Topics Progress</span>
            <span className="font-medium text-gray-600">{completed.length}/{total} completed</span>
          </div>
          <ProgressBar pct={pct} color={style.bar} />
        </div>
      )}

      {/* Days info (kept as meta) */}
      {goal.examDate && totalDays && (
        <p className="text-xs text-gray-400">📆 {totalDays} days total until exam</p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {goal.dailyHours && (
          <span className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
            ⏱ {goal.dailyHours}h / day
          </span>
        )}
        {goal.examDate && (
          <span className="flex items-center gap-1 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
            📅 {new Date(goal.examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Topics with checkboxes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-400">Topics {total > 0 && `(${completed.length}/${total})`}</p>
          <button
            onClick={() => setAddingTopic(a => !a)}
            className="text-xs text-violet-500 hover:text-violet-700 flex items-center gap-1 transition-colors"
          >
            <Plus size={12} /> Add topic
          </button>
        </div>

        {/* Inline add topic input */}
        {addingTopic && (
          <div className="flex gap-2">
            <input
              autoFocus
              className="input text-sm flex-1 py-1.5"
              placeholder="Topic name..."
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); addTopic() }
                if (e.key === 'Escape') setAddingTopic(false)
              }}
            />
            <button onClick={addTopic} className="btn-primary px-3 py-1.5 text-xs">Add</button>
            <button onClick={() => { setAddingTopic(false); setTopicInput('') }} className="btn-ghost px-2 py-1.5 text-xs"><X size={13} /></button>
          </div>
        )}

        {total === 0 && !addingTopic && (
          <p className="text-xs text-gray-300 italic">No topics yet — click "Add topic" above</p>
        )}

        {goal.topics?.map((t, i) => {
          const done = completed.includes(t)
          return (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-200
              ${done ? 'bg-violet-50 border-violet-100' : 'bg-white border-gray-100 hover:border-violet-200 hover:bg-violet-50/40'}`}
            >
              <button onClick={() => toggleTopic(t)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${done ? 'bg-violet-500 border-violet-500 text-white' : 'border-gray-300 hover:border-violet-400'}`}>
                {done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <span onClick={() => toggleTopic(t)} className={`text-sm flex-1 cursor-pointer ${done ? 'line-through text-violet-400 opacity-60' : 'text-gray-600'}`}>{t}</span>
              <button onClick={() => removeTopic(t)} className="text-gray-200 hover:text-red-400 transition-colors shrink-0"><X size={12} /></button>
            </div>
          )
        })}

        {pct === 100 && total > 0 && (
          <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 rounded-xl px-3 py-2 text-center">
            🎉 All topics completed!
          </p>
        )}
      </div>
    </div>
  )
}
