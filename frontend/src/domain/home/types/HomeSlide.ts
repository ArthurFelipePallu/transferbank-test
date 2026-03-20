import type { RouteName } from '@/domain/navigation/types/RouteNames'
import type { IconName } from '@/utils/LucideIconMap'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

/**
 * Domain type for a home carousel slide.
 * Carries display data only — no HTTP or store knowledge.
 */
export interface HomeSlide {
  id: string
  imageUrl: string
  fallbackGradient: string
  eyebrowKey: TranslationKey
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  cta?: {
    labelKey: TranslationKey
    route: RouteName
    icon?: IconName
  }
}
