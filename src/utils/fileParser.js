import JSZip from 'jszip'
import { apiExtractPdf } from './api'

// ── PDF (server-side via Flask + PyMuPDF) ─────────────────────────────────────
export async function readPdf(file) {
  const data = await apiExtractPdf(file)
  if (data.error) throw new Error(data.error)
  return data.text
}

// ── TXT ───────────────────────────────────────────────────────────────────────
export function readTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = e => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read text file.'))
    reader.readAsText(file)
  })
}

// ── PPTX ──────────────────────────────────────────────────────────────────────
export async function readPptx(file) {
  try {
    const buffer = await file.arrayBuffer()
    const zip    = await JSZip.loadAsync(buffer)

    const slideEntries = Object.keys(zip.files)
      .filter(n => /^ppt\/slides\/slide[0-9]+\.xml$/.test(n))
      .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)[0])
        const nb = parseInt(b.match(/\d+/)[0])
        return na - nb
      })

    if (slideEntries.length === 0)
      throw new Error('No slides found. Make sure the file is a valid .pptx file.')

    let text = ''
    for (const slideName of slideEntries) {
      const xml = await zip.files[slideName].async('string')
      const stripped = xml
        .replace(/<a:t[^>]*>/g, ' ')
        .replace(/<\/a:t>/g, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
      if (stripped) text += stripped + '\n'
    }

    const result = text.trim()
    if (!result) throw new Error('No readable text found in this presentation.')
    return result
  } catch (err) {
    throw new Error(`PPTX read failed: ${err.message}`)
  }
}

// ── Main dispatcher ───────────────────────────────────────────────────────────
export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'txt')                   return readTxt(file)
  if (ext === 'pdf')                   return readPdf(file)
  if (ext === 'pptx' || ext === 'ppt') return readPptx(file)
  throw new Error(`Unsupported file type ".${ext}". Please upload a PDF, PPTX, or TXT file.`)
}
