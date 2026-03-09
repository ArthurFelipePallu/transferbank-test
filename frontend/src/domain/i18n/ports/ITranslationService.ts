import type { Locale } from '../types/Locale'

/**
 * Port: Translation Service Interface
 * Defines the contract for translation operations
 */
export interface ITranslationService {
  /**
   * Get current locale
   */
  getCurrentLocale(): Locale

  /**
   * Set current locale
   */
  setLocale(locale: Locale): void

  /**
   * Translate a key with optional parameters
   */
  t(key: string, params?: Record<string, string | number>): string

  /**
   * Check if a translation key exists
   */
  has(key: string): boolean
}
