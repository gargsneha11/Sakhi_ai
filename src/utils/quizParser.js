// ─── Topic-based question bank ───────────────────────────────────────────────
const TOPIC_BANK = [
  {
    keywords: ['photosynthesis', 'chlorophyll', 'botany'],
    questions: [
      { question: 'What is the primary pigment used in photosynthesis?', options: ['Chlorophyll', 'Carotene', 'Xanthophyll', 'Melanin'], answer: 'Chlorophyll', explanation: 'Chlorophyll is the green pigment that absorbs sunlight to drive photosynthesis.' },
      { question: 'Where does photosynthesis take place in a plant cell?', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'], answer: 'Chloroplast', explanation: 'Chloroplasts are the organelles where photosynthesis occurs.' },
      { question: 'What gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Carbon Dioxide', explanation: 'Plants absorb CO₂ and convert it into glucose using sunlight and water.' },
      { question: 'What is the chemical formula for glucose?', options: ['C₆H₁₂O₆', 'CO₂', 'H₂O', 'O₂'], answer: 'C₆H₁₂O₆', explanation: 'Glucose (C₆H₁₂O₆) is the sugar produced by photosynthesis.' },
      { question: 'What is released as a by-product of photosynthesis?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Water Vapour'], answer: 'Oxygen', explanation: 'Oxygen is released when water molecules are split during light reactions.' },
    ],
  },
  {
    keywords: ['mitosis', 'meiosis', 'chromosome', 'genetics', 'dna'],
    questions: [
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 'Mitochondria', explanation: 'Mitochondria produce ATP through cellular respiration.' },
      { question: 'Which organelle contains the cell\'s genetic material?', options: ['Ribosome', 'Mitochondria', 'Nucleus', 'Vacuole'], answer: 'Nucleus', explanation: 'The nucleus houses DNA and controls cell activities.' },
      { question: 'How many chromosomes does a normal human cell have?', options: ['23', '46', '48', '44'], answer: '46', explanation: 'Human cells have 46 chromosomes arranged in 23 pairs.' },
      { question: 'What process produces genetically identical cells?', options: ['Meiosis', 'Mitosis', 'Fertilisation', 'Mutation'], answer: 'Mitosis', explanation: 'Mitosis produces two identical daughter cells used for growth and repair.' },
      { question: 'What molecule carries genetic information?', options: ['RNA', 'ATP', 'DNA', 'Protein'], answer: 'DNA', explanation: 'DNA stores and transmits genetic information.' },
    ],
  },
  {
    keywords: ['cpu', 'hardware', 'software', 'programming', 'algorithm', 'network', 'operating system', 'computer science'],
    questions: [
      { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], answer: 'Central Processing Unit', explanation: 'The CPU is the primary component that executes instructions.' },
      { question: 'Which data structure uses LIFO order?', options: ['Queue', 'Stack', 'Array', 'Tree'], answer: 'Stack', explanation: 'A Stack follows Last In First Out (LIFO).' },
      { question: 'What does RAM stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Application Memory', 'Read And Modify'], answer: 'Random Access Memory', explanation: 'RAM is temporary memory used by the CPU.' },
      { question: 'Which protocol is used to load websites?', options: ['FTP', 'SMTP', 'HTTP', 'SSH'], answer: 'HTTP', explanation: 'HTTP transfers web pages over the internet.' },
      { question: 'What is the binary of decimal 10?', options: ['1010', '1100', '1001', '0110'], answer: '1010', explanation: '10 in binary is 1010 (8+2=10).' },
    ],
  },
  {
    keywords: ['world war', 'history', 'revolution', 'empire', 'ancient', 'medieval', 'civilization'],
    questions: [
      { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: '1945', explanation: 'WWII ended in 1945 with Germany and Japan surrendering.' },
      { question: 'Who was the first President of the United States?', options: ['Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams'], answer: 'George Washington', explanation: 'George Washington served as the first U.S. President from 1789 to 1797.' },
      { question: 'Which empire was ruled by Julius Caesar?', options: ['Greek Empire', 'Ottoman Empire', 'Roman Empire', 'Persian Empire'], answer: 'Roman Empire', explanation: 'Julius Caesar was a key figure in the Roman Empire.' },
      { question: 'The French Revolution began in which year?', options: ['1776', '1789', '1799', '1804'], answer: '1789', explanation: 'The French Revolution began in 1789.' },
      { question: 'Which country was NOT part of the Allied Powers in WWII?', options: ['USA', 'UK', 'Germany', 'USSR'], answer: 'Germany', explanation: 'Germany was part of the Axis Powers.' },
    ],
  },
  {
    keywords: ['physics', 'force', 'gravity', 'motion', 'energy', 'newton', 'relativity', 'quantum'],
    questions: [
      { question: 'What is the SI unit of force?', options: ['Watt', 'Joule', 'Newton', 'Pascal'], answer: 'Newton', explanation: 'The Newton (N) is the SI unit of force.' },
      { question: 'What is the speed of light in a vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], answer: '3×10⁸ m/s', explanation: 'Light travels at approximately 3×10⁸ m/s in a vacuum.' },
      { question: 'Which law states every action has an equal and opposite reaction?', options: ['Newton\'s 1st Law', 'Newton\'s 2nd Law', 'Newton\'s 3rd Law', 'Law of Gravity'], answer: 'Newton\'s 3rd Law', explanation: 'Newton\'s Third Law: every action has an equal and opposite reaction.' },
      { question: 'What energy does a moving object possess?', options: ['Potential Energy', 'Thermal Energy', 'Kinetic Energy', 'Chemical Energy'], answer: 'Kinetic Energy', explanation: 'Kinetic energy is the energy of motion.' },
      { question: 'Who developed the theory of relativity?', options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Stephen Hawking'], answer: 'Albert Einstein', explanation: 'Einstein published the theory of relativity in 1905.' },
    ],
  },
  {
    keywords: ['chemistry', 'atom', 'molecule', 'element', 'periodic', 'reaction', 'acid', 'base'],
    questions: [
      { question: 'What is H₂O commonly known as?', options: ['Hydrogen gas', 'Oxygen', 'Water', 'Salt'], answer: 'Water', explanation: 'H₂O is the chemical formula for water.' },
      { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], answer: '6', explanation: 'Carbon has 6 protons in its nucleus.' },
      { question: 'Which gas makes up most of Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], answer: 'Nitrogen', explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.' },
      { question: 'What is the pH of a neutral solution?', options: ['0', '7', '14', '5'], answer: '7', explanation: 'A neutral solution has a pH of 7.' },
      { question: 'What bond involves sharing of electrons?', options: ['Ionic Bond', 'Covalent Bond', 'Hydrogen Bond', 'Metallic Bond'], answer: 'Covalent Bond', explanation: 'A covalent bond forms when atoms share electrons.' },
    ],
  },
  {
    keywords: ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry', 'statistics'],
    questions: [
      { question: 'What is the value of π approximately?', options: ['2.718', '3.142', '1.618', '1.414'], answer: '3.142', explanation: 'Pi (π) ≈ 3.14159.' },
      { question: 'What is the square root of 144?', options: ['11', '12', '13', '14'], answer: '12', explanation: '12 × 12 = 144.' },
      { question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], answer: '180°', explanation: 'Interior angles of a triangle always sum to 180°.' },
      { question: 'What does slope represent in y = mx + c?', options: ['y-intercept', 'x-intercept', 'Rate of change', 'Constant'], answer: 'Rate of change', explanation: 'm represents the slope or rate of change.' },
      { question: 'What is 2⁸ equal to?', options: ['128', '256', '512', '64'], answer: '256', explanation: '2⁸ = 256.' },
    ],
  },
  {
    keywords: ['geography', 'country', 'capital', 'continent', 'ocean', 'river', 'mountain'],
    questions: [
      { question: 'Which is the largest continent by area?', options: ['Africa', 'North America', 'Asia', 'Europe'], answer: 'Asia', explanation: 'Asia covers about 44.6 million km².' },
      { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 'Canberra', explanation: 'Canberra is the capital of Australia.' },
      { question: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 'Nile', explanation: 'The Nile is approximately 6,650 km long.' },
      { question: 'How many oceans are there on Earth?', options: ['3', '4', '5', '6'], answer: '5', explanation: 'Pacific, Atlantic, Indian, Southern, and Arctic.' },
      { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 'Mercury', explanation: 'Mercury is the first planet from the Sun.' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','in','on','at','to','of','and','or',
  'but','it','its','this','that','with','for','as','by','from','be','been',
  'has','have','had','not','do','did','does','so','if','then','than','into',
  'about','which','who','what','when','where','how','also','can','will','may',
  'more','some','such','each','their','they','them','these','those','would',
  'could','should','very','just','been','being','both','after','before','over',
  'under','between','through','during','while','although','however','therefore',
])

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function getKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w))
}

function getSentences(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => {
      const wc = s.split(/\s+/).length
      return wc >= 8 && wc <= 40 && s.length > 30
    })
}

// ─── Core: build questions from any text ─────────────────────────────────────
function buildFromText(text, count = 5, sentencePool = null) {
  const sentences   = sentencePool && sentencePool.length >= 2 ? sentencePool : getSentences(text)
  if (sentences.length < 2) return []

  const allKeywords = [...new Set(getKeywords(text))]
  const questions   = []
  const pool        = shuffle(sentences).slice(0, count * 3)

  for (const sentence of pool) {
    const words = sentence.split(/\s+/)

    const candidates = words
      .map((w, i) => ({ raw: w, clean: w.replace(/[^a-zA-Z0-9]/g, ''), i }))
      .filter(({ clean }) =>
        clean.length > 3 &&
        !STOP_WORDS.has(clean.toLowerCase()) &&
        /^[a-zA-Z]/.test(clean)
      )

    if (candidates.length === 0) continue

    candidates.sort((a, b) => b.clean.length - a.clean.length)
    const target = candidates[0]
    const answer = target.clean

    const blanked = words
      .map((w, i) => i === target.i ? '______' : w)
      .join(' ')

    const wrongs = allKeywords
      .filter(w => w.toLowerCase() !== answer.toLowerCase() && w.length > 3)

    const wrongOptions = shuffle(wrongs).slice(0, 3)

    const fallbacks = ['process', 'system', 'method', 'concept', 'theory', 'structure']
    while (wrongOptions.length < 3) {
      const fb = fallbacks.find(f => !wrongOptions.includes(f) && f !== answer.toLowerCase())
      wrongOptions.push(fb || `option${wrongOptions.length + 1}`)
    }

    questions.push({
      id:          Date.now() + questions.length,
      question:    `Fill in the blank: "${blanked}"`,
      options:     shuffle([answer, ...wrongOptions]),
      answer,
      explanation: `The original sentence: "${sentence}"`,
    })

    if (questions.length === count) break
  }

  return questions
}

// ─── Difficulty filter ────────────────────────────────────────────────────────
// Easy   → short sentences (8-15 words), common words blanked
// Medium → medium sentences (15-25 words)
// Hard   → long sentences (25+ words), rare words blanked
function filterByDifficulty(sentences, difficulty) {
  if (difficulty === 'Easy')
    return sentences.filter(s => s.split(/\s+/).length <= 15)
  if (difficulty === 'Hard')
    return sentences.filter(s => s.split(/\s+/).length >= 20)
  return sentences // Medium — all
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function generateQuiz(input, count = 5, difficulty = 'Medium') {
  if (!input || !input.trim()) return []

  const lower     = input.toLowerCase()
  const wordCount = input.trim().split(/\s+/).length

  // 1. Short input (typed topic) → topic bank
  if (wordCount <= 10) {
    for (const entry of TOPIC_BANK) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        const qs = shuffle(entry.questions).slice(0, count)
        return qs.map((q, i) => ({ ...q, id: i + 1 }))
      }
    }
  }

  // 2. Long input (file text) → generate from content
  if (wordCount > 10) {
    const sentences = filterByDifficulty(getSentences(input), difficulty)
    const generated = buildFromText(input, count, sentences)
    if (generated.length >= 2) return generated

    // fallback: try topic bank on file content
    for (const entry of TOPIC_BANK) {
      if (entry.keywords.some(kw => lower.includes(kw))) {
        const qs = shuffle(entry.questions).slice(0, count)
        return qs.map((q, i) => ({ ...q, id: i + 1 }))
      }
    }
  }

  // 3. Unrecognised short topic fallback
  const topic = input.trim()
  return [
    { id: 1, question: `Which best describes "${topic}"?`, options: ['A field of study', 'A natural phenomenon', 'A historical event', 'A scientific process'], answer: 'A field of study', explanation: `"${topic}" is a subject with its own concepts and principles.` },
    { id: 2, question: `What is the best approach when studying "${topic}"?`, options: ['Understand core concepts', 'Memorise everything', 'Skip difficult parts', 'Study only before exams'], answer: 'Understand core concepts', explanation: 'Understanding core concepts is the foundation of mastering any subject.' },
    { id: 3, question: `Which habit helps most when learning "${topic}"?`, options: ['Regular practice', 'One-time reading', 'Avoiding revision', 'Passive listening'], answer: 'Regular practice', explanation: 'Regular practice and revision is the most effective learning strategy.' },
  ].slice(0, count)
}
