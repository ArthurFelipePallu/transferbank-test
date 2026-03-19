import { ref, computed } from 'vue'
import { translationService } from '@/infrastructure/i18n/TranslationService'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import type { Locale } from '@/domain/i18n/types/Locale'
import { LOCALE_INFO } from '@/domain/i18n/types/Locale'

/**
 * Composable: Translation Hook
 * Provides reactive translation functionality
 */
export const useTranslation = () => {
  const currentLocale = ref(translationService.getCurrentLocale())

  const localeInfo = computed(() => LOCALE_INFO[currentLocale.value])

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    return translationService.t(key, params)
  }

  const setLocale = (locale: Locale) => {
    translationService.setLocale(locale)
    currentLocale.value = locale
  }

  const has = (key: TranslationKey): boolean => {
    return translationService.has(key)
  }

  /**
   * Resolves a vee-validate error string that may be a VM translation key.
   * VM keys use the format: "validation.someKey|param1=value1,param2=value2"
   * Plain strings (not dot-notation keys) are returned as-is.
   */
  const tError = (msg: string): string => {
    const [key, paramStr] = msg.split('|')
    if (!key?.includes('.')) return msg
    const params: Record<string, string> = {}
    if (paramStr) {
      for (const pair of paramStr.split(',')) {
        const [k, v] = pair.split('=')
        if (k && v !== undefined) params[k] = v
      }
    }
    return t(key as TranslationKey, params)
  }

  return {
    t,
    tError,
    currentLocale,
    localeInfo,
    setLocale,
    has,
  }
}
