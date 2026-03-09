/**
 * Domain Entity: Partner Summary
 * Represents a simplified view of a partner for display purposes
 */
export interface PartnerSummary {
  id: string
  fullName: string
  cpf: string
  shareholding: number
}

/**
 * Value Object: Partners Collection
 * Represents a collection of partners with computed properties
 */
export interface PartnersCollection {
  partners: PartnerSummary[]
  totalCount: number
  totalShareholding: number
  remainingShareholding: number
}

/**
 * Domain Service: Sort partners by shareholding in descending order
 */
export const sortPartnersByShareholding = (partners: PartnerSummary[]): PartnerSummary[] => {
  return [...partners].sort((a, b) => b.shareholding - a.shareholding)
}

/**
 * Domain Service: Calculate total shareholding
 */
export const calculateTotalShareholding = (partners: PartnerSummary[]): number => {
  return partners.reduce((sum, partner) => sum + partner.shareholding, 0)
}
