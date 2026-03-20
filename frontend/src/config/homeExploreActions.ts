import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import type { IconName } from '@/utils/LucideIconMap'
import { RouteName } from '@/domain/navigation/types/RouteNames'

/**
 * Domain config for the authenticated home "Explore" section.
 * Each entry maps to an ActionCard with the fill-slide animation.
 * Data flows down via props — no component reaches into this config directly.
 */
export interface ExploreAction {
  title: TranslationKey
  description: TranslationKey
  route: RouteName
  icon: IconName
  variant?: 'default' | 'primary'
}

export const homeExploreActions: ExploreAction[] = [
  {
    title: 'dashboard.home.explore.investments.title',
    description: 'dashboard.home.explore.investments.description',
    route: RouteName.Investments,
    icon: 'TrendingUp',
    variant: 'primary',
  },
  {
    title: 'dashboard.home.explore.activityHistory.title',
    description: 'dashboard.home.explore.activityHistory.description',
    route: RouteName.ActivityHistory,
    icon: 'BarChart3',
  },
  {
    title: 'dashboard.home.explore.newsletter.title',
    description: 'dashboard.home.explore.newsletter.description',
    route: RouteName.Newsletter,
    icon: 'Mail',
  },
  {
    title: 'dashboard.home.explore.products.title',
    description: 'dashboard.home.explore.products.description',
    route: RouteName.Products,
    icon: 'Gem',
  },
  {
    title: 'dashboard.home.explore.bankContent.title',
    description: 'dashboard.home.explore.bankContent.description',
    route: RouteName.BankContent,
    icon: 'Landmark',
  },
]
