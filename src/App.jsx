import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { MoodThemeProvider } from './context/MoodThemeContext'
import { PomodoroProvider } from './context/PomodoroContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import Quiz from './pages/Quiz'
import MoodBooster from './pages/MoodBooster'
import About from './pages/About'
import WellnessZone from './pages/WellnessZone'
import StudyGoals from './pages/StudyGoals'
import Roadmap from './pages/Roadmap'
import Login from './pages/Login'
import Signup from './pages/Signup'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/"    element={<Navigate to="/login" replace />} />
           <Route path="/login"   element={<Login />} />
          <Route path="/signup"   element={<Signup />} />
            <Route path="/home"     element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/chatbot"  element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/quiz"     element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/mood"     element={<ProtectedRoute><MoodBooster /></ProtectedRoute>} />
          <Route path="/about"    element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute><WellnessZone /></ProtectedRoute>} />
          <Route path="/goals"    element={<ProtectedRoute><StudyGoals /></ProtectedRoute>} />
          <Route path="/roadmap"  element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
          <Route path="*"         element={<Navigate to="/login" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MoodThemeProvider>
          <PomodoroProvider>
            <Navbar />
            <main className="min-h-screen transition-all duration-700">
              <AnimatedRoutes />
            </main>
            <Footer />
          </PomodoroProvider>
        </MoodThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
