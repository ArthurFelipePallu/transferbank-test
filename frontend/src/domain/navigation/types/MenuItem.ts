import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

/**
 * Menu Item Types - Domain Layer
 * Defines the structure of navigation menu items
 */

export interface MenuItem {
  label: TranslationKey
  route?: string
  icon?: string
  children?: MenuItem[]
  isDanger?: boolean
}

export interface MenuSection {
  items: MenuItem[]
}
