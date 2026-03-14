import type { QuickAction } from '@/components/Dashboard/QuickActionsCard.vue'

/**
 * Dashboard Quick Actions Configuration
 * Domain Layer - Configuration
 * Following DDD principles - Single Source of Truth
 */

export const dashboardActionsConfig: QuickAction[] = [
  {
    title: 'dashboard.registerPartners',
    description: 'dashboard.addPartners',
    route: 'partner-registration',
    variant: 'primary',
  },
  {
    title: 'dashboard.manageAccounts',
    description: 'dashboard.viewAccounts',
    route: 'accounts',
  },
  {
    title: 'dashboard.makeTransfer',
    description: 'dashboard.transferFunds',
    route: 'transfers',
  },
  {
    title: 'dashboard.getSupport',
    description: 'dashboard.accessHelp',
    route: 'help-center',
  },
]
