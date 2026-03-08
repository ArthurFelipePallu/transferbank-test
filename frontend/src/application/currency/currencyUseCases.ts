import type { CurrencyGateway } from '@/domain/onboarding/ports/CurrencyGateway'
import type { CryptoCurrencyOption } from '@/domain/onboarding/interfaces/currencyInterface'

export const loadAllCryptocurrencies = async (
  gateway: CurrencyGateway
): Promise<CryptoCurrencyOption[]> => {
  return await gateway.getAllCrypto()
}

export const loadMostValuableCryptocurrency = async (
  gateway: CurrencyGateway
): Promise<CryptoCurrencyOption> => {
  return await gateway.getMostValuableCrypto()
}

export const loadCryptocurrenciesOrdered = async (
  gateway: CurrencyGateway
): Promise<CryptoCurrencyOption[]> => {
  const currencies = await gateway.getAllCrypto()
  return currencies.sort((a, b) => a.alias.localeCompare(b.alias))
}

export const loadCryptocurrenciesWithHighlight = async (
  gateway: CurrencyGateway
): Promise<CryptoCurrencyOption[]> => {
  const [all, mostValuable] = await Promise.all([
    gateway.getAllCrypto(),
    gateway.getMostValuableCrypto(),
  ])

  return [mostValuable, ...all.filter((c) => c.currency !== mostValuable.currency)]
}
