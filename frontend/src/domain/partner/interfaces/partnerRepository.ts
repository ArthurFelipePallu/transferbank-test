import type { Partner } from '../partner.types'

export interface PartnerRepository {
  savePartner(partner: Partner): Promise<void>
  getPartners(): Promise<Partner[]>
  validateShareholding(partners: Partner[]): boolean
}
