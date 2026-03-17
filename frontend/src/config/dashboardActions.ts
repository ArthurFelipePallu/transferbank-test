import type { QuickAction } from '@/components/Dashboard/QuickActionsCard.vue'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import { RouteName } from '@/domain/navigation/types/RouteNames'

/**
 * Dashboard Quick Actions Configuration
 * Domain Layer - Configuration
 * Following DDD principles - Single Source of Truth
 */

export const dashboardActionsConfig: QuickAction[] = [
  {
    title: 'dashboard.registerPartners' as TranslationKey,
    description: 'dashboard.addPartners' as TranslationKey,
    route: RouteName.PartnerRegistration,
    variant: 'primary',
  },
  {
    title: 'dashboard.manageAccounts' as TranslationKey,
    description: 'dashboard.viewAccounts' as TranslationKey,
    route: RouteName.Accounts,
  },
  {
    title: 'dashboard.makeTransfer' as TranslationKey,
    description: 'dashboard.transferFunds' as TranslationKey,
    route: RouteName.Transfers,
  },
  {
    title: 'dashboard.getSupport' as TranslationKey,
    description: 'dashboard.accessHelp' as TranslationKey,
    route: RouteName.HelpCenter,
  },
]
