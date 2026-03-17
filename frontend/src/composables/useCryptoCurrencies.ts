import { ref } from 'vue'
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface'
import type { CryptoCurrencyEnum } from '@/api/backendApi'
import { loadAllCryptoCurrenciesOrdered } from '@/application/onboarding/onboardingUseCases'
import { httpCurrencyGateway } from '@/infrastructure/onboarding/HttpCurrencyGateway'

// Module-level cache — loaded once, shared across all component instances
let cache: CryptoCurrencyOption[] | null = null
let loadPromise: Promise<CryptoCurrencyOption[]> | null = null

const load = (): Promise<CryptoCurrencyOption[]> => {
  if (cache) return Promise.resolve(cache)
  if (!loadPromise) {
    loadPromise = loadAllCryptoCurrenciesOrdered(httpCurrencyGateway).then((result) => {
      cache = result
      loadPromise = null
      return result
    })
  }
  return loadPromise
}

export function useCryptoCurrencies() {
  const currencies = ref<CryptoCurrencyOption[]>(cache ?? [])
  const isLoading = ref(false)

  const loadCurrencies = async () => {
    if (cache) {
      currencies.value = cache
      return
    }
    isLoading.value = true
    currencies.value = await load()
    isLoading.value = false
  }

  /**
   * Returns the ticker alias for a given CryptoCurrencyEnum value.
   * Falls back to the raw enum string if not yet loaded or not found.
   */
  const formatAlias = (currency: CryptoCurrencyEnum | string): string => {
    const match = currencies.value.find((c) => c.currency === currency)
    return match?.alias ?? String(currency)
  }

  return { currencies, isLoading, loadCurrencies, formatAlias }
}
