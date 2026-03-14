/**
 * Currency Display Configuration - Domain Model
 * Defines how currencies should be displayed in the UI
 */

import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { IconName } from '@/utils/LucideIconMap'

export interface CurrencyDisplayInfo {
  code: CurrencyCode
  name: string
  iconName?: IconName // Lucide icon name (optional)
  symbol: string // Fallback text symbol
}

export class CurrencyDisplayConfig {
  private static readonly configurations: Map<CurrencyCode, CurrencyDisplayInfo> = new Map([
    [
      CurrencyCode.USD,
      {
        code: CurrencyCode.USD,
        name: 'US Dollar',
        iconName: 'DollarSign',
        symbol: '$',
      },
    ],
    [
      CurrencyCode.EUR,
      {
        code: CurrencyCode.EUR,
        name: 'Euro',
        iconName: 'Euro',
        symbol: '€',
      },
    ],
    [
      CurrencyCode.GBP,
      {
        code: CurrencyCode.GBP,
        name: 'British Pound',
        iconName: 'PoundSterling',
        symbol: '£',
      },
    ],
    [
      CurrencyCode.BTC,
      {
        code: CurrencyCode.BTC,
        name: 'Bitcoin',
        iconName: 'Bitcoin',
        symbol: '₿',
      },
    ],
    [
      CurrencyCode.ETH,
      {
        code: CurrencyCode.ETH,
        name: 'Ethereum',
        symbol: 'Ξ',
      },
    ],
  ])

  static getDisplayInfo(code: CurrencyCode): CurrencyDisplayInfo {
    const info = this.configurations.get(code)
    if (!info) {
      throw new Error(`No display configuration found for currency: ${code}`)
    }
    return info
  }

  static getAllDisplayConfigs(): CurrencyDisplayInfo[] {
    return Array.from(this.configurations.values())
  }

  static getSupportedCurrencies(): CurrencyCode[] {
    return Array.from(this.configurations.keys())
  }
}
