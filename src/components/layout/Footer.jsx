import { NavLink } from 'react-router-dom'
import { MessageCircle, BookOpen, Smile, Target, Map, Heart, Home } from 'lucide-react'

const cols = [
  {
    heading: 'Learn',
    links: [
      { to: '/chatbot',  label: 'AI Chatbot',    icon: <MessageCircle size={13} /> },
      { to: '/quiz',     label: 'Quiz Generator', icon: <BookOpen size={13} />      },
      { to: '/roadmap',  label: 'Roadmap',        icon: <Map size={13} />           },
    ],
  },
  {
    heading: 'Wellness',
    links: [
      { to: '/mood',     label: 'Mood Booster',  icon: <Smile size={13} />  },
      { to: '/wellness', label: 'Wellness Zone', icon: <Heart size={13} />  },
      { to: '/goals',    label: 'Study Goals',   icon: <Target size={13} /> },
    ],
  },
  {
    heading: 'More',
    links: [
      { to: '/',       label: 'Home',  icon: <Home size={13} />          },
      { to: '/about',  label: 'About', icon: <MessageCircle size={13} /> },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/30" style={{ background: 'var(--mood-nav, rgba(255,255,255,0.7))', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base shadow"
                style={{ background: 'var(--mood-accent, #7c3aed)' }}>
                <img src="/logo.png" alt="Sakhi" className="w-9 h-9 rounded-xl object-cover" />
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--mood-accent, #7c3aed)' }}>Sakhi</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[180px]">
              Your calm, friendly AI study companion — learn, practice, and stay motivated every day.
            </p>
            <p className="text-xs text-gray-300 mt-2">© {new Date().getFullYear()} Sakhi</p>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.heading} className="flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{col.heading}</p>
              {col.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm transition-all ${
                      isActive ? 'font-semibold' : 'text-gray-400 hover:text-gray-700'
                    }`
                  }
                  style={({ isActive }) => isActive ? { color: 'var(--mood-accent, #7c3aed)' } : {}}
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-300">Made with ❤️ for students everywhere.</p>
          <p className="text-xs text-gray-300">Powered by Groq · React · Flask</p>
        </div>
      </div>
    </footer>
  )
}
