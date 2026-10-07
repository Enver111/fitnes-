import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('register')

  const openAuth = useCallback((nextMode = 'register') => {
    setMode(nextMode === 'login' ? 'login' : 'register')
    setOpen(true)
  }, [])

  const closeAuth = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, mode, setMode, openAuth, closeAuth }),
    [open, mode, openAuth, closeAuth],
  )

  return (
    <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider')
  return ctx
}
