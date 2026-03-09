import type { ITranslationService } from '@/domain/i18n/ports/ITranslationService'
import type { Locale } from '@/domain/i18n/types/Locale'
import { DEFAULT_LOCALE } from '@/domain/i18n/types/Locale'
import { en } from './translations/en'
import { ptBR } from './translations/pt-BR'
import { storageService } from '../storage/StorageService'

const LOCALE_STORAGE_KEY = 'app_locale'

type TranslationObject = Record<string, any>

/**
 * Infrastructure: Translation Service Implementation
 * Provides translation functionality with locale management
 */
export class TranslationService implements ITranslationService {
  private currentLocale: Locale
  private translations: Record<Locale, TranslationObject>

  constructor() {
    this.translations = {
      'en': en,
      'pt-BR': ptBR
    }

    // Load saved locale or use default
    const savedLocale = storageService.get<Locale>(LOCALE_STORAGE_KEY)
    this.currentLocale = savedLocale || DEFAULT_LOCALE
  }

  getCurrentLocale(): Locale {
    return this.currentLocale
  }

  setLocale(locale: Locale): void {
    this.currentLocale = locale
    storageService.set(LOCALE_STORAGE_KEY, locale)
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }

  t(key: string, params?: Record<string, string | number>): string {
    const translation = this.getNestedTranslation(key)
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    // Replace parameters in translation
    if (params) {
      return this.replaceParams(translation, params)
    }

    return translation
  }

  has(key: string): boolean {
    return this.getNestedTranslation(key) !== null
  }

  private getNestedTranslation(key: string): string | null {
    const keys = key.split('.')
    const translations = this.translations[this.currentLocale]
    
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return null
      }
    }

    return typeof value === 'string' ? value : null
  }

  private replaceParams(text: string, params: Record<string, string | number>): string {
    let result = text
    
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
    }
    
    return result
  }
}

// Singleton instance
export const translationService = new TranslationService()
