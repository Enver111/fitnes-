import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthModalProvider, useAuthModal } from './auth/AuthModalContext'
import AuthModal from './components/auth/AuthModal'
import AppShell from './pages/AppShell'
import Landing from './pages/Landing'
import { ThemeProvider } from './theme/ThemeContext'

function AuthRoute({ mode }) {
  const navigate = useNavigate()
  const { openAuth } = useAuthModal()

  useEffect(() => {
    openAuth(mode)
    navigate('/', { replace: true })
  }, [mode, navigate, openAuth])

  return null
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthRoute mode="login" />} />
        <Route path="/register" element={<AuthRoute mode="register" />} />
        <Route path="/app" element={<AppShell />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthModalProvider>
          <AppRoutes />
        </AuthModalProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
