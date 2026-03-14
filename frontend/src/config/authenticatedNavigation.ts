import type { MenuItem } from '@/domain/navigation/types/MenuItem'

/**
 * Authenticated Navigation Configuration
 * Domain Layer - Configuration
 * Following DDD principles - Single Source of Truth
 */

export const authenticatedNavigationConfig = {
  services: [
    { label: 'Accounts', route: 'accounts' },
    { label: 'Transfers', route: 'transfers' },
    { label: 'Loans', route: 'loans' },
    { label: 'Investments', route: 'investments' },
  ] as MenuItem[],

  support: [
    { label: 'Help Center', route: 'help-center' },
    { label: 'Security', route: 'security' },
    { label: 'Contact Us', route: 'contact-us' },
  ] as MenuItem[],
}
