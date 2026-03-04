import type { CurrencyGateway } from '@/domain/onboarding/ports/CurrencyGateway'

export const loadMostValuableCrypto = async (gateway: CurrencyGateway) => {
  return await gateway.getMostValuableCrypto()
}

export const loadAllCryptoCurrenciesOrdered = async (gateway: CurrencyGateway) => {
  const currencies = await gateway.getAllCrypto()

  return currencies.sort((a, b) => a.alias.localeCompare(b.alias))
}

export const loadCurrenciesWithHighlight = async (gateway: CurrencyGateway) => {
  const [all, mostValuable] = await Promise.all([
    gateway.getAllCrypto(),
    gateway.getMostValuableCrypto(),
  ])

  return [mostValuable, ...all.filter((c) => c.currency !== mostValuable.currency)]
}
