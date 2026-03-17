import type { TranslationKey } from '@/infrastructure/i18n/translations/en'
import type { IconName } from '@/utils/LucideIconMap'

export interface LandingFeature {
  icon: IconName
  titleKey: TranslationKey
  descriptionKey: TranslationKey
}

export interface LandingStat {
  value: string
  labelKey: TranslationKey
}

export interface LandingService {
  icon: IconName
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  routeName: string
}

export const landingFeatures: LandingFeature[] = [
  { icon: 'Bitcoin',     titleKey: 'landing.features.items.crypto.title',      descriptionKey: 'landing.features.items.crypto.description' },
  { icon: 'Shield',      titleKey: 'landing.features.items.secure.title',      descriptionKey: 'landing.features.items.secure.description' },
  { icon: 'Zap',         titleKey: 'landing.features.items.fast.title',        descriptionKey: 'landing.features.items.fast.description' },
  { icon: 'CheckCircle', titleKey: 'landing.features.items.compliance.title',  descriptionKey: 'landing.features.items.compliance.description' },
  { icon: 'Users',       titleKey: 'landing.features.items.partners.title',    descriptionKey: 'landing.features.items.partners.description' },
  { icon: 'Headphones',  titleKey: 'landing.features.items.support.title',     descriptionKey: 'landing.features.items.support.description' },
]

export const landingStats: LandingStat[] = [
  { value: '12,000+', labelKey: 'landing.stats.companies' },
  { value: '$4.2B+',  labelKey: 'landing.stats.transactions' },
  { value: '38',      labelKey: 'landing.stats.countries' },
  { value: '99.98%',  labelKey: 'landing.stats.uptime' },
]

export const landingServices: LandingService[] = [
  { icon: 'Building2',  titleKey: 'landing.services.accounts.title',     descriptionKey: 'landing.services.accounts.description',     routeName: 'accounts' },
  { icon: 'Globe',      titleKey: 'landing.services.transfers.title',    descriptionKey: 'landing.services.transfers.description',    routeName: 'transfers' },
  { icon: 'CreditCard', titleKey: 'landing.services.loans.title',        descriptionKey: 'landing.services.loans.description',        routeName: 'loans' },
  { icon: 'BarChart3',  titleKey: 'landing.services.investments.title',  descriptionKey: 'landing.services.investments.description',  routeName: 'investments' },
]
