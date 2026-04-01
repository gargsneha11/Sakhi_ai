import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, BookOpen, Smile, Target, Map, Heart, ArrowRight, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMoodTheme } from '../context/MoodThemeContext'
import { usePomodoro } from '../context/PomodoroContext'
import { FocusHistory } from '../components/goals/PomodoroTimer'

const features = [
  {
    to: '/chatbot',
    icon: <MessageCircle size={22} />,
    title: 'AI Chatbot',
    desc: 'Chat with Sakhi anytime — get answers, explanations, and support.',
    emoji: '🤖',
  },
  {
    to: '/quiz',
    icon: <BookOpen size={22} />,
    title: 'Quiz Generator',
    desc: 'Type any topic and get instant quiz questions to test yourself.',
    emoji: '📝',
  },
  {
    to: '/roadmap',
    icon: <Map size={22} />,
    title: 'Study Roadmap',
    desc: 'Get a structured learning path for any subject or skill.',
    emoji: '🗺️',
  },
  {
    to: '/goals',
    icon: <Target size={22} />,
    title: 'Study Goals',
    desc: 'Set goals, track topics, and generate your daily study plan.',
    emoji: '🎯',
  },
  {
    to: '/mood',
    icon: <Smile size={22} />,
    title: 'Mood Booster',
    desc: 'Take a mindful break and recharge your energy in 15 minutes.',
    emoji: '✨',
  },
  {
    to: '/wellness',
    icon: <Heart size={22} />,
    title: 'Wellness Zone',
    desc: 'Affirmations, breathing, gratitude journal and self-care checklist.',
    emoji: '💚',
  },
]

const moodMessages = {
  Happy:     { msg: "Love that energy! 😊 Keep riding that happy wave today!",       bg: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  Sad:       { msg: "It's okay to feel sad 💙 Be gentle with yourself today.",        bg: 'bg-blue-50 border-blue-200 text-blue-800'       },
  Stressed:  { msg: "Take a deep breath 🌬️ You've got this — one step at a time!",   bg: 'bg-red-50 border-red-200 text-red-800'          },
  Anxious:   { msg: "You're safe and doing okay 🤗 Focus on what you can control.",  bg: 'bg-orange-50 border-orange-200 text-orange-800' },
  Bored:     { msg: "Let's fix that boredom! 🎯 Try a quiz or chat with Sakhi.",     bg: 'bg-gray-50 border-gray-200 text-gray-800'       },
  Motivated: { msg: "You're on fire today 🔥 Let's make the most of this energy!",   bg: 'bg-violet-50 border-violet-200 text-violet-800' },
  Neutral:   { msg: "No pressure — go at your own pace today 😐 I'm here for you!", bg: 'bg-slate-50 border-slate-200 text-slate-800'    },
}

const moods = [
  { name: 'Happy',     emoji: '😊' },
  { name: 'Sad',       emoji: '😢' },
  { name: 'Stressed',  emoji: '😤' },
  { name: 'Anxious',   emoji: '😰' },
  { name: 'Bored',     emoji: '😑' },
  { name: 'Motivated', emoji: '🔥' },
  { name: 'Neutral',   emoji: '😐' },
]

const stats = [
  { value: '6+',    label: 'AI Features'      },
  { value: '100%',  label: 'Free to Use'      },
  { value: '24/7',  label: 'Always Available' },
  { value: '🌸',    label: 'Made for Students' },
]

export default function Home() {
  const { setMood } = useMoodTheme()
  const { showTimer, setShowTimer } = usePomodoro()
  const [selectedMood, setSelectedMood] = useState(() => localStorage.getItem('userMood') || null)
  const [toast, setToast]               = useState(null)
  const [showProgress, setShowProgress] = useState(false)

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.name)
    setMood(mood.name)
    setToast(mood.name)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="min-h-screen">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -24, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-xl text-sm font-medium backdrop-blur-sm ${moodMessages[toast].bg}`}>
              <span className="text-xl">{moods.find(m => m.name === toast)?.emoji}</span>
              <span>{moodMessages[toast].msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'var(--mood-accent, #7c3aed)' }} />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'var(--mood-accent, #7c3aed)' }} />

        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border mb-8 shadow-sm"
              style={{ background: 'var(--mood-accent-light, #ede9fe)', color: 'var(--mood-accent-text, #4c1d95)', borderColor: 'var(--mood-accent-light, #ede9fe)' }}>
              <Zap size={12} /> AI-Powered Study Companion
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Study smarter,<br />
              <span style={{ color: 'var(--mood-accent, #7c3aed)' }}>feel better</span> every day
            </h1>

            <p className="mt-6 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              Sakhi is your personal AI companion — quizzes, roadmaps, chatbot, wellness tools and more, all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <Link to="/chatbot"
                className="flex items-center gap-2 text-sm font-semibold text-white px-7 py-3.5 rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: 'var(--mood-accent, #7c3aed)', boxShadow: '0 8px 24px var(--mood-accent-light, #ede9fe)' }}>
                Chat with Sakhi 🌸 <ArrowRight size={15} />
              </Link>
              <Link to="/quiz"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white/80 border border-gray-200 px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                Try a Quiz 📝
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <motion.section
        className="max-w-4xl mx-auto px-6 mb-16"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              <p className="text-2xl font-extrabold" style={{ color: 'var(--mood-accent, #7c3aed)' }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Mood Selector ─────────────────────────────────── */}
      <motion.section
        className="max-w-4xl mx-auto px-6 mb-16"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">How are you feeling today?</h2>
            <p className="text-sm text-gray-400 mt-1">Your mood shapes your entire Sakhi experience ✨</p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {moods.map(mood => (
              <button
                key={mood.name}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                  selectedMood === mood.name
                    ? 'bg-white shadow-lg scale-105'
                    : 'bg-white/40 border-transparent hover:bg-white/70'
                }`}
                style={selectedMood === mood.name ? { borderColor: 'var(--mood-accent, #7c3aed)' } : {}}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[11px] font-semibold text-gray-600">{mood.name}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between flex-wrap gap-3 px-4 py-3 rounded-2xl border"
              style={{ background: 'var(--mood-accent-light, #ede9fe)', borderColor: 'var(--mood-accent-light, #ede9fe)' }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--mood-accent-text, #4c1d95)' }}>
                {moods.find(m => m.name === selectedMood)?.emoji} Mood set to <strong>{selectedMood}</strong> — theme updated!
              </p>
              <Link to="/chatbot"
                className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: 'var(--mood-accent, #7c3aed)' }}>
                Chat now <ArrowRight size={12} />
              </Link>
            </motion.div>
          )}

          {/* Focus Timer + Progress buttons */}
          <div className="mt-5 flex items-center justify-center gap-3">
            {!showTimer ? (
              <button
                onClick={() => setShowTimer(true)}
                className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-2xl shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all"
                style={{ background: 'var(--mood-accent, #7c3aed)' }}
              >
                ⏱ Pomodoro
              </button>
            ) : (
              <span className="text-xs font-medium px-4 py-2 rounded-2xl border"
                style={{ background: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)', borderColor: 'var(--mood-accent-light,#ede9fe)' }}>
                ⏱ Timer running in navbar
              </span>
            )}
            <button
              onClick={() => setShowProgress(p => !p)}
              className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-2xl border hover:-translate-y-0.5 transition-all"
              style={showProgress
                ? { background: 'var(--mood-accent,#7c3aed)', color: 'white', borderColor: 'var(--mood-accent,#7c3aed)' }
                : { background: 'white', color: 'var(--mood-accent,#7c3aed)', borderColor: 'var(--mood-accent-light,#ede9fe)' }
              }
            >
              📊 {showProgress ? 'Hide Progress' : 'My Progress'}
            </button>
          </div>
          {/* Inline progress panel */}
          <AnimatePresence>
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-4"
              >
                <FocusHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ── Features Grid ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">Everything you need to succeed</h2>
          <p className="text-sm text-gray-400 mt-2">Six powerful tools, one beautiful app</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={f.to}
                className="group flex flex-col gap-4 bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'var(--mood-accent, #7c3aed)' }}>
                    {f.icon}
                  </div>
                  <span className="text-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{f.emoji}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{f.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold mt-auto transition-all"
                  style={{ color: 'var(--mood-accent, #7c3aed)' }}>
                  Open <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  )
}
