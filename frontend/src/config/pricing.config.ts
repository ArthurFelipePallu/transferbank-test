/**
 * Pricing Configuration
 * Centralized pricing constants and fee structures
 */

import { CurrencyCode } from '@/domain/pricing/entities/Currency'

/**
 * Fee structure for pricing calculations
 */
export const FEE_STRUCTURE = {
  /**
   * Spread percentage (1%)
   */
  SPREAD_PERCENTAGE: 0.01,
  
  /**
   * IOF (Imposto sobre Operações Financeiras) percentage (3.5%)
   */
  IOF_PERCENTAGE: 0.035,
} as const

/**
 * Base costs for account setup in different currencies
 */
export const BASE_COSTS: Record<CurrencyCode, number> = {
  [CurrencyCode.USD]: 100,
  [CurrencyCode.EUR]: 100,
  [CurrencyCode.GBP]: 100,
  [CurrencyCode.JPY]: 15000,
  [CurrencyCode.BTC]: 0.00153,
  [CurrencyCode.ETH]: 0.521,
} as const

/**
 * Get base cost for a currency
 */
export function getBaseCost(currencyCode: CurrencyCode): number {
  const cost = BASE_COSTS[currencyCode]
  if (cost === undefined) {
    throw new Error(`Base cost not defined for currency: ${currencyCode}`)
  }
  return cost
}

/**
 * Get fee structure
 */
export function getFeeStructure() {
  return FEE_STRUCTURE
}
