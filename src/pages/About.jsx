import { Link } from 'react-router-dom'
import { MessageCircle, BookOpen, Smile } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: <MessageCircle size={18} className="text-violet-500" />, bg: 'bg-violet-100', title: 'AI Chatbot', desc: 'Chat with Sakhi anytime for study help, motivation, and support.' },
  { icon: <BookOpen size={18} className="text-blue-500" />, bg: 'bg-blue-100', title: 'Quiz Generator', desc: 'Generate quizzes from any topic or your own notes instantly.' },
  { icon: <Smile size={18} className="text-pink-500" />, bg: 'bg-pink-100', title: 'Mood Booster', desc: 'A 15-minute daily break timer with wellness tips to recharge your mind.' },
]

const stack = ['React 18', 'Vite', 'Tailwind CSS', 'React Router v6', 'Framer Motion', 'Lucide Icons']

export default function About() {
  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto overflow-hidden">
          <img src="/logo.png" alt="Sakhi" className="w-full h-full object-cover" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-800">About Sakhi</h1>
        <p className="mt-3 text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
          Sakhi is a student-friendly AI study companion designed to make learning
          less stressful and more enjoyable. Whether you need help understanding a topic,
          want to test yourself, or just need a motivational boost — Sakhi is here for you.
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        <p className="section-title">What Sakhi can do</p>
        {features.map(f => (
          <div key={f.title} className="card p-4 flex items-start gap-4">
            <div className={`${f.bg} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div className="flex flex-col gap-3">
        <p className="section-title">Built with</p>
        <div className="flex flex-wrap gap-2">
          {stack.map(tech => (
            <span key={tech} className="px-3 py-1.5 text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-100 rounded-lg">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Creator */}
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 border border-violet-100 rounded-2xl p-8 text-center flex flex-col gap-3">
        <span className="text-4xl">👩‍💻</span>
        <p className="text-base font-bold text-gray-800">Made with ❤️ for students</p>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
          Sakhi was built to be a calm, supportive companion for every student's learning journey.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/chatbot" className="btn-primary px-8 py-3 rounded-full text-base shadow-md shadow-violet-100">
          Start chatting with Sakhi 🌸
        </Link>
      </div>
    </motion.div>
  )
}
