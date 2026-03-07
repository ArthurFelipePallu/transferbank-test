import type { PartnerRepository } from '@/domain/partner/interfaces/partnerRepository'
import type { Partner } from '@/domain/partner/partner.types'

export class InMemoryPartnerRepository implements PartnerRepository {
  private partners: Partner[] = []

  async savePartner(partner: Partner): Promise<void> {
    const existingIndex = this.partners.findIndex((p) => p.id === partner.id)
    
    if (existingIndex >= 0) {
      this.partners[existingIndex] = partner
    } else {
      this.partners.push({ ...partner, id: crypto.randomUUID() })
    }
  }

  async getPartners(): Promise<Partner[]> {
    return [...this.partners]
  }

  validateShareholding(partners: Partner[]): boolean {
    const total = partners.reduce((sum, partner) => sum + partner.shareholding, 0)
    return Math.abs(total - 100) < 0.01 // Allow for floating point precision
  }
}

export const inMemoryPartnerRepository = new InMemoryPartnerRepository()
