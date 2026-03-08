import type { CryptoCurrencyEnum } from '@/api/backendApi'

export interface CompanyRegistration {
  cnpj: string
  companyName: string
  fullName: string
  cryptoCurrencies: CryptoCurrencyEnum[]
  phone: string
  email: string
  password: string
}

export interface Company {
  id: string
  cnpj: string
  companyName: string
  fullName: string
  cryptoCurrencies: CryptoCurrencyEnum[]
  phone: string
  email: string
  createdAt: string
}

export interface CompanyListItem {
  id: string
  cnpj: string
  companyName: string
  fullName: string
  cryptoCurrencies: CryptoCurrencyEnum[]
  email: string
  partnerCount?: number
  createdAt: string
}
