import type { IPartnerListGateway } from '@/domain/partner/ports/IPartnerListGateway'
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import { api } from '@/api/apiClient'

/**
 * Infrastructure: HTTP Partner List Gateway
 * Implements partner fetching via HTTP API
 */
export class HttpPartnerListGateway implements IPartnerListGateway {
  async getPartnersByCompanyId(companyId: string): Promise<PartnerSummary[]> {
    try {
      const response = await api.partner.partnerCompanyDetail(companyId)
      
      return response.data.map((partner) => ({
        id: partner.id,
        fullName: partner.fullName,
        cpf: partner.cpf,
        shareholding: partner.shareholding,
      }))
    } catch (error) {
      console.error('Failed to fetch partners:', error)
      throw new Error('Unable to load partners. Please try again.')
    }
  }
}

// Singleton instance
export const httpPartnerListGateway = new HttpPartnerListGateway()
