import { useState } from 'react'
import QuizForm from '../components/quiz/QuizForm'
import QuizQuestion from '../components/quiz/QuizQuestion'
import QuizResult from '../components/quiz/QuizResult'
import { apiGenerateQuiz } from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [stage,     setStage]     = useState('form')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleStart = async (input, count) => {
    setError(''); setLoading(true); setStage('loading')
    try {
      const data = await apiGenerateQuiz(input, count)
      if (data.error) { setError(data.error); setStage('form'); return }
      setQuestions(data.questions); setAnswers({}); setCurrent(0); setStage('quiz')
    } catch {
      setError('Could not connect to server. Make sure Flask is running.')
      setStage('form')
    } finally { setLoading(false) }
  }

  const handleAnswer = (option) =>
    setAnswers(prev => ({ ...prev, [questions[current].id]: option }))

  const handleNext = () => {
    if (current + 1 < questions.length) setCurrent(p => p + 1)
    else setStage('result')
  }

  const score = questions.filter(q => answers[q.id] === q.answer).length

  return (
    <div className="min-h-screen">

      {/* Hero header */}
      <div className="relative overflow-hidden py-12 mb-2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--mood-accent,#7c3aed)' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--mood-accent,#7c3aed)' }} />
        </div>
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg"
            style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>📝</div>
          <h1 className="text-3xl font-extrabold text-gray-900">Quiz Generator</h1>
          <p className="text-gray-400 mt-2 text-sm">Type a topic or upload a file — AI builds your quiz instantly</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">

          {stage === 'form' && (
            <motion.div key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <QuizForm onStart={handleStart} loading={loading} />
              {error && (
                <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl text-center">
                  ⚠️ {error}
                </p>
              )}
            </motion.div>
          )}

          {stage === 'loading' && (
            <motion.div key="loading"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-16 flex flex-col items-center gap-5 shadow-sm">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--mood-accent-light,#ede9fe)', borderTopColor: 'var(--mood-accent,#7c3aed)' }} />
                <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-800">Generating your quiz...</p>
                <p className="text-xs text-gray-400 mt-1">AI is crafting questions just for you</p>
              </div>
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'var(--mood-accent,#7c3aed)', animationDelay: `${i*150}ms` }} />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'quiz' && questions[current] && (
            <motion.div key={`quiz-${current}`}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-4">
              {/* Progress bar */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm">
                <span className="text-xs font-semibold text-gray-500">Q {current+1}/{questions.length}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'var(--mood-accent,#7c3aed)' }}
                    initial={{ width: `${(current/questions.length)*100}%` }}
                    animate={{ width: `${((current+1)/questions.length)*100}%` }}
                    transition={{ duration: 0.4 }} />
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--mood-accent,#7c3aed)' }}>
                  {Math.round(((current+1)/questions.length)*100)}%
                </span>
              </div>

              <QuizQuestion
                question={questions[current]} index={current} total={questions.length}
                onAnswer={handleAnswer} selected={answers[questions[current].id] || null}
              />

              {answers[questions[current].id] && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end">
                  <button onClick={handleNext}
                    className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all"
                    style={{ background: 'var(--mood-accent,#7c3aed)' }}>
                    {current + 1 < questions.length ? 'Next Question →' : 'See Results 🎉'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {stage === 'result' && (
            <motion.div key="result"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <QuizResult score={score} total={questions.length}
                onRetry={() => { setAnswers({}); setCurrent(0); setStage('quiz') }}
                onNew={() => setStage('form')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
