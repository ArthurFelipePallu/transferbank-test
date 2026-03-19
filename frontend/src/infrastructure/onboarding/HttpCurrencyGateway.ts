import { api } from '@/api/apiClient'
import type { CryptoCurrencyDto } from '@/api/backendApi'
import type { CryptoCurrencyOption } from '@/domain/currency/interfaces/currencyInterface'
import type { CurrencyGateway } from '@/domain/currency/ports/CurrencyGateway'

const mapToCurrencyOption = (input: CryptoCurrencyDto): CryptoCurrencyOption => ({
  currency: input.value,
  alias: input.alias,
})

export const httpCurrencyGateway: CurrencyGateway = {
  async getAllCrypto() {
    const response = await api.currency.currencyAllCryptoCurrenciesList()
    return response.data.map(mapToCurrencyOption)
  },
  async getMostValuableCrypto() {
    const response = await api.currency.currencyMostValuableCurrencyList()
    return mapToCurrencyOption(response.data)
  },
}
