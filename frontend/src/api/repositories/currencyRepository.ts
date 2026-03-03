import { api } from '@/api/client'
import type { CryptoCurrencyDto } from '@/api/backendApi'

export async function getCryptoCurrencies(): Promise<CryptoCurrencyDto[]> {
  const response = await api.currency.currencyAllCryptoCurrenciesList()
  return response.data
}
