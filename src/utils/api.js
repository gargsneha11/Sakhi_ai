const BASE = 'https://sakhi-ai1.onrender.com'   // <-- your live backend

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  return res.json()
}

// ─── Auth ─────────────────────────────────────────
export const apiSignup = (name, email, password) =>
  post('/signup', { name, email, password })

export const apiLogin = (email, password) =>
  post('/login', { email, password })

// ─── Goals ────────────────────────────────────────
export const apiSaveGoals = (user_email, goals) =>
  post('/save-goals', { user_email, goals })

export const apiGetGoals = (email) =>
  get(`/get-goals/${email}`)

// ─── Progress ─────────────────────────────────────
export const apiSaveProgress = (user_email, progress) =>
  post('/save-progress', { user_email, progress })

export const apiGetProgress = (email) =>
  get(`/get-progress/${email}`)

// ─── Notes ────────────────────────────────────────
export const apiSaveNotes = (user_email, notes) =>
  post('/save-notes', { user_email, notes })

export const apiGetNotes = (email) =>
  get(`/get-notes/${email}`)

// ─── Chat ─────────────────────────────────────────
export const apiChat = (messages) =>
  post('/chat', { messages })

export const apiGenerateQuiz = (topic, count) =>
  post('/generate-quiz', { topic, count })

export const apiGenerateDailyPlan = (email, mood) =>
  post('/generate-daily-plan', { email, mood })

// ─── Roadmaps ─────────────────────────────────────
export const apiSaveRoadmap = (user_email, roadmap) =>
  post('/save-roadmap', { user_email, roadmap })

export const apiGetRoadmaps = (email) =>
  get(`/get-roadmaps/${email}`)

export const apiDeleteRoadmap = (id) =>
  fetch(`${BASE}/delete-roadmap/${id}`, { method: 'DELETE' })
    .then(r => r.json())

// ─── PDF Extract ──────────────────────────────────
export async function apiExtractPdf(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/extract-pdf`, { method: 'POST', body: form })
  return res.json()
}

// ─── Roadmap AI ───────────────────────────────────
export async function apiGenerateRoadmap(textOrFile) {
  if (textOrFile instanceof File) {
    const form = new FormData()
    form.append('file', textOrFile)
    const res = await fetch(`${BASE}/generate-roadmap`, { method: 'POST', body: form })
    return res.json()
  }
  return post('/generate-roadmap', { text: textOrFile })
}

export async function apiGenerateRoadmapAI(textOrFile) {
  if (textOrFile instanceof File) {
    const form = new FormData()
    form.append('file', textOrFile)
    const res = await fetch(`${BASE}/generate-roadmap-ai`, { method: 'POST', body: form })
    return res.json()
  }
  return post('/generate-roadmap-ai', { text: textOrFile })
}