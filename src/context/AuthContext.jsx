import { createContext, useContext, useState } from 'react'
import { apiLogin, apiSignup } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhi-user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const signup = async (name, email, password) => {
    const data = await apiSignup(name, email, password)
    if (data.error) return { error: data.error }
    localStorage.setItem('sakhi-user', JSON.stringify(data.user))
    setUser(data.user)
    return { success: true }
  }

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    if (data.error) return { error: data.error }
    localStorage.setItem('sakhi-user', JSON.stringify(data.user))
    setUser(data.user)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('sakhi-user')
    localStorage.removeItem('userMood')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
