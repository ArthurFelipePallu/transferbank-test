import type { PartnerSummary } from './PartnerSummary'
import type { PartnerRegistration, PartnerDocument } from '../ports/PartnerGateway'

export const PARTNER_DOCUMENT_DEFAULTS: PartnerDocument = {
  name: '',
  size: 0,
  type: '',
}

export const PARTNER_REGISTRATION_DEFAULTS: PartnerRegistration = {
  companyId: '',
  fullName: '',
  cpf: '',
  nationality: 'Brazilian',
  shareholding: 0,
  isPep: false,
  documents: [],
}

export const PARTNER_SUMMARY_DEFAULTS: PartnerSummary = {
  id: '',
  companyId: '',
  fullName: '',
  cpf: '',
  nationality: '',
  shareholding: 0,
  isPep: false,
  createdAt: '',
}
