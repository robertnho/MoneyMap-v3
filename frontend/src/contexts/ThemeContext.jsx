import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const applyTheme = useCallback((darkMode) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(darkMode ? 'dark' : 'light')
    root.style.colorScheme = darkMode ? 'dark' : 'light'
    root.dataset.theme = darkMode ? 'dark' : 'light'
    root.style.setProperty('--app-background', darkMode ? '#020617' : '#f8fafc')
    root.style.setProperty('--app-surface', darkMode ? 'rgba(15, 23, 42, 0.9)' : '#ffffff')
    root.style.setProperty('--app-foreground', darkMode ? '#f8fafc' : '#0f172a')

    if (document.body) {
      document.body.classList.remove('dark', 'light')
      document.body.classList.add(darkMode ? 'dark' : 'light')
      document.body.dataset.theme = darkMode ? 'dark' : 'light'
      document.body.style.backgroundColor = darkMode ? '#020617' : '#f8fafc'
      document.body.style.color = darkMode ? '#f8fafc' : '#0f172a'
    }
  }, [])

  const persistTheme = useCallback((darkMode) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('moneymap-theme', darkMode ? 'dark' : 'light')
    } catch (error) {
      console.warn('Theme persistence failed:', error)
    }
  }, [])

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const savedTheme = localStorage.getItem('moneymap-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = savedTheme ? savedTheme === 'dark' : prefersDark
      return initial
    } catch (error) {
      console.warn('Theme detection failed:', error)
      return false
    }
  })

  useLayoutEffect(() => {
    applyTheme(isDark)
    persistTheme(isDark)
  }, [applyTheme, isDark, persistTheme])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  const setTheme = useCallback((theme) => {
    setIsDark(theme === 'dark')
  }, [])

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light',
    setTheme
  }), [isDark, toggleTheme, setTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}