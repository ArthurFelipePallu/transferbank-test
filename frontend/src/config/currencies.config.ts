/**
 * Centralized Currency Configuration
 * Single source of truth for all currency-related data
 */

import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { IconName } from '@/utils/LucideIconMap'

export interface CurrencyMetadata {
  code: CurrencyCode
  name: string
  symbol: string
  iconName?: IconName
  fallbackRate: number
  apiIdentifier?: string // For API calls (e.g., CoinGecko ID)
}

export const CURRENCIES_CONFIG: Record<CurrencyCode, CurrencyMetadata> = {
  [CurrencyCode.USD]: {
    code: CurrencyCode.USD,
    name: 'US Dollar',
    symbol: '$',
    iconName: 'DollarSign',
    fallbackRate: 5.0,
    apiIdentifier: 'usd',
  },
  [CurrencyCode.EUR]: {
    code: CurrencyCode.EUR,
    name: 'Euro',
    symbol: '€',
    iconName: 'Euro',
    fallbackRate: 5.5,
    apiIdentifier: 'eur',
  },
  [CurrencyCode.GBP]: {
    code: CurrencyCode.GBP,
    name: 'British Pound',
    symbol: '£',
    iconName: 'PoundSterling',
    fallbackRate: 6.3,
    apiIdentifier: 'gbp',
  },
  [CurrencyCode.JPY]: {
    code: CurrencyCode.JPY,
    name: 'Japanese Yen',
    symbol: '¥',
    fallbackRate: 0.034,
    apiIdentifier: 'jpy',
  },
  [CurrencyCode.BTC]: {
    code: CurrencyCode.BTC,
    name: 'Bitcoin',
    symbol: '₿',
    iconName: 'Bitcoin',
    fallbackRate: 350000,
    apiIdentifier: 'bitcoin',
  },
  [CurrencyCode.ETH]: {
    code: CurrencyCode.ETH,
    name: 'Ethereum',
    symbol: 'Ξ',
    fallbackRate: 12000,
    apiIdentifier: 'ethereum',
  },
}

/**
 * Get currency metadata by code
 */
export function getCurrencyMetadata(code: CurrencyCode): CurrencyMetadata {
  const metadata = CURRENCIES_CONFIG[code]
  if (!metadata) {
    throw new Error(`No metadata found for currency: ${code}`)
  }
  return metadata
}

/**
 * Get all supported currencies
 */
export function getAllCurrencies(): CurrencyMetadata[] {
  return Object.values(CURRENCIES_CONFIG)
}

/**
 * Get currencies for display (those with icons or symbols)
 */
export function getDisplayCurrencies(): CurrencyMetadata[] {
  return getAllCurrencies()
}

/**
 * Get fallback rate for a currency
 */
export function getFallbackRate(code: CurrencyCode): number {
  return getCurrencyMetadata(code).fallbackRate
}
