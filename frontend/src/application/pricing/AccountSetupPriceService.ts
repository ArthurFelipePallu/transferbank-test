/**
 * Account Setup Price Service - Application Layer
 * Orchestrates the pricing calculation using domain entities and infrastructure
 * Following Single Responsibility Principle (SOLID)
 */

import { AccountSetupPrice } from '@/domain/pricing/entities/AccountSetupPrice'
import type { ICurrencyRateProvider } from '@/domain/pricing/interfaces/ICurrencyRateProvider'
import type { CurrencyCode } from '@/domain/pricing/entities/Currency'

export interface AccountSetupPriceResult {
  priceBRL: number
  selectedCurrency: CurrencyCode
  lastUpdated: Date
  breakdown: {
    baseCostBRL: number
    spreadAmount: number
    iofAmount: number
    totalFees: number
  }
}

export class AccountSetupPriceService {
  private readonly accountSetupPrice: AccountSetupPrice

  constructor(private readonly currencyRateProvider: ICurrencyRateProvider) {
    this.accountSetupPrice = new AccountSetupPrice()
  }

  /**
   * Get current account setup price in BRL
   */
  async getCurrentPrice(): Promise<AccountSetupPriceResult> {
    // Fetch current rates from provider
    const currencies = await this.currencyRateProvider.fetchRates()

    // Calculate price using domain logic
    const result = this.accountSetupPrice.calculateFromCurrencies(currencies)

    return {
      priceBRL: result.finalPriceBRL,
      selectedCurrency: result.selectedCurrency,
      lastUpdated: new Date(),
      breakdown: {
        baseCostBRL: result.breakdown.baseCostBRL,
        spreadAmount: result.breakdown.spreadAmount,
        iofAmount: result.breakdown.iofAmount,
        totalFees: result.breakdown.totalFees,
      },
    }
  }

  /**
   * Format price as Brazilian currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }
}
