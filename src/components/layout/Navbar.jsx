import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePomodoro } from '../../context/PomodoroContext'
import { NavbarTimerBar } from '../goals/PomodoroTimer'

const links = [
  { to: '/',          label: 'Home'         },
  { to: '/chatbot',   label: 'Chatbot'      },
  { to: '/quiz',      label: 'Quiz'         },
  { to: '/roadmap',   label: 'Roadmap'      },
  { to: '/mood',      label: 'Mood Booster' },
  { to: '/wellness',  label: 'Wellness'     },
  { to: '/goals',     label: 'Goals'        },
  { to: '/about',     label: 'About'        },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isMoodBoosterBlocked, showTimer } = usePomodoro()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20"
      style={{ background: 'var(--mood-nav, rgba(255,255,255,0.85))', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-sm"
            style={{ background: 'var(--mood-accent, #7c3aed)', color: 'white' }}>
            <img src="/logo.png" alt="Sakhi" className="w-8 h-8 rounded-xl object-cover" />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--mood-accent, #7c3aed)' }}>
            Sakhi
          </span>
        </NavLink>

        {/* Desktop links */}
        {user && (
          <div className="hidden lg:flex items-center gap-0.5 bg-black/5 rounded-2xl px-2 py-1.5">
            {links.map(link => {
              const blocked = link.to === '/mood' && isMoodBoosterBlocked
              return blocked ? (
                <span key={link.to}
                  title="Locked during focus session"
                  className="text-xs font-medium px-3 py-1.5 rounded-xl text-gray-300 cursor-not-allowed select-none">
                  🔒 {link.label}
                </span>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white shadow-sm text-gray-800 font-semibold'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </div>
        )}

        {/* Right */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {showTimer && <NavbarTimerBar />}
              <div className="flex items-center gap-2 bg-white/70 border border-white/50 rounded-2xl px-3 py-1.5 shadow-sm">
                <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-sm"
                  style={{ background: 'var(--mood-accent, #7c3aed)' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-2 rounded-xl transition-all"
              >
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2 rounded-xl hover:bg-white/60 transition-all">
                Log in
              </NavLink>
              <NavLink to="/signup" className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-xl shadow-md transition-all hover:opacity-90"
                style={{ background: 'var(--mood-accent, #7c3aed)' }}>
                <Sparkles size={13} /> Sign up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-black/5 transition-colors" onClick={() => setOpen(p => !p)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/30 px-4 py-3 flex flex-col gap-1 bg-white/95 backdrop-blur-md">
          {user && links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${
                  isActive ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-black/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'var(--mood-accent, #7c3aed)' } : {}}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            {user ? (
              <>
                <p className="text-xs text-gray-400 px-4 py-1">Signed in as <strong>{user.name}</strong></p>
                <button onClick={() => { handleLogout(); setOpen(false) }}
                  className="flex items-center gap-2 text-sm text-red-400 px-4 py-2 rounded-xl hover:bg-red-50 transition-all w-full">
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="block text-sm text-gray-600 px-4 py-2 rounded-xl hover:bg-black/5" onClick={() => setOpen(false)}>Log in</NavLink>
                <NavLink to="/signup" className="block text-sm font-semibold text-white px-4 py-2 rounded-xl mt-1" style={{ background: 'var(--mood-accent, #7c3aed)' }} onClick={() => setOpen(false)}>Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
