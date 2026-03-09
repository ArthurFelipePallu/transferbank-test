import { ref, computed } from 'vue'
import { translationService } from '@/infrastructure/i18n/TranslationService'
import type { Locale } from '@/domain/i18n/types/Locale'
import { LOCALE_INFO } from '@/domain/i18n/types/Locale'

/**
 * Composable: Translation Hook
 * Provides reactive translation functionality
 */
export const useTranslation = () => {
  const currentLocale = ref(translationService.getCurrentLocale())

  const localeInfo = computed(() => LOCALE_INFO[currentLocale.value])

  const t = (key: string, params?: Record<string, string | number>): string => {
    return translationService.t(key, params)
  }

  const setLocale = (locale: Locale) => {
    translationService.setLocale(locale)
    currentLocale.value = locale
  }

  const has = (key: string): boolean => {
    return translationService.has(key)
  }

  return {
    t,
    currentLocale,
    localeInfo,
    setLocale,
    has,
  }
}
