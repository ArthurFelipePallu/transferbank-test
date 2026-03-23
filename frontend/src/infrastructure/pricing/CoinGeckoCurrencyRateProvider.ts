/**
 * CoinGecko Currency Rate Provider - Infrastructure Layer
 * Proxies all rate requests through the backend to avoid browser CORS restrictions.
 */

import { Currency, CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { ICurrencyRateProvider } from '@/domain/pricing/interfaces/ICurrencyRateProvider'
import { CURRENCIES_CONFIG } from '@/config/currencies.config'
import { axiosInstance } from '@/api/axiosInstance'

const CURRENCY_RATES_ENDPOINT = '/api/currency/rates'

interface BackendRatesResponse {
  bitcoin:  number | null
  ethereum: number | null
  usd:      number | null
  eur:      number | null
  gbp:      number | null
}

export class CoinGeckoCurrencyRateProvider implements ICurrencyRateProvider {
  private readonly fallbackRates: Map<CurrencyCode, number> = new Map(
    Object.values(CURRENCIES_CONFIG).map(config => [config.code, config.fallbackRate])
  )

  async fetchRates(): Promise<Currency[]> {
    try {
      const response = await axiosInstance.get<BackendRatesResponse>(CURRENCY_RATES_ENDPOINT)
      const d = response.data
      const now = new Date()
      const currencies: Currency[] = []

      if (d.bitcoin)  currencies.push(new Currency(CurrencyCode.BTC, d.bitcoin,  now))
      if (d.ethereum) currencies.push(new Currency(CurrencyCode.ETH, d.ethereum, now))
      if (d.usd)      currencies.push(new Currency(CurrencyCode.USD, d.usd,      now))
      if (d.eur)      currencies.push(new Currency(CurrencyCode.EUR, d.eur,      now))
      if (d.gbp)      currencies.push(new Currency(CurrencyCode.GBP, d.gbp,      now))

      return currencies.length > 0 ? currencies : this.getFallbackRates()
    } catch {
      return this.getFallbackRates()
    }
  }

  private getFallbackRates(): Currency[] {
    const now = new Date()
    return Array.from(this.fallbackRates.entries()).map(
      ([code, rate]) => new Currency(code, rate, now)
    )
  }
}