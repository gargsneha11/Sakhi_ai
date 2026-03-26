import { useState, useEffect } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import GoalForm from '../components/goals/GoalForm'
import GoalCard from '../components/goals/GoalCard'
import { useAuth } from '../context/AuthContext'
import { apiGetGoals, apiSaveGoals, apiGenerateDailyPlan } from '../utils/api'

const moodColors = {
  stressed:  'bg-red-50 border-red-200 text-red-700',
  tired:     'bg-blue-50 border-blue-200 text-blue-700',
  motivated: 'bg-violet-50 border-violet-200 text-violet-700',
  confused:  'bg-orange-50 border-orange-200 text-orange-700',
  happy:     'bg-yellow-50 border-yellow-200 text-yellow-700',
  sad:       'bg-indigo-50 border-indigo-200 text-indigo-700',
  anxious:   'bg-pink-50 border-pink-200 text-pink-700',
  neutral:   'bg-gray-50 border-gray-200 text-gray-700',
}

const durationColor = {
  '20 min': 'bg-green-100 text-green-700',
  '25 min': 'bg-green-100 text-green-700',
  '30 min': 'bg-emerald-100 text-emerald-700',
  '45 min': 'bg-blue-100 text-blue-700',
  '1 hour': 'bg-violet-100 text-violet-700',
}

export default function StudyGoals() {
  const { user } = useAuth()
  const [goals, setGoals]             = useState([])
  const [showForm, setShowForm]       = useState(false)
  const [loading, setLoading]         = useState(true)
  const [plan, setPlan]               = useState(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [planError, setPlanError]     = useState('')

  const mood = (localStorage.getItem('userMood') || 'neutral').toLowerCase()

  async function generatePlan() {
    setPlanLoading(true)
    setPlanError('')
    setPlan(null)
    const data = await apiGenerateDailyPlan(user.email, mood)
    if (data.error) setPlanError(data.error)
    else setPlan(data.plan)
    setPlanLoading(false)
  }

  useEffect(() => {
    apiGetGoals(user.email).then(data => {
      if (data.goals) setGoals(data.goals)
      setLoading(false)
    })
  }, [user.email])

  function persist(updated) {
    setGoals(updated)
    apiSaveGoals(user.email, updated)
  }

  function saveGoal(goal)        { persist([goal, ...goals]); setShowForm(false) }
  function deleteGoal(id)        { persist(goals.filter(g => g.id !== id)) }
  function updateGoal(updated)   { persist(goals.map(g => g.id === updated.id ? updated : g)) }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Study Goals</h1>
          <p className="text-sm text-gray-400 mt-1">Plan your path to success</p>
        </div>
        {!showForm && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generatePlan}
              disabled={planLoading}
              className="flex items-center gap-1.5 text-sm font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl transition-all disabled:opacity-60"
            >
              <Sparkles size={15} />
              {planLoading ? 'Generating...' : "Today's Plan"}
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary shrink-0 flex items-center gap-1.5">
              <Plus size={16} /> New Goal
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      {showForm && <GoalForm onSave={saveGoal} onCancel={() => setShowForm(false)} />}

      {/* Daily Plan */}
      {planLoading && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-amber-700">Generating your personalized study plan...</span>
        </div>
      )}

      {planError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4">
          ⚠️ {planError}
        </div>
      )}

      {plan && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> Today's Study Plan
            </h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${moodColors[mood] || moodColors.neutral}`}>
              Mood: {mood}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">{item.subject}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${durationColor[item.duration] || 'bg-gray-100 text-gray-600'}`}>
                    ⏱ {item.duration}
                  </span>
                </div>
                <p className="text-sm font-medium bg-violet-50 rounded-xl px-3 py-2" style={{ color: 'var(--mood-accent,#7c3aed)' }}>
                  📖 {item.topic}
                </p>
                {item.steps?.length > 0 && (
                  <ol className="flex flex-col gap-1.5 mt-1">
                    {item.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-5 h-5 shrink-0 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center text-[10px]">{j + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
                <p className="text-xs text-gray-400 italic border-t border-gray-50 pt-2">{item.motivation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Goals grid */}
      {!loading && goals.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-3xl">🎯</div>
          <p className="text-gray-500 font-medium">No goals yet</p>
          <p className="text-sm text-gray-400 max-w-xs">Click <strong>+ New Goal</strong> to start planning your study schedule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} onUpdate={updateGoal} />
          ))}
        </div>
      )}

    </div>
  )
}
