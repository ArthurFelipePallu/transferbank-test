/**
 * Domain: Supported Locales
 */
export type Locale = 'en' | 'pt-BR'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'pt-BR']

export const DEFAULT_LOCALE: Locale = 'en'

export interface LocaleInfo {
  code: Locale
  name: string
  flag: string
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  'en': {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Português',
    flag: '🇧🇷'
  }
}
