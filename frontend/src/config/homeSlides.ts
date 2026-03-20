import type { HomeSlide } from '@/domain/home/types/HomeSlide'
import { RouteName } from '@/domain/navigation/types/RouteNames'

/**
 * Home carousel slides configuration.
 * Single source of truth — add/remove/reorder slides here only.
 * Translation keys live in dashboard.home.slides.*
 */
export const homeSlides: HomeSlide[] = [
  {
    id: 'year-end-rates',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80&auto=format&fit=crop',
    fallbackGradient: 'linear-gradient(135deg, #440f47 0%, #2d0a4e 50%, #1c9c8c 100%)',
    eyebrowKey: 'dashboard.home.slides.yearEndRates.eyebrow',
    titleKey: 'dashboard.home.slides.yearEndRates.title',
    descriptionKey: 'dashboard.home.slides.yearEndRates.description',
    cta: {
      labelKey: 'dashboard.home.slides.yearEndRates.cta',
      route: RouteName.Investments,
      icon: 'TrendingUp',
    },
  },
  {
    id: 'zero-fee-transfers',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&auto=format&fit=crop',
    fallbackGradient: 'linear-gradient(135deg, #0f8e7f 0%, #1c9c8c 50%, #2d0a4e 100%)',
    eyebrowKey: 'dashboard.home.slides.zeroFee.eyebrow',
    titleKey: 'dashboard.home.slides.zeroFee.title',
    descriptionKey: 'dashboard.home.slides.zeroFee.description',
    cta: {
      labelKey: 'dashboard.home.slides.zeroFee.cta',
      route: RouteName.Transfers,
      icon: 'ArrowLeftRight',
    },
  },
  {
    id: 'partner-kyc',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80&auto=format&fit=crop',
    fallbackGradient: 'linear-gradient(135deg, #3e0c3f 0%, #440f47 50%, #0f8e7f 100%)',
    eyebrowKey: 'dashboard.home.slides.partnerKyc.eyebrow',
    titleKey: 'dashboard.home.slides.partnerKyc.title',
    descriptionKey: 'dashboard.home.slides.partnerKyc.description',
    cta: {
      labelKey: 'dashboard.home.slides.partnerKyc.cta',
      route: RouteName.PartnerEdit,
      icon: 'Users',
    },
  },
  {
    id: 'crypto-launch',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&q=80&auto=format&fit=crop',
    fallbackGradient: 'linear-gradient(135deg, #1c9c8c 0%, #21b8a6 50%, #440f47 100%)',
    eyebrowKey: 'dashboard.home.slides.crypto.eyebrow',
    titleKey: 'dashboard.home.slides.crypto.title',
    descriptionKey: 'dashboard.home.slides.crypto.description',
    cta: {
      labelKey: 'dashboard.home.slides.crypto.cta',
      route: RouteName.Accounts,
      icon: 'Bitcoin',
    },
  },
]
