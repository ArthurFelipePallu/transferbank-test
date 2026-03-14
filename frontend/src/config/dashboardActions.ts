import type { QuickAction } from '@/components/Dashboard/QuickActionsCard.vue'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

/**
 * Dashboard Quick Actions Configuration
 * Domain Layer - Configuration
 * Following DDD principles - Single Source of Truth
 */

export const dashboardActionsConfig: QuickAction[] = [
  {
    title: 'dashboard.registerPartners' as TranslationKey,
    description: 'dashboard.addPartners' as TranslationKey,
    route: 'partner-registration',
    variant: 'primary',
  },
  {
    title: 'dashboard.manageAccounts' as TranslationKey,
    description: 'dashboard.viewAccounts' as TranslationKey,
    route: 'accounts',
  },
  {
    title: 'dashboard.makeTransfer' as TranslationKey,
    description: 'dashboard.transferFunds' as TranslationKey,
    route: 'transfers',
  },
  {
    title: 'dashboard.getSupport' as TranslationKey,
    description: 'dashboard.accessHelp' as TranslationKey,
    route: 'help-center',
  },
]
