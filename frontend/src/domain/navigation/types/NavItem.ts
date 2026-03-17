import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

/**
 * Domain type for a navigable item.
 * routeName maps to a named Vue Router route.
 * variant controls visual presentation — kept here because it's part of
 * the navigation contract, not a styling detail.
 */
export interface NavItem {
  label: TranslationKey
  routeName: string
  variant?: 'default' | 'ghost' | 'primary'
  icon?: string
  isDanger?: boolean
}
