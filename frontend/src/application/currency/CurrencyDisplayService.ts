/**
 * Currency Display Service - Application Layer
 * Orchestrates currency display logic following DDD principles
 */

import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import { CurrencyDisplayConfig, type CurrencyDisplayInfo } from '@/domain/currency/entities/CurrencyDisplayConfig'
import type { IconName } from '@/utils/LucideIconMap'

export interface CurrencyCardData {
  code: CurrencyCode
  name: string
  iconName?: IconName
  symbol: string
}

export class CurrencyDisplayService {
  /**
   * Get all currencies that should be displayed
   * Single source of truth for which currencies to show
   */
  static getDisplayCurrencies(): CurrencyCardData[] {
    return CurrencyDisplayConfig.getAllDisplayConfigs().map(config => ({
      code: config.code,
      name: config.name,
      iconName: config.iconName,
      symbol: config.symbol,
    }))
  }

  /**
   * Get display information for a specific currency
   */
  static getCurrencyDisplay(code: CurrencyCode): CurrencyCardData {
    const config = CurrencyDisplayConfig.getDisplayInfo(code)
    return {
      code: config.code,
      name: config.name,
      iconName: config.iconName,
      symbol: config.symbol,
    }
  }

  /**
   * Get list of currency codes to fetch rates for
   */
  static getCurrencyCodesToFetch(): CurrencyCode[] {
    return CurrencyDisplayConfig.getSupportedCurrencies()
  }
}
