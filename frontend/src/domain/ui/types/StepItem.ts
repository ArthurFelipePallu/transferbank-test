import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

/** Generic step descriptor — used by any multi-step flow (onboarding, partner registration, etc.) */
export interface StepItem {
  id: number
  title: TranslationKey
  isCompleted: boolean
}
