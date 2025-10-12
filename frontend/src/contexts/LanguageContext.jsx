import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import i18n, { AVAILABLE_LANGUAGES } from '../i18n/index.js'

const LanguageContext = createContext({
  language: 'pt',
  setLanguage: () => {},
  languages: AVAILABLE_LANGUAGES,
})

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'pt'
    return localStorage.getItem('mm_language') || i18n.language || 'pt'
  })

  useEffect(() => {
    i18n.changeLanguage(language).catch((error) => {
      console.error('Erro ao alterar idioma', error)
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_language', language)
    }
  }, [language])

  const setLanguage = useMemo(
    () => (lang) => {
      setLanguageState(lang)
    },
    []
  )

  const value = useMemo(
    () => ({ language, setLanguage, languages: AVAILABLE_LANGUAGES }),
    [language, setLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export default LanguageContext
