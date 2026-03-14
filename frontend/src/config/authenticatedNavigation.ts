import type { MenuItem } from '@/domain/navigation/types/MenuItem'

/**
 * Authenticated Navigation Configuration
 * Domain Layer - Configuration
 * Following DDD principles - Single Source of Truth
 */

export const authenticatedNavigationConfig = {
  services: [
    { label: 'navigation.accounts', route: 'accounts' },
    { label: 'navigation.transfers', route: 'transfers' },
    { label: 'navigation.loans', route: 'loans' },
    { label: 'navigation.investments', route: 'investments' },
  ] as MenuItem[],

  support: [
    { label: 'navigation.helpCenter', route: 'help-center' },
    { label: 'navigation.security', route: 'security' },
    { label: 'navigation.contactUs', route: 'contact-us' },
  ] as MenuItem[],
}
