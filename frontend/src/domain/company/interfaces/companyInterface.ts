import type { CryptoCurrencyEnum } from '@/api/backendApi'
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'

// Re-export so consumers of company types get PartnerSummary from one place
export type { PartnerSummary }

// ─── Onboarding write types ───────────────────────────────────────────────────

export interface PartnerRegistration {
  fullName: string
  cpf: string
  nationality: string
  shareholding: number
  isPep: boolean
  documents: Array<{ name: string; size: number; type: string }>
}

export interface CompanyRegistration {
  cnpj: string
  companyName: string
  fantasyName: string
  cryptoCurrencies: CryptoCurrencyEnum[]
  phone: string
  email: string
  password: string
  /** Partners collected during onboarding — persisted atomically with the company */
  partners?: PartnerRegistration[]
}

// ─── Read types ───────────────────────────────────────────────────────────────

export interface Company {
  id: string
  cnpj: string
  companyName: string
  fantasyName: string
  cryptoCurrencies: CryptoCurrencyEnum[]
  phone: string
  email: string
  partnerCount?: number
  partners?: PartnerSummary[]
  createdAt: string
}

export interface CompanyListItem {
  id: string
  cnpj: string
  companyName: string
  fantasyName: string
  cryptoCurrencies: CryptoCurrencyEnum[]
  email: string
  partnerCount: number
  createdAt: string
}
