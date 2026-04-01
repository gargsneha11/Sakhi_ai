import { useState, useRef } from 'react'
import ChatWindow from '../components/chat/ChatWindow'
import ChatInput from '../components/chat/ChatInput'
import useLocalStorage from '../hooks/useLocalStorage'
import { apiChat } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { Trash2, Plus, MessageSquare, ChevronRight } from 'lucide-react'

const DEFAULT_WELCOME = "Hi! I'm Sakhi 🌸 Your friendly study companion. Ask me anything — I'm here to help!"

const moodWelcome = {
  Happy:     "Hey! 😊 You seem happy today — love that! Let's make the most of this great energy. What are we working on?",
  Sad:       "Hey 💙 I noticed you're feeling a bit sad today. That's okay — I'm here for you. Want to talk, or shall we take it slow with something light?",
  Stressed:  "Hey 😤 Feeling stressed? Take a breath — you've got this. I'm here to help you break things down one step at a time.",
  Anxious:   "Hey 🤗 I know things feel a bit overwhelming right now. You're safe here. Let's go at your pace — what's on your mind?",
  Bored:     "Hey 😑 Feeling bored? Let's fix that! Want to try a quiz, explore a topic, or just chat? I've got you!",
  Motivated: "Hey 🔥 You're feeling motivated today — let's channel that energy! What big thing are we tackling today?",
  Neutral:   "Hey 😐 Feeling neutral today — no pressure at all. I'm here whenever you're ready. What would you like to do?",
}

const moodSystemPrompt = {
  Happy:     'The user is feeling happy today. Match their positive energy, be upbeat and encouraging.',
  Sad:       'The user is feeling sad today. Be extra gentle, warm, and supportive. Avoid being overly cheerful.',
  Stressed:  'The user is feeling stressed. Be calm, reassuring, and help them break tasks into small manageable steps.',
  Anxious:   'The user is feeling anxious. Be very calm, patient, and grounding. Avoid overwhelming them with too much at once.',
  Bored:     'The user is feeling bored. Be fun, engaging, and suggest interesting things to do or learn.',
  Motivated: 'The user is feeling motivated. Match their energy, be enthusiastic and help them make the most of it.',
  Neutral:   'The user is feeling neutral. Be friendly and relaxed, no pressure, go at their pace.',
}

const moodEmoji = {
  Happy: '😊', Sad: '😢', Stressed: '😤',
  Anxious: '😰', Bored: '😑', Motivated: '🔥', Neutral: '😐',
}

function makeWelcome(mood, alreadyGreeted) {
  const text = (!alreadyGreeted && mood && moodWelcome[mood])
    ? moodWelcome[mood]
    : DEFAULT_WELCOME
  return [{ id: 0, role: 'bot', text }]
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ sessions, activeId, onSelect, onNew }) {
  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white/60 backdrop-blur-sm border-r border-white/40 h-full">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">Chats</span>
        <button
          onClick={onNew}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-80"
          style={{ background: 'var(--mood-accent, #7c3aed)' }}
          title="New chat"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-1 px-2">
        {sessions.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6 px-4">No previous chats yet.</p>
        )}
        {sessions.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group ${
              activeId === s.id
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/70'
            }`}
          >
            <MessageSquare size={14} className="shrink-0 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{s.title}</p>
              <p className="text-[10px] text-gray-400 truncate">{s.preview}</p>
            </div>
            {activeId === s.id && <ChevronRight size={12} className="text-gray-400 shrink-0" />}
          </button>
        ))}
      </div>
    </aside>
  )
}

// ── Main chat panel ────────────────────────────────────────────────────────────
function ChatPanel({ storageKey, sessionId, onMessageSent }) {
  const mood           = localStorage.getItem('userMood')
  const greetedKey     = `sakhi-mood-greeted-${storageKey}`
  const alreadyGreeted = localStorage.getItem(greetedKey) === mood
  const chatWindowRef  = useRef(null)

  const [messages, setMessages] = useLocalStorage(
    `${storageKey}-session-${sessionId}`,
    makeWelcome(mood, alreadyGreeted)
  )
  const [isTyping, setIsTyping] = useState(false)

  if (!alreadyGreeted && mood) localStorage.setItem(greetedKey, mood)

  const buildHistory = (msgs) => {
    const history = msgs
      .filter(m => m.id !== 0)
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))
    if (mood && moodSystemPrompt[mood])
      history.unshift({ role: 'system', content: `You are Sakhi, a friendly AI study companion. ${moodSystemPrompt[mood]}` })
    return history
  }

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setIsTyping(true)
    onMessageSent?.(sessionId, text)
    try {
      const data = await apiChat(buildHistory(updated))
      const reply = data.error ? `⚠️ ${data.error}` : data.reply
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }])
      chatWindowRef.current?.scrollToBottom()
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: '⚠️ Could not connect to server. Make sure Flask is running.' }])
      chatWindowRef.current?.scrollToBottom()
    } finally {
      setIsTyping(false)
    }
  }

  const handleClear = () => {
    localStorage.removeItem(greetedKey)
    setMessages(makeWelcome(mood, false))
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Chat header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm">
            <img src="/logo.png" alt="Sakhi" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Sakhi</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-gray-400">{isTyping ? 'Typing...' : 'Online'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mood && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{ background: 'var(--mood-accent-light, #ede9fe)', color: 'var(--mood-accent-text, #4c1d95)', borderColor: 'var(--mood-accent-light, #ede9fe)' }}>
              {moodEmoji[mood]} {mood}
            </span>
          )}
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>
      </div>

      {/* Messages — fixed height, internal scroll */}
      <ChatWindow ref={chatWindowRef} messages={messages} isTyping={isTyping} />

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}

// ── Root export ────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const { user } = useAuth()
  const storageKey = `sakhi-chat-${user?.email}`

  const [sessions, setSessions]     = useLocalStorage(`${storageKey}-sessions`, [
    { id: 'default', title: 'New Chat', preview: 'Start a conversation...' }
  ])
  const [activeId, setActiveId]     = useState('default')

  function handleNew() {
    const id  = `session-${Date.now()}`
    const s   = { id, title: 'New Chat', preview: 'Start a conversation...' }
    setSessions(prev => [s, ...prev])
    setActiveId(id)
  }

  function handleMessageSent(sessionId, text) {
    setSessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, title: text.slice(0, 28) || 'Chat', preview: text.slice(0, 40) }
        : s
    ))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Fixed-height container — no page scroll */}
      <div className="flex rounded-3xl overflow-hidden border border-white/40 shadow-xl bg-white/50 backdrop-blur-sm"
        style={{ height: 'calc(100vh - 120px)' }}>
        <Sidebar
          sessions={sessions}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={handleNew}
        />
        <ChatPanel
          key={activeId}
          storageKey={storageKey}
          sessionId={activeId}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  )
}
