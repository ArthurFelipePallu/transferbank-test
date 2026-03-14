import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

export interface NavLink {
  label: TranslationKey
  routeName: string
  variant?: 'default' | 'ghost' | 'primary'
}

export interface NavigationConfig {
  mainLinks: NavLink[]
  authLinks: NavLink[]
}

export const navigationConfig: NavigationConfig = {
  mainLinks: [
    { label: 'navigation.companies', routeName: 'companies' },
    { label: 'navigation.solutions', routeName: 'solutions' },
    { label: 'navigation.pricing', routeName: 'pricing' },
    { label: 'navigation.resources', routeName: 'resources' },
  ],
  authLinks: [
    { label: 'navigation.login', routeName: 'login', variant: 'ghost' },
    { label: 'navigation.openAccount', routeName: 'home', variant: 'primary' },
  ],
}
