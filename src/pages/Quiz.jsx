import { useState, useEffect, useRef } from 'react'
import QuizForm from '../components/quiz/QuizForm'
import QuizQuestion from '../components/quiz/QuizQuestion'
import QuizResult from '../components/quiz/QuizResult'
import { apiGenerateQuiz } from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Brain, Zap } from 'lucide-react'

// ── Mood config ───────────────────────────────────────────────────────────────
const MOOD_CONFIG = {
  stressed:  { emoji: '😤', label: 'Stressed',  count: 5,  difficulty: 'easy',   message: '💙 Take a breath! Short & easy quiz — you got this!',              encourageCorrect: null,                        timer: false },
  tired:     { emoji: '😴', label: 'Tired',     count: 3,  difficulty: 'easy',   message: '😴 Feeling tired? Just 3 easy questions — nice and gentle!',        encourageCorrect: null,                        timer: false },
  motivated: { emoji: '🔥', label: 'Motivated', count: 10, difficulty: 'hard',   message: '🔥 You\'re on fire! Full quiz with a timer — let\'s go!',           encourageCorrect: null,                        timer: true, timerSeconds: 30 },
  confused:  { emoji: '😕', label: 'Confused',  count: 5,  difficulty: 'easy',   message: '🤔 Confused? Each answer comes with a full explanation!',           encourageCorrect: null,                        timer: false },
  happy:     { emoji: '😊', label: 'Happy',     count: 7,  difficulty: 'medium', message: '😊 Great mood! Fun mixed quiz coming your way!',                    encourageCorrect: '🎉 Awesome! Keep it up!',   timer: false },
  sad:       { emoji: '😢', label: 'Sad',       count: 5,  difficulty: 'easy',   message: '💜 A short easy quiz to keep your mind gently active.',             encourageCorrect: '✨ Well done! You\'re great!', timer: false },
  anxious:   { emoji: '😰', label: 'Anxious',   count: 3,  difficulty: 'easy',   message: '🤗 Just 3 simple questions — no pressure at all!',                  encourageCorrect: null,                        timer: false },
  neutral:   { emoji: '😐', label: 'Neutral',   count: 5,  difficulty: 'medium', message: '📝 Steady and consistent — let\'s do a balanced quiz!',             encourageCorrect: null,                        timer: false },
}

const DIFFICULTY_PREFIX = {
  easy:   'easy beginner level',
  medium: 'medium intermediate level',
  hard:   'hard advanced level',
}

function pad(n) { return String(n).padStart(2, '0') }

// ── Smart Recovery Screen ─────────────────────────────────────────────────────
function RecoveryScreen({ topic, onDone, recoveryQuestions, recoveryLoading }) {
  const [step,    setStep]    = useState('explain')  // 'explain' | 'questions'
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  if (step === 'explain') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-lg">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
            <Brain size={20} />
          </div>
          <div className="text-white">
            <p className="font-extrabold text-base">Smart Recovery Mode</p>
            <p className="text-xs opacity-80">3 wrong answers detected — let's fix that!</p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <span className="text-xl shrink-0">💡</span>
            <div>
              <p className="text-xs font-bold text-amber-700 mb-1">Why Recovery Mode?</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Our system detected you answered 3 questions wrong in a row on <strong>"{topic}"</strong>.
                Instead of continuing, we're giving you a 2-minute concept review + 2 easy questions to rebuild your confidence.
              </p>
            </div>
          </div>

          {/* Concept tips */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Zap size={15} style={{ color: 'var(--mood-accent,#7c3aed)' }} /> Quick Concept Tips
            </p>
            {[
              '📖 Re-read the question carefully before answering',
              '🔍 Eliminate obviously wrong options first',
              '🧠 Think about what you already know about this topic',
              '✏️ Break complex questions into smaller parts',
              '💪 Mistakes are how we learn — you\'re doing great!',
            ].map((tip, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5">
                {tip}
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setStep('questions')}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all"
            style={{ background: 'var(--mood-accent,#7c3aed)' }}>
            I'm ready — give me easy questions! 💪
          </button>
        </div>
      </motion.div>
    )
  }

  // Recovery questions step
  if (recoveryLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-12 flex flex-col items-center gap-4 shadow-sm">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--mood-accent-light,#ede9fe)', borderTopColor: 'var(--mood-accent,#7c3aed)' }} />
        <p className="text-sm font-bold text-gray-700">Generating 2 easy recovery questions...</p>
      </div>
    )
  }

  if (!recoveryQuestions?.length) return null

  const q = recoveryQuestions[current]
  const selected = answers[q.id] || null

  return (
    <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-4">

      {/* Recovery header */}
      <div className="flex items-center justify-between px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
        <span className="text-sm font-bold text-amber-700 flex items-center gap-2">
          <Brain size={15} /> Recovery Question {current + 1} of {recoveryQuestions.length}
        </span>
        <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">Easy Level</span>
      </div>

      <QuizQuestion
        question={q} index={current} total={recoveryQuestions.length}
        onAnswer={opt => setAnswers(p => ({ ...p, [q.id]: opt }))}
        selected={selected}
        showExplanationAlways={false}
      />

      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex justify-end">
          <button
            onClick={() => {
              if (current + 1 < recoveryQuestions.length) setCurrent(p => p + 1)
              else onDone()
            }}
            className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all"
            style={{ background: 'var(--mood-accent,#7c3aed)' }}>
            {current + 1 < recoveryQuestions.length ? 'Next Recovery Question →' : 'Back to Quiz 🚀'}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Main Quiz component ───────────────────────────────────────────────────────
export default function Quiz() {
  const [questions,         setQuestions]         = useState([])
  const [current,           setCurrent]           = useState(0)
  const [answers,           setAnswers]           = useState({})
  const [stage,             setStage]             = useState('form')  // form | loading | quiz | recovery | result
  const [loading,           setLoading]           = useState(false)
  const [error,             setError]             = useState('')
  const [showEncourage,     setShowEncourage]     = useState(false)
  const [currentTopic,      setCurrentTopic]      = useState('')
  const [recoveryQuestions, setRecoveryQuestions] = useState([])
  const [recoveryLoading,   setRecoveryLoading]   = useState(false)

  // Timer (motivated mood)
  const [timeLeft,    setTimeLeft]    = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef   = useRef(null)
  const wrongStreak = useRef(0)

  const mood       = (localStorage.getItem('userMood') || 'neutral').toLowerCase()
  const moodConfig = MOOD_CONFIG[mood] || MOOD_CONFIG.neutral

  // Timer logic
  useEffect(() => {
    if (!timerActive) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setTimerActive(false); handleNext(); return moodConfig.timerSeconds || 30 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerActive, current])

  function startTimer() { setTimeLeft(moodConfig.timerSeconds || 30); setTimerActive(true) }
  function stopTimer()  { setTimerActive(false); clearInterval(timerRef.current) }

  // Start quiz
  const handleStart = async (input, count) => {
    setError(''); setLoading(true); setStage('loading')
    setCurrentTopic(input)
    const adaptiveTopic = `${DIFFICULTY_PREFIX[moodConfig.difficulty]} questions about: ${input}`
    try {
      const data = await apiGenerateQuiz(adaptiveTopic, moodConfig.count)
      if (data.error) { setError(data.error); setStage('form'); return }
      setQuestions(data.questions); setAnswers({}); setCurrent(0)
      wrongStreak.current = 0; setStage('quiz')
      if (moodConfig.timer) startTimer()
    } catch {
      setError('Could not connect to server. Make sure Flask is running.')
      setStage('form')
    } finally { setLoading(false) }
  }

  // Trigger Smart Recovery Mode
  const triggerRecovery = async () => {
    stopTimer()
    setRecoveryQuestions([])
    setRecoveryLoading(true)
    setStage('recovery')
    try {
      const data = await apiGenerateQuiz(`easy beginner level questions about: ${currentTopic}`, 2)
      setRecoveryQuestions(data.questions || [])
    } catch {
      setRecoveryQuestions([])
    } finally { setRecoveryLoading(false) }
  }

  // Answer handler
  const handleAnswer = (option) => {
    stopTimer()
    // Prevent answering twice
    if (answers[questions[current].id]) return
    setAnswers(prev => ({ ...prev, [questions[current].id]: option }))
    const isCorrect = option?.trim().toLowerCase() === questions[current].answer?.trim().toLowerCase()
    if (!isCorrect) {
      wrongStreak.current += 1
      if (wrongStreak.current >= 3) {
        wrongStreak.current = 0
        // Wait 1.2s so user sees the wrong answer highlighted, then trigger recovery
        setTimeout(() => {
          setStage(prev => {
            // Only trigger if still in quiz stage
            if (prev === 'quiz') { triggerRecovery(); return 'quiz' }
            return prev
          })
        }, 1200)
      }
    } else {
      // Correct answer — reset streak
      wrongStreak.current = 0
      if (moodConfig.encourageCorrect) {
        setShowEncourage(true)
        setTimeout(() => setShowEncourage(false), 2000)
      }
    }
  }

  // Next question
  const handleNext = () => {
    stopTimer()
    if (current + 1 < questions.length) { setCurrent(p => p + 1); if (moodConfig.timer) startTimer() }
    else setStage('result')
  }

  // After recovery done — resume quiz
  const handleRecoveryDone = () => {
    setStage('quiz')
    if (current + 1 < questions.length) setCurrent(p => p + 1)
    else setStage('result')
  }

  const score = questions.filter(q => q.answer?.trim().toLowerCase() === answers[q.id]?.trim().toLowerCase()).length

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <div className="relative overflow-hidden py-12 mb-2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--mood-accent,#7c3aed)' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--mood-accent,#7c3aed)' }} />
        </div>
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg"
            style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>📝</div>
          <h1 className="text-3xl font-extrabold text-gray-900">Quiz Generator</h1>
          <p className="text-gray-400 mt-2 text-sm">Type a topic or upload a file — AI builds your quiz instantly</p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{ background: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)', borderColor: 'var(--mood-accent-light,#ede9fe)' }}>
              {moodConfig.emoji} Mood: {moodConfig.label}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              ✨ Adaptive Mode ON
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              🧠 Smart Recovery ON
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">

          {/* Form */}
          {stage === 'form' && (
            <motion.div key="form" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              className="flex flex-col gap-4">
              <div className="px-5 py-4 rounded-2xl border text-sm font-medium flex items-start gap-3"
                style={{ background: 'var(--mood-accent-light,#ede9fe)', borderColor: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)' }}>
                <span className="text-xl shrink-0">{moodConfig.emoji}</span>
                <div>
                  <p className="font-bold mb-0.5">Adaptive Quiz Mode</p>
                  <p className="text-xs opacity-80">{moodConfig.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    📊 {moodConfig.count} questions · {moodConfig.difficulty} difficulty
                    {moodConfig.timer ? ` · ⏱ ${moodConfig.timerSeconds}s per question` : ''}
                    {' · 🧠 Smart Recovery enabled'}
                  </p>
                </div>
              </div>
              <QuizForm onStart={handleStart} loading={loading} moodConfig={moodConfig} />
              {error && <p className="mt-2 text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl text-center">⚠️ {error}</p>}
            </motion.div>
          )}

          {/* Loading */}
          {stage === 'loading' && (
            <motion.div key="loading" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-16 flex flex-col items-center gap-5 shadow-sm">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--mood-accent-light,#ede9fe)', borderTopColor: 'var(--mood-accent,#7c3aed)' }} />
                <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-800">Generating your quiz...</p>
                <p className="text-xs text-gray-400 mt-1">AI is crafting {moodConfig.count} {moodConfig.difficulty} questions for you</p>
              </div>
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'var(--mood-accent,#7c3aed)', animationDelay: `${i*150}ms` }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Quiz */}
          {stage === 'quiz' && questions[current] && (
            <motion.div key={`quiz-${current}`} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
              className="flex flex-col gap-4">

              {/* Progress bar */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm">
                <span className="text-xs font-semibold text-gray-500">Q {current+1}/{questions.length}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: 'var(--mood-accent,#7c3aed)' }}
                    initial={{ width: `${(current/questions.length)*100}%` }}
                    animate={{ width: `${((current+1)/questions.length)*100}%` }}
                    transition={{ duration: 0.4 }} />
                </div>
                {moodConfig.timer && (
                  <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    <Timer size={11} /> {pad(Math.floor(timeLeft/60))}:{pad(timeLeft%60)}
                  </div>
                )}
                <span className="text-xs font-bold" style={{ color: 'var(--mood-accent,#7c3aed)' }}>
                  {Math.round(((current+1)/questions.length)*100)}%
                </span>
              </div>

              {/* Encouragement */}
              <AnimatePresence>
                {showEncourage && (
                  <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                    className="px-4 py-3 rounded-2xl text-sm font-bold text-center"
                    style={{ background: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)' }}>
                    {moodConfig.encourageCorrect}
                  </motion.div>
                )}
              </AnimatePresence>

              <QuizQuestion
                question={questions[current]} index={current} total={questions.length}
                onAnswer={handleAnswer} selected={answers[questions[current].id] || null}
                showExplanationAlways={mood === 'confused'}
              />

              {answers[questions[current].id] && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="flex justify-end">
                  <button onClick={handleNext}
                    className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all"
                    style={{ background: 'var(--mood-accent,#7c3aed)' }}>
                    {current + 1 < questions.length ? 'Next Question →' : 'See Results 🎉'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Smart Recovery */}
          {stage === 'recovery' && (
            <motion.div key="recovery" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}>
              <RecoveryScreen
                topic={currentTopic}
                onDone={handleRecoveryDone}
                recoveryQuestions={recoveryQuestions}
                recoveryLoading={recoveryLoading}
              />
            </motion.div>
          )}

          {/* Result */}
          {stage === 'result' && (
            <motion.div key="result" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
              <QuizResult score={score} total={questions.length}
                onRetry={() => { setAnswers({}); setCurrent(0); setStage('quiz'); if (moodConfig.timer) startTimer() }}
                onNew={() => setStage('form')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
