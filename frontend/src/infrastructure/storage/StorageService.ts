/**
 * Storage Service - Infrastructure Layer
 * Provides abstraction over localStorage with type safety and error handling
 * Follows DDD principles by isolating infrastructure concerns
 */

export interface IStorageService {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
  has(key: string): boolean
}

class LocalStorageService implements IStorageService {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error)
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Failed to remove item from localStorage: ${key}`, error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage', error)
    }
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  }
}

// Singleton instance
export const storageService: IStorageService = new LocalStorageService()

// Storage keys constants - Single source of truth
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
  ONBOARDING_DATA: 'onboarding_data',
  ONBOARDING_FORM_CACHE: 'onboarding_form_cache',
  PARTNER_FORM_CACHE: 'partner_form_cache',
  APP_LOCALE: 'app_locale',
} as const
