import type { TranslationKey } from '@/domain/i18n/types/TranslationKey'
import type { CryptoCurrencyEnum } from '@/api/backendApi'

// ─── Step navigation ──────────────────────────────────────────────────────────

export enum OnboardingStep {
  CNPJ = 1,
  COMPANY = 2,
  CRYPTO = 3,
  ADDRESS = 4,
  PARTNERS = 5,
  SOCIAL_CONTRACT = 6,
  PASSWORD = 7,
  REVIEW = 8,
}

export interface OnboardingFormStep {
  id: OnboardingStep
  title: TranslationKey
  description: TranslationKey
  isCompleted: boolean
}

// ─── Domain entities ──────────────────────────────────────────────────────────

/** A partner being registered during onboarding (before company exists in backend) */
export interface OnboardingPartner {
  /** Temporary client-side id */
  tempId: string
  fullName: string
  cpf: string
  nationality: string
  shareholding: number
  isPep: boolean
  documents: Array<{ id: string; name: string; size: number; type: string }>
}

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

/** Social contract PDF selected during onboarding — held in memory only, never cached */
export interface SocialContractFile {
  file: File
  name: string
  sizeBytes: number
  objectUrl: string
}

// ─── Use-case result ──────────────────────────────────────────────────────────

export { RegistrationResult } from '@/domain/onboarding/types/RegistrationResult'

export enum AddPartnerResult {
  Success      = 'success',
  DuplicateCpf  = 'duplicate_cpf',
  DuplicateName = 'duplicate_name',
}

/** Returns true if all partners have the required fields filled for submission */
export function arePartnersSubmittable(partners: OnboardingPartner[]): boolean {
  return partners.length > 0 && partners.every((p) => p.cpf.trim().length > 0)
}

/**
 * Distributes 100% shareholding across a list of raw share values.
 * Uses integer arithmetic (1/100 of a percent = 1 "cent") to avoid floating point drift.
 * If the API values sum to ~100 (99–101), they are scaled proportionally.
 * Otherwise an equal split is applied.
 * The last entry always absorbs any rounding remainder so the total is always exactly 100.
 */
export function distributeShareholding(rawShares: number[]): number[] {
  const TOTAL_CENTS = 10000 // 100.00% expressed in hundredths of a percent
  const apiTotal = rawShares.reduce((sum, s) => sum + s, 0)
  const hasValidShares = apiTotal >= 99 && apiTotal <= 101

  let cents: number[]

  if (hasValidShares) {
    cents = rawShares.map((s) => Math.floor((s / apiTotal) * TOTAL_CENTS))
  } else {
    const base = Math.floor(TOTAL_CENTS / rawShares.length)
    cents = rawShares.map(() => base)
  }

  const allocated = cents.reduce((a, b) => a + b, 0)
  cents[cents.length - 1]! += TOTAL_CENTS - allocated

  return cents.map((c) => c / 100)
}
