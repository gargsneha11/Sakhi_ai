import { useState, useRef } from 'react'
import { BookOpen, Upload, FileText, X } from 'lucide-react'
import { apiExtractPdf } from '../../utils/api'

const COUNT_OPTIONS = [3, 5, 10, 15]

export default function QuizForm({ onStart, loading: generating }) {
  const [topic,    setTopic]    = useState('')
  const [count,    setCount]    = useState(5)
  const [mode,     setMode]     = useState('text')   // 'text' | 'txt' | 'pdf'
  const [txtText,  setTxtText]  = useState('')
  const [txtName,  setTxtName]  = useState('')
  const [pdfFile,  setPdfFile]  = useState(null)
  const [pdfText,  setPdfText]  = useState('')
  const [extracting, setExtracting] = useState(false)
  const [error,    setError]    = useState('')

  const txtRef = useRef(null)
  const pdfRef = useRef(null)

  // ── TXT handler ────────────────────────────────────────────────────────────
  const handleTxt = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    const reader = new FileReader()
    reader.onload  = ev => { setTxtText(ev.target.result); setTxtName(file.name) }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsText(file)
  }

  // ── PDF handler ────────────────────────────────────────────────────────────
  const handlePdf = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return }
    setPdfFile(file)
    setPdfText('')
    setError('')
    setExtracting(true)
    try {
      const data = await apiExtractPdf(file)
      if (data.error) { setError(data.error); setPdfFile(null) }
      else setPdfText(data.text)
    } catch {
      setError('Could not connect to server. Make sure Flask is running.')
      setPdfFile(null)
    } finally {
      setExtracting(false)
    }
  }

  const clearPdf = () => { setPdfFile(null); setPdfText(''); if (pdfRef.current) pdfRef.current.value = '' }
  const clearTxt = () => { setTxtText(''); setTxtName(''); if (txtRef.current) txtRef.current.value = '' }

  const handleGenerate = () => {
    setError('')
    if (mode === 'text')  return onStart(topic.trim(), count)
    if (mode === 'txt')   return onStart(txtText, count)
    if (mode === 'pdf')   return onStart(pdfText, count)
  }

  const canGenerate =
    (mode === 'text' && topic.trim()) ||
    (mode === 'txt'  && txtText) ||
    (mode === 'pdf'  && pdfText)

  return (
    <div className="card max-w-lg mx-auto p-8 flex flex-col gap-6">

      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto"
          style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>📝</div>
        <h2 className="mt-4 text-xl font-bold text-gray-800">Generate a Quiz</h2>
        <p className="text-sm text-gray-400 mt-1">Type a topic, upload a TXT or PDF file</p>
      </div>

      {/* Question count */}
      <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-gray-100">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Number of Questions</label>
        <div className="flex gap-2 flex-wrap">
          {COUNT_OPTIONS.map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg border transition-all ${
                count === n ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-violet-400 hover:text-violet-600'
              }`}
              style={count === n ? { background: 'var(--mood-accent,#7c3aed)', borderColor: 'var(--mood-accent,#7c3aed)' } : {}}
            >{n}</button>
          ))}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
        {[['text','✏️ Topic'],['txt','📄 TXT'],['pdf','📕 PDF']].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setError('') }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === m ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'
            }`}
          >{label}</button>
        ))}
      </div>

      {/* Text input */}
      {mode === 'text' && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && topic.trim() && !generating && handleGenerate()}
            placeholder="e.g. Photosynthesis, World War II, Python basics..."
            className="input"
          />
        </div>
      )}

      {/* TXT upload */}
      {mode === 'txt' && (
        <div className="flex flex-col gap-2">
          <input ref={txtRef} type="file" accept=".txt" className="hidden" onChange={handleTxt} />
          {!txtText ? (
            <button onClick={() => txtRef.current.click()}
              className="flex flex-col items-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-violet-300 hover:bg-violet-50/40 transition-all">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-400">Click to upload .txt file</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-violet-200 bg-violet-50">
              <FileText size={16} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
              <span className="text-sm font-medium text-gray-700 flex-1 truncate">{txtName}</span>
              <button onClick={clearTxt} className="text-gray-400 hover:text-red-500 transition-colors"><X size={15} /></button>
            </div>
          )}
        </div>
      )}

      {/* PDF upload */}
      {mode === 'pdf' && (
        <div className="flex flex-col gap-2">
          <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdf} />
          {!pdfFile ? (
            <button onClick={() => pdfRef.current.click()}
              className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-violet-300 hover:bg-violet-50/40 transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--mood-accent-light,#ede9fe)' }}>
                <Upload size={18} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">Click to upload PDF</p>
                <p className="text-xs text-gray-400 mt-0.5">Text-based PDFs only (not scanned)</p>
              </div>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-violet-200 bg-violet-50">
                <FileText size={16} style={{ color: 'var(--mood-accent,#7c3aed)' }} />
                <span className="text-sm font-medium text-gray-700 flex-1 truncate">{pdfFile.name}</span>
                {extracting
                  ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--mood-accent,#7c3aed)' }} />
                  : <button onClick={clearPdf} className="text-gray-400 hover:text-red-500 transition-colors"><X size={15} /></button>
                }
              </div>
              {extracting && <p className="text-xs text-gray-400 text-center">Extracting text from PDF...</p>}
              {pdfText && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">✅ Text extracted — ready to generate quiz!</p>}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">⚠️ {error}</p>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || generating || extracting}
        className="btn-primary disabled:opacity-40"
      >
        {generating
          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          : <><BookOpen size={15} /> Generate {count} Questions</>
        }
      </button>
    </div>
  )
}
