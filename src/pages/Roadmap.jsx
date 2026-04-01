import { useState, useRef, useEffect } from 'react'
import { Map, BookOpen, Zap, Star, Upload, FileText, X, Save, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiGenerateRoadmapAI, apiSaveRoadmap, apiGetRoadmaps, apiDeleteRoadmap } from '../utils/api'
import { useAuth } from '../context/AuthContext'

// ── Mood config for roadmap ───────────────────────────────────────────────────
const MOOD_ROADMAP = {
  stressed:  { emoji: '😤', label: 'Stressed',  message: '💙 Keeping it simple — short focused roadmap with easy steps.',       style: 'beginner-friendly, short, simple steps, avoid overwhelming content' },
  tired:     { emoji: '😴', label: 'Tired',     message: '😴 Light roadmap — easy revision-style path for you.',                  style: 'very simple, revision-friendly, minimal steps per stage'             },
  motivated: { emoji: '🔥', label: 'Motivated', message: '🔥 Full detailed roadmap — let\'s go deep!',                           style: 'detailed, comprehensive, include advanced topics and challenges'      },
  confused:  { emoji: '😕', label: 'Confused',  message: '🤔 Step-by-step roadmap with clear explanations at each stage.',        style: 'step-by-step, concept-first, explain each topic clearly'             },
  happy:     { emoji: '😊', label: 'Happy',     message: '😊 Balanced roadmap — fun and engaging learning path!',                style: 'balanced, engaging, mix of theory and practice'                      },
  sad:       { emoji: '😢', label: 'Sad',       message: '💜 Gentle roadmap — easy and encouraging path forward.',                style: 'gentle, encouraging, easy beginner-friendly steps'                   },
  anxious:   { emoji: '😰', label: 'Anxious',   message: '🤗 Calm roadmap — small manageable steps, no pressure.',               style: 'small steps, no pressure, very beginner-friendly'                    },
  neutral:   { emoji: '😐', label: 'Neutral',   message: '📝 Standard balanced roadmap for steady learning.',                    style: 'balanced, standard difficulty, clear progression'                    },
}

const STAGE_CONFIG = {
  Beginner:     { gradient: 'from-emerald-400 to-teal-500',  light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: <BookOpen size={15} /> },
  Intermediate: { gradient: 'from-blue-400 to-cyan-500',     light: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700',   icon: <Zap size={15} />     },
  Advanced:     { gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50',  border: 'border-violet-200', text: 'text-violet-700', icon: <Star size={15} />    },
}

export default function Roadmap() {
  const { user } = useAuth()
  const mood       = (localStorage.getItem('userMood') || 'neutral').toLowerCase()
  const moodConfig = MOOD_ROADMAP[mood] || MOOD_ROADMAP.neutral

  const [text,       setText]       = useState('')
  const [roadmap,    setRoadmap]    = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [view,       setView]       = useState('cards')
  const [mode,       setMode]       = useState('text')
  const [pdfFile,    setPdfFile]    = useState(null)
  const [saved,      setSaved]      = useState([])
  const [showSaved,  setShowSaved]  = useState(false)
  const [saveToast,  setSaveToast]  = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const fileRef = useRef(null)

  // Load saved roadmaps from DB on mount
  useEffect(() => {
    apiGetRoadmaps(user.email).then(data => {
      if (data.roadmaps) setSaved(data.roadmaps)
    })
  }, [user.email])

  async function handleSave() {
    if (!roadmap) return
    const entry = { ...roadmap, saved_at: new Date().toLocaleDateString() }
    const data  = await apiSaveRoadmap(user.email, entry)
    if (data.error) {
      setSaveToast('exists')
    } else {
      setSaveToast('saved')
      // Refresh list from DB
      apiGetRoadmaps(user.email).then(d => { if (d.roadmaps) setSaved(d.roadmaps) })
    }
    setTimeout(() => setSaveToast(false), 2500)
  }

  async function handleDelete(id) {
    await apiDeleteRoadmap(id)
    setSaved(prev => prev.filter(r => r.id !== id))
  }

  function handleDownload() {
    if (!roadmap) return
    let content = `ROADMAP: ${roadmap.title}\n`
    content += `Topic: ${roadmap.input_topic}\n`
    content += `Generated on: ${new Date().toLocaleDateString()}\n`
    content += '='.repeat(50) + '\n\n'
    roadmap.stages.forEach((stage, i) => {
      content += `PHASE ${i + 1}: ${stage.level} (${stage.weeks})\n`
      content += '-'.repeat(30) + '\n'
      stage.topics.forEach((t, j) => {
        content += `  ${j + 1}. ${t}\n`
      })
      content += `\n🎯 Practice: ${stage.practice}\n\n`
    })
    const blob = new Blob([content], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${roadmap.title.replace(/\s+/g, '_')}_roadmap.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGenerate = async () => {
    setError(''); setLoading(true)
    try {
      // Append mood style instruction to topic so Groq adapts the roadmap
      const moodHint = `(Style: ${moodConfig.style})`
      const data = mode === 'pdf' && pdfFile
        ? await apiGenerateRoadmapAI(pdfFile)
        : await apiGenerateRoadmapAI(`${text.trim()} ${moodHint}`)
      if (data.error) setError(data.error)
      else { setRoadmap(data.roadmap); setView('cards') }
    } catch {
      setError('Could not connect to server. Make sure Flask is running.')
    } finally { setLoading(false) }
  }

  const reset = () => { setRoadmap(null); setText(''); setError(''); setPdfFile(null) }

  return (
    <div className="min-h-screen">

      {/* Save toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className={`px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg border ${
              saveToast === 'saved'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              {saveToast === 'saved' ? '✅ Roadmap saved!' : '⚠️ Already saved!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative overflow-hidden py-12 mb-2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--mood-accent,#7c3aed)' }} />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--mood-accent,#7c3aed)' }} />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-3xl mb-4 shadow-lg"
            style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>🗺️</div>
          <h1 className="text-3xl font-extrabold text-gray-900">AI Roadmap Generator</h1>
          <p className="text-gray-400 mt-2 text-sm">Type a topic or upload a PDF — AI builds your complete study roadmap</p>
          {/* Mood badges */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{ background: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)', borderColor: 'var(--mood-accent-light,#ede9fe)' }}>
              {moodConfig.emoji} Mood: {moodConfig.label}
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              ✨ Adaptive Roadmap ON
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 flex flex-col gap-6">

        <AnimatePresence mode="wait">
        {!roadmap ? (
          <motion.div key="form"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col gap-5">

              {/* Mood message banner */}
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
                style={{ background: 'var(--mood-accent-light,#ede9fe)', borderColor: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)' }}>
                <span className="text-xl shrink-0">{moodConfig.emoji}</span>
                <div>
                  <p className="text-xs font-bold mb-0.5">Adaptive Roadmap Mode</p>
                  <p className="text-xs opacity-80">{moodConfig.message}</p>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
                {[['text', <FileText size={13} />, 'Type Topic'], ['pdf', <Upload size={13} />, 'Upload PDF']].map(([m, icon, label]) => (
                  <button key={m} onClick={() => { setMode(m); setError('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      mode === m ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'
                    }`}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Text input */}
              {mode === 'text' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Topic or Subject</label>
                  <input type="text" value={text}
                    onChange={e => { setText(e.target.value); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && text.trim() && !loading && handleGenerate()}
                    placeholder="e.g. Machine Learning, React.js, Data Structures..."
                    className="input text-sm" />
                </div>
              )}

              {/* PDF upload */}
              {mode === 'pdf' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upload PDF</label>
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                    onChange={e => {
                      const f = e.target.files[0]
                      if (f?.type === 'application/pdf') { setPdfFile(f); setError('') }
                      else setError('Please upload a valid PDF file.')
                    }} />
                  {!pdfFile ? (
                    <button onClick={() => fileRef.current.click()}
                      className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-gray-200 rounded-2xl hover:border-violet-300 hover:bg-violet-50/30 transition-all">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>
                        <Upload size={20} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">Click to upload PDF</p>
                        <p className="text-xs text-gray-400 mt-0.5">Text-based PDFs only (not scanned)</p>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-violet-200 bg-violet-50">
                      <FileText size={18} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
                      <span className="text-sm font-semibold text-gray-700 flex-1 truncate">{pdfFile.name}</span>
                      <button onClick={() => { setPdfFile(null); fileRef.current.value = '' }}
                        className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">⚠️ {error}</p>}

              <button onClick={handleGenerate}
                disabled={loading || (mode === 'text' ? !text.trim() : !pdfFile)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-40"
                style={{ background: 'var(--mood-accent,#7c3aed)' }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Roadmap...</>
                  : <><Map size={16} /> Generate Roadmap</>}
              </button>
            </div>
          </motion.div>

        ) : (
          <motion.div key="roadmap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5">

            {/* Roadmap header */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl px-6 py-5 shadow-sm flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">{roadmap.title}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-xs text-gray-400 italic truncate max-w-xs">{roadmap.input_topic}</p>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                    style={{ background: 'var(--mood-accent-light,#ede9fe)', color: 'var(--mood-accent-text,#4c1d95)', borderColor: 'var(--mood-accent-light,#ede9fe)' }}>
                    {moodConfig.emoji} {moodConfig.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                  {[['cards','📋 Cards'],['flowchart','🔀 Flow']].map(([v, label]) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        view === v ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'
                      }`}>{label}</button>
                  ))}
                </div>
                <button onClick={handleSave}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-white shadow-sm hover:opacity-90 transition-all"
                  style={{ background: 'var(--mood-accent,#7c3aed)' }}>
                  <Save size={13} /> Save
                </button>
                <button onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all">
                  <Download size={13} /> Download
                </button>
                <button onClick={reset}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all">
                  ← New
                </button>
              </div>
            </div>

            {/* Card View */}
            {view === 'cards' && (
              <div className="flex flex-col gap-4">
                {roadmap.stages.map((stage, i) => {
                  const s = STAGE_CONFIG[stage.level] || STAGE_CONFIG.Beginner
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                      {/* Stage header */}
                      <div className={`bg-gradient-to-r ${s.gradient} px-6 py-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                          {s.icon} {stage.level}
                        </div>
                        <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">
                          📅 {stage.weeks}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col gap-4">
                        {/* Topics */}
                        <div className="flex flex-wrap gap-2">
                          {stage.topics.map((t, j) => (
                            <span key={j} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${s.light} ${s.border} ${s.text}`}>
                              {j+1}. {t}
                            </span>
                          ))}
                        </div>

                        {/* Practice */}
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                          <span className="text-lg shrink-0">🎯</span>
                          <div>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Practice</p>
                            <p className="text-sm text-amber-800">{stage.practice}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Flowchart View */}
            {view === 'flowchart' && (
              <div className="flex flex-col items-center gap-0 py-4">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-white text-sm font-bold px-8 py-3 rounded-full shadow-lg z-10"
                  style={{ background: 'var(--mood-accent,#7c3aed)', boxShadow: '0 8px 24px var(--mood-accent-light,#ede9fe)' }}>
                  🚀 Start: {roadmap.title}
                </motion.div>

                {roadmap.stages.map((stage, i) => {
                  const s = STAGE_CONFIG[stage.level] || STAGE_CONFIG.Beginner
                  return (
                    <div key={i} className="flex flex-col items-center w-full max-w-lg">
                      <div className="flex flex-col items-center">
                        <div className={`w-0.5 h-10 bg-gradient-to-b ${s.gradient}`} />
                        <div className={`w-3 h-3 rotate-45 -mt-1.5 bg-gradient-to-br ${s.gradient} rounded-sm`} />
                      </div>
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 }}
                        className={`bg-gradient-to-r ${s.gradient} text-white font-bold text-xs px-5 py-2 rounded-full shadow-md mb-3 flex items-center gap-2`}>
                        {s.icon} Phase {i+1}: {stage.level} · {stage.weeks}
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 + 0.1 }}
                        className="w-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm p-4 flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {stage.topics.map((t, j) => (
                            <span key={j} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${s.light} ${s.border} ${s.text}`}>
                              {j+1}. {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                          <span>🎯</span>
                          <p className="text-xs text-amber-700 font-medium">{stage.practice}</p>
                        </div>
                      </motion.div>
                    </div>
                  )
                })}

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-emerald-400 to-teal-500" />
                  <div className="w-3 h-3 rotate-45 -mt-1.5 bg-emerald-400 rounded-sm" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: roadmap.stages.length * 0.15 + 0.1 }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-8 py-3 rounded-full shadow-lg">
                  🎓 Goal Achieved!
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* Saved Roadmaps */}
        {saved.length > 0 && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowSaved(p => !p)}
              className="flex items-center justify-between w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                💾 Saved Roadmaps
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--mood-accent,#7c3aed)' }}>
                  {saved.length}
                </span>
              </span>
              {showSaved ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            <AnimatePresence>
              {showSaved && (
                <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                  className="flex flex-col gap-3">
                  {saved.map((r, i) => (
                    <div key={r.id} className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-sm">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{r.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Saved on {r.saved_at}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => { setRoadmap(r.data); setView('cards'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl text-white hover:opacity-90 transition-all"
                            style={{ background: 'var(--mood-accent,#7c3aed)' }}>
                            Open
                          </button>
                          <button
                            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
                            {expandedId === r.id ? 'Hide' : 'Preview'}
                          </button>
                          <button onClick={() => handleDelete(r.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Preview */}
                      {expandedId === r.id && (
                        <div className="px-5 pb-4 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
                          {r.data?.stages?.map((stage, j) => {
                            const s = STAGE_CONFIG[stage.level] || STAGE_CONFIG.Beginner
                            return (
                              <div key={j} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${s.light} ${s.border} ${s.text}`}>
                                {s.icon} {stage.level}
                              </div>
                            )
                          })}
                          <p className="w-full text-xs text-gray-400 mt-1 italic truncate">{r.data?.input_topic}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}
