import type { Company, CompanyListItem, CompanyRegistration } from '../interfaces/companyInterface'
import { PARTNER_SUMMARY_DEFAULTS } from '@/domain/partner/entities/PartnerDefaults'

export const COMPANY_DEFAULTS: Company = {
  id: '',
  cnpj: '',
  companyName: '',
  fantasyName: '',
  cryptoCurrencies: [],
  phone: '',
  email: '',
  partnerCount: 0,
  partners: [],
  createdAt: '',
}

export const COMPANY_LIST_ITEM_DEFAULTS: CompanyListItem = {
  id: '',
  cnpj: '',
  companyName: '',
  fantasyName: '',
  cryptoCurrencies: [],
  email: '',
  partnerCount: 0,
  createdAt: '',
}

export { PARTNER_SUMMARY_DEFAULTS }
