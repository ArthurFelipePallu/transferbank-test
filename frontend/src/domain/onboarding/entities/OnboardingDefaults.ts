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

export const REGISTERED_COMPANY_DEFAULTS: RegisteredCompany = {
  id: '',
  cnpj: '',
  companyName: '',
  fantasyName: '',
  phone: '',
  email: '',
  cryptoCurrencies: [],
}
