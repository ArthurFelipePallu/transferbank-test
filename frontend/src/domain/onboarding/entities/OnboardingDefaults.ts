import type { OnboardingFormCache, OnboardingPartner, RegisteredCompany } from '../onboarding.types'

export const ONBOARDING_FORM_CACHE_DEFAULTS: OnboardingFormCache = {
  cnpj: '',
  companyName: '',
  fantasyName: '',
  phone: '',
  email: '',
  cryptoCurrencies: [],
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
}

export const ONBOARDING_PARTNER_DEFAULTS: Omit<OnboardingPartner, 'tempId'> = {
  fullName: '',
  cpf: '',
  nationality: 'Brazilian',
  shareholding: 0,
  isPep: false,
  documents: [],
}

/** Placeholder CPF used when a partner is pre-filled from an external source (e.g. CNPJ API)
 *  and no CPF was provided. Allows the form to proceed; should be updated by the user. */
export const UNKNOWN_CPF_PLACEHOLDER = '00000000000'

/** Minimum total shareholding (%) required to consider partners fully allocated.
 *  Slightly below 100 to tolerate floating point rounding in edge cases. */
export const MIN_SHAREHOLDING_THRESHOLD = 99.99

export const REGISTERED_COMPANY_DEFAULTS: RegisteredCompany = {
  id: '',
  cnpj: '',
  companyName: '',
  fantasyName: '',
  phone: '',
  email: '',
  cryptoCurrencies: [],
}
