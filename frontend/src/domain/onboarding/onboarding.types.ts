import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import type { CryptoCurrencyEnum } from '@/api/backendApi'

// ─── Step navigation ──────────────────────────────────────────────────────────

export enum OnboardingStep {
  CNPJ = 1,
  COMPANY = 2,
  CRYPTO = 3,
  ADDRESS = 4,
  PASSWORD = 5,
  REVIEW = 6,
}

export interface OnboardingFormStep {
  id: OnboardingStep
  title: TranslationKey
  description: TranslationKey
  isCompleted: boolean
}

// ─── Domain entities ──────────────────────────────────────────────────────────

/** Completed registration stored after successful submission */
export interface RegisteredCompany {
  id?: string
  cnpj: string
  companyName: string
  fantasyName: string
  phone: string
  email: string
  cryptoCurrencies: CryptoCurrencyEnum[]
}

/** In-progress form data cached across steps */
export interface OnboardingFormCache {
  cnpj?: string
  companyName?: string
  fantasyName?: string
  phone?: string
  email?: string
  cryptoCurrencies?: CryptoCurrencyEnum[]
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
}

// ─── Use-case result ──────────────────────────────────────────────────────────

export { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'
