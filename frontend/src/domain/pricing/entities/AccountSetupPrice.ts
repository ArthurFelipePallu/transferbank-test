/**
 * Account Setup Price Entity - Domain Model
 * Represents the price for account setup with fees
 */

import { Currency, CurrencyCode } from './Currency'
import { BASE_COSTS, FEE_STRUCTURE, getBaseCost } from '@/config/pricing.config'

export interface FeeStructure {
  spreadPercentage: number
  iofPercentage: number
}

export class AccountSetupPrice {
  constructor(
    private readonly fees: FeeStructure = {
      spreadPercentage: FEE_STRUCTURE.SPREAD_PERCENTAGE,
      iofPercentage: FEE_STRUCTURE.IOF_PERCENTAGE,
    }
  ) {}

  /**
   * Calculate the final price in BRL from multiple currency options
   * Selects the most favorable rate (lowest cost)
   */
  calculateFromCurrencies(currencies: Currency[]): {
    finalPriceBRL: number
    selectedCurrency: CurrencyCode
    breakdown: PriceBreakdown
  } {
    if (currencies.length === 0) {
      throw new Error('At least one currency must be provided')
    }

    // Calculate cost for each currency
    const costs = currencies.map((currency) => ({
      currency: currency.code,
      baseCost: this.getBaseCost(currency.code),
      costInBRL: this.calculateBaseCost(currency),
    }))

    // Select the most favorable (lowest cost)
    const mostFavorable = costs.reduce((min, current) =>
      current.costInBRL < min.costInBRL ? current : min
    )

    // Apply fees
    const costWithSpread = this.applySpread(mostFavorable.costInBRL)
    const finalCost = this.applyIOF(costWithSpread)
    const finalPriceBRL = this.roundUp(finalCost)

    return {
      finalPriceBRL,
      selectedCurrency: mostFavorable.currency,
      breakdown: {
        baseCostBRL: mostFavorable.costInBRL,
        spreadAmount: costWithSpread - mostFavorable.costInBRL,
        iofAmount: finalCost - costWithSpread,
        totalFees: finalCost - mostFavorable.costInBRL,
        finalPrice: finalPriceBRL,
      },
    }
  }

  private getBaseCost(currencyCode: CurrencyCode): number {
    return getBaseCost(currencyCode)
  }

  private calculateBaseCost(currency: Currency): number {
    const baseAmount = this.getBaseCost(currency.code)
    return currency.convertToBRL(baseAmount)
  }

  private applySpread(amount: number): number {
    return amount * (1 + this.fees.spreadPercentage)
  }

  private applyIOF(amount: number): number {
    return amount * (1 + this.fees.iofPercentage)
  }

  private roundUp(amount: number): number {
    return Math.ceil(amount * 100) / 100
  }
}

export interface PriceBreakdown {
  baseCostBRL: number
  spreadAmount: number
  iofAmount: number
  totalFees: number
  finalPrice: number
}
