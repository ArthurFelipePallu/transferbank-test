import { api } from '@/api/apiClient'
import type { CryptoCurrencyDto } from '@/api/backendApi'

export const cryptoRepository = {
  async getAll() {
    const { data } = await api.currency.currencyAllCryptoCurrenciesList()
    return data
  },
}
