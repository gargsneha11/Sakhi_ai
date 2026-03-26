import { createContext, useContext, useEffect, useState } from 'react'

const MoodThemeContext = createContext()

export const moodThemes = {
  Happy: {
    bg:        'mood-happy',
    label:     'Happy',
    emoji:     '😊',
  },
  Sad: {
    bg:        'mood-sad',
    label:     'Sad',
    emoji:     '😢',
  },
  Stressed: {
    bg:        'mood-stressed',
    label:     'Stressed',
    emoji:     '😤',
  },
  Anxious: {
    bg:        'mood-anxious',
    label:     'Anxious',
    emoji:     '😰',
  },
  Bored: {
    bg:        'mood-bored',
    label:     'Bored',
    emoji:     '😑',
  },
  Motivated: {
    bg:        'mood-motivated',
    label:     'Motivated',
    emoji:     '🔥',
  },
  Neutral: {
    bg:        'mood-neutral',
    label:     'Neutral',
    emoji:     '😐',
  },
}

export function MoodThemeProvider({ children }) {
  const [mood, setMoodState] = useState(
    () => localStorage.getItem('userMood') || null
  )

  function setMood(m) {
    setMoodState(m)
    if (m) localStorage.setItem('userMood', m)
  }

  // Apply mood class to <body>
  useEffect(() => {
    const body = document.body
    // Remove all mood classes
    Object.values(moodThemes).forEach(t => body.classList.remove(t.bg))
    if (mood && moodThemes[mood]) {
      body.classList.add(moodThemes[mood].bg)
    }
  }, [mood])

  return (
    <MoodThemeContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodThemeContext.Provider>
  )
}

export const useMoodTheme = () => useContext(MoodThemeContext)
