/**
 * TranslationKey — Domain Layer
 *
 * Defines the type for all valid translation key paths.
 * Lives in the domain layer so domain types (e.g. OnboardingFormStep)
 * can reference it without depending on infrastructure.
 *
 * The actual key set is derived from the EN translation object in infrastructure,
 * but the type alias is re-exported here so domain code stays infrastructure-free.
 */
export type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
