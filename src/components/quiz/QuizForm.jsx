import { useState, useRef } from 'react'
import { BookOpen, Upload, FileText, X, Sparkles } from 'lucide-react'
import { apiExtractPdf } from '../../utils/api'

const COUNT_OPTIONS = [3, 5, 10, 15]

export default function QuizForm({ onStart, loading: generating, moodConfig }) {
  const [topic,      setTopic]      = useState('')
  const [count,      setCount]      = useState(5)
  const [mode,       setMode]       = useState('text')
  const [txtText,    setTxtText]    = useState('')
  const [txtName,    setTxtName]    = useState('')
  const [pdfFile,    setPdfFile]    = useState(null)
  const [pdfText,    setPdfText]    = useState('')
  const [extracting, setExtracting] = useState(false)
  const [error,      setError]      = useState('')

  const txtRef = useRef(null)
  const pdfRef = useRef(null)

  const handleTxt = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    const reader = new FileReader()
    reader.onload  = ev => { setTxtText(ev.target.result); setTxtName(file.name) }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsText(file)
  }

  const handlePdf = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return }
    setPdfFile(file); setPdfText(''); setError(''); setExtracting(true)
    try {
      const data = await apiExtractPdf(file)
      if (data.error) { setError(data.error); setPdfFile(null) }
      else setPdfText(data.text)
    } catch {
      setError('Could not connect to server.')
      setPdfFile(null)
    } finally { setExtracting(false) }
  }

  const clearPdf = () => { setPdfFile(null); setPdfText(''); if (pdfRef.current) pdfRef.current.value = '' }
  const clearTxt = () => { setTxtText(''); setTxtName(''); if (txtRef.current) txtRef.current.value = '' }

  const handleGenerate = () => {
    setError('')
    if (mode === 'text') return onStart(topic.trim(), count)
    if (mode === 'txt')  return onStart(txtText, count)
    if (mode === 'pdf')  return onStart(pdfText, count)
  }

  const canGenerate =
    (mode === 'text' && topic.trim()) ||
    (mode === 'txt'  && txtText) ||
    (mode === 'pdf'  && pdfText)

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-sm">

      {/* Top banner */}
      <div className="px-6 py-5 border-b border-gray-100/50"
        style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-extrabold" style={{ color: 'var(--mood-accent-text,#4c1d95)' }}>
              Generate a Quiz
            </h2>
            <p className="text-xs mt-0.5 opacity-70" style={{ color: 'var(--mood-accent-text,#4c1d95)' }}>
              Type a topic, upload TXT or PDF
            </p>
          </div>
          {moodConfig && (
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/60"
              style={{ color: 'var(--mood-accent-text,#4c1d95)' }}>
              {moodConfig.emoji} {moodConfig.count} {moodConfig.difficulty} questions
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">

        {/* Input mode tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
          {[['text','✏️ Topic'],['txt','📄 TXT'],['pdf','📕 PDF']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === m ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Text input */}
        {mode === 'text' && (
          <input type="text" value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && topic.trim() && !generating && handleGenerate()}
            placeholder="e.g. Photosynthesis, Python basics, World War II..."
            className="input text-sm" />
        )}

        {/* TXT upload */}
        {mode === 'txt' && (
          <>
            <input ref={txtRef} type="file" accept=".txt" className="hidden" onChange={handleTxt} />
            {!txtText ? (
              <button onClick={() => txtRef.current.click()}
                className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-gray-200 rounded-2xl hover:border-violet-300 hover:bg-violet-50/30 transition-all">
                <Upload size={22} className="text-gray-300" />
                <span className="text-sm font-medium text-gray-400">Click to upload .txt file</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-violet-200 bg-violet-50">
                <FileText size={16} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
                <span className="text-sm font-semibold text-gray-700 flex-1 truncate">{txtName}</span>
                <button onClick={clearTxt} className="text-gray-400 hover:text-red-500 transition-colors"><X size={15} /></button>
              </div>
            )}
          </>
        )}

        {/* PDF upload */}
        {mode === 'pdf' && (
          <>
            <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdf} />
            {!pdfFile ? (
              <button onClick={() => pdfRef.current.click()}
                className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-gray-200 rounded-2xl hover:border-violet-300 hover:bg-violet-50/30 transition-all">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>
                  <Upload size={20} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">Click to upload PDF</p>
                  <p className="text-xs text-gray-400 mt-0.5">Text-based PDFs only</p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-violet-200 bg-violet-50">
                  <FileText size={16} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
                  <span className="text-sm font-semibold text-gray-700 flex-1 truncate">{pdfFile.name}</span>
                  {extracting
                    ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--mood-accent,#7c3aed)' }} />
                    : <button onClick={clearPdf} className="text-gray-400 hover:text-red-500 transition-colors"><X size={15} /></button>
                  }
                </div>
                {extracting && <p className="text-xs text-gray-400 text-center">Extracting text from PDF...</p>}
                {pdfText && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-center">✅ Text extracted — ready to generate!</p>}
              </div>
            )}
          </>
        )}

        {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">⚠️ {error}</p>}

        {/* Generate button */}
        <button onClick={handleGenerate}
          disabled={!canGenerate || generating || extracting}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-40"
          style={{ background: 'var(--mood-accent,#7c3aed)' }}>
          {generating
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
            : <><Sparkles size={15} /> Generate Quiz</>
          }
        </button>
      </div>
    </div>
  )
}
