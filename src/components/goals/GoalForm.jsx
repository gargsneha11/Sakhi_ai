import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const EMPTY = { subject: '', examName: '', examDate: '', dailyHours: '', topics: [] }

export default function GoalForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [topicInput, setTopicInput] = useState('')
  const [error, setError] = useState('')

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function addTopic() {
    const t = topicInput.trim()
    if (!t) return
    if (!form.topics.includes(t)) set('topics', [...form.topics, t])
    setTopicInput('')
  }

  function removeTopic(i) {
    set('topics', form.topics.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.subject.trim()) { setError('Subject is required.'); return }
    onSave({
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-800">📋 New Study Goal</h2>

      {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Subject <span className="text-red-400">*</span></label>
          <input className="input text-sm" placeholder="e.g. Mathematics" value={form.subject}
            onChange={e => { set('subject', e.target.value); setError('') }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Exam Name</label>
          <input className="input text-sm" placeholder="e.g. Final Exam" value={form.examName}
            onChange={e => set('examName', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Exam Date</label>
          <input className="input text-sm" type="date" value={form.examDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={e => set('examDate', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Daily Study Hours</label>
          <input className="input text-sm" type="number" min="0.5" max="12" step="0.5"
            placeholder="e.g. 2" value={form.dailyHours}
            onChange={e => set('dailyHours', e.target.value)} />
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-500">Topics to Cover</label>
        <div className="flex gap-2">
          <input
            className="input text-sm flex-1"
            placeholder="Add a topic and press Enter"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTopic() } }}
          />
          <button type="button" onClick={addTopic} className="btn-outline px-3">
            <Plus size={15} />
          </button>
        </div>
        {form.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {form.topics.map((t, i) => (
              <span key={i} className="flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1 rounded-full border border-violet-100">
                {t}
                <button type="button" onClick={() => removeTopic(i)} className="hover:text-red-400 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button type="button" onClick={onCancel} className="btn-ghost text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">Create Goal</button>
      </div>
    </form>
  )
}
