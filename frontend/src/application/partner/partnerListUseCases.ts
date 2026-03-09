import type { IPartnerListGateway } from '@/domain/partner/ports/IPartnerListGateway'
import type { PartnersCollection } from '@/domain/partner/entities/PartnerSummary'
import {
  sortPartnersByShareholding,
  calculateTotalShareholding,
} from '@/domain/partner/entities/PartnerSummary'

/**
 * Use Case: Fetch Partners Collection
 * Retrieves partners for a company and returns them sorted by shareholding
 */
export const fetchPartnersCollection = async (
  gateway: IPartnerListGateway,
  companyId: string
): Promise<PartnersCollection> => {
  const partners = await gateway.getPartnersByCompanyId(companyId)
  const sortedPartners = sortPartnersByShareholding(partners)
  const totalShareholding = calculateTotalShareholding(partners)

  return {
    partners: sortedPartners,
    totalCount: partners.length,
    totalShareholding,
    remainingShareholding: Math.max(0, 100 - totalShareholding),
  }
}
