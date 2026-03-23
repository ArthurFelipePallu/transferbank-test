import type { Locale } from '../types/Locale'
import type { TranslationKey } from '@/domain/i18n/types/TranslationKey'

/**
 * Port: Translation Service Interface
 * Defines the contract for translation operations
 */
export interface ITranslationService {
  getCurrentLocale(): Locale
  setLocale(locale: Locale): void
  t(key: TranslationKey, params?: Record<string, string | number>): string
  has(key: TranslationKey): boolean
}
