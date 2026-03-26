import { createContext, useContext, useState } from 'react'

const PomodoroContext = createContext()

export function PomodoroProvider({ children }) {
  const [pomodoroState, setPomodoroState] = useState('idle') // idle | running | paused | finished
  const [sessions,      setSessions]      = useState(0)
  const [showTimer,     setShowTimer]     = useState(false)

  const isMoodBoosterBlocked = pomodoroState === 'running' || pomodoroState === 'paused'

  return (
    <PomodoroContext.Provider value={{
      pomodoroState, setPomodoroState,
      sessions, setSessions,
      showTimer, setShowTimer,
      isMoodBoosterBlocked,
    }}>
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoro = () => useContext(PomodoroContext)
