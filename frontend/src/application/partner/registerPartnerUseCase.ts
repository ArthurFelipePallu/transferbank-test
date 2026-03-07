import type { PartnerRepository } from '@/domain/partner/interfaces/partnerRepository'
import type { Partner } from '@/domain/partner/partner.types'

export async function registerPartner(
  repository: PartnerRepository,
  partner: Partner,
): Promise<void> {
  await repository.savePartner(partner)
}

export async function validateTotalShareholding(
  repository: PartnerRepository,
): Promise<{ isValid: boolean; total: number }> {
  const partners = await repository.getPartners()
  const total = partners.reduce((sum, partner) => sum + partner.shareholding, 0)
  const isValid = repository.validateShareholding(partners)
  
  return { isValid, total }
}
