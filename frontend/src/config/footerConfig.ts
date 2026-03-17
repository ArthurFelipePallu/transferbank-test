import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

export interface FooterLink {
  name: string
  labelKey: TranslationKey
}

export interface FooterLinkGroup {
  titleKey: TranslationKey
  links: FooterLink[]
}

export interface FooterContact {
  email: string
  phone: string
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    titleKey: 'footer.services',
    links: [
      { name: 'accounts',    labelKey: 'navigation.accounts' },
      { name: 'transfers',   labelKey: 'navigation.transfers' },
      { name: 'loans',       labelKey: 'navigation.loans' },
      { name: 'investments', labelKey: 'navigation.investments' },
    ],
  },
  {
    titleKey: 'footer.support',
    links: [
      { name: 'help-center',  labelKey: 'navigation.helpCenter' },
      { name: 'security',     labelKey: 'navigation.security' },
      { name: 'report-fraud', labelKey: 'footer.reportFraud' },
      { name: 'contact-us',   labelKey: 'navigation.contactUs' },
    ],
  },
]

export const footerContact: FooterContact = {
  email: 'support@mediteranian.com',
  phone: '+1 234 567 890',
}
