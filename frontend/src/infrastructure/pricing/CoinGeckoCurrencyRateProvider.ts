/**
 * CoinGecko Currency Rate Provider - Infrastructure Layer
 * Concrete implementation of ICurrencyRateProvider using CoinGecko API
 */

import { Currency, CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { ICurrencyRateProvider } from '@/domain/pricing/interfaces/ICurrencyRateProvider'
import { CURRENCIES_CONFIG } from '@/config/currencies.config'

interface CoinGeckoResponse {
  bitcoin?: { brl: number }
  ethereum?: { brl: number }
}

interface ExchangeRateResponse {
  rates?: {
    BRL?: number
  }
}

export class CoinGeckoCurrencyRateProvider implements ICurrencyRateProvider {
  private readonly cryptoApiUrl = 'https://api.coingecko.com/api/v3/simple/price'
  private readonly exchangeApiUrl = 'https://api.exchangerate-api.com/v4/latest'
  
  // Use centralized fallback rates from config
  private readonly fallbackRates: Map<CurrencyCode, number> = new Map(
    Object.values(CURRENCIES_CONFIG).map(config => [config.code, config.fallbackRate])
  )

  async fetchRates(): Promise<Currency[]> {
    try {
      const [cryptoRates, fiatRates] = await Promise.all([
        this.fetchCryptoRates().catch(() => []),
        this.fetchFiatRates().catch(() => [])
      ])
      
      const allRates = [...cryptoRates, ...fiatRates]
      
      // If we got at least some rates, return them
      if (allRates.length > 0) {
        return allRates
      }
      
      // Otherwise use fallback
      return this.getFallbackRates()
    } catch (error) {
      // Silently use fallback rates
      return this.getFallbackRates()
    }
  }

  private async fetchCryptoRates(): Promise<Currency[]> {
    const params = new URLSearchParams({
      ids: 'bitcoin,ethereum',
      vs_currencies: 'brl',
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(`${this.cryptoApiUrl}?${params}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      }).catch((fetchError) => {
        // Intercept fetch errors (CORS, network, etc.) and return null
        clearTimeout(timeoutId)
        return null
      })

      clearTimeout(timeoutId)

      if (!response || !response.ok) {
        // API unavailable or returned error - use fallback
        return []
      }

      const data: CoinGeckoResponse = await response.json()
      return this.parseCryptoResponse(data)
    } catch (error) {
      // Any parsing or other errors - use fallback
      clearTimeout(timeoutId)
      return []
    }
  }

  private async fetchFiatRates(): Promise<Currency[]> {
    const currencies = [
      { code: CurrencyCode.USD, apiCode: 'USD' },
      { code: CurrencyCode.EUR, apiCode: 'EUR' },
      { code: CurrencyCode.GBP, apiCode: 'GBP' },
    ]

    const fiatRates: Currency[] = []
    const now = new Date()

    // Try to fetch all fiat rates, but don't fail if some are missing
    const fetchPromises = currencies.map(async (currency) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const response = await fetch(`${this.exchangeApiUrl}/${currency.apiCode}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        }).catch((fetchError) => {
          // Intercept fetch errors (CORS, network, etc.)
          clearTimeout(timeoutId)
          return null
        })
        
        clearTimeout(timeoutId)
        
        if (!response || !response.ok) {
          return null
        }

        const data: ExchangeRateResponse = await response.json()
        
        if (data.rates?.BRL) {
          return new Currency(currency.code, data.rates.BRL, now)
        }
        
        return null
      } catch (error) {
        clearTimeout(timeoutId)
        return null
      }
    })

    const results = await Promise.all(fetchPromises)
    
    // Filter out null results
    results.forEach(result => {
      if (result) {
        fiatRates.push(result)
      }
    })

    // If we couldn't fetch any fiat rates, use fallback for fiat currencies
    if (fiatRates.length === 0) {
      currencies.forEach(({ code }) => {
        const fallbackRate = this.fallbackRates.get(code)
        if (fallbackRate) {
          fiatRates.push(new Currency(code, fallbackRate, now))
        }
      })
    }

    return fiatRates
  }

  private parseCryptoResponse(data: CoinGeckoResponse): Currency[] {
    const currencies: Currency[] = []
    const now = new Date()

    if (data.bitcoin?.brl) {
      currencies.push(new Currency(CurrencyCode.BTC, data.bitcoin.brl, now))
    }

    if (data.ethereum?.brl) {
      currencies.push(new Currency(CurrencyCode.ETH, data.ethereum.brl, now))
    }

    return currencies
  }

  private getFallbackRates(): Currency[] {
    const now = new Date()
    return Array.from(this.fallbackRates.entries()).map(
      ([code, rate]) => new Currency(code, rate, now)
    )
  }
}
