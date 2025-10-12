import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import pt from './locales/pt/translation.json'
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'

const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('mm_language') : null

export const AVAILABLE_LANGUAGES = [
  { value: 'pt', label: pt['language.name'] },
  { value: 'en', label: en['language.name'] },
  { value: 'es', label: es['language.name'] },
]

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
}

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage || 'pt',
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
  keySeparator: false,
  returnNull: false,
})

export default i18n
