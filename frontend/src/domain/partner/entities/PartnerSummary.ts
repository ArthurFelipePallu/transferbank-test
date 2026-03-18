/**
 * Domain Entity: Partner Summary
 * Full partner data as returned by the backend — used in lists and detail views.
 */
export interface PartnerSummary {
  id: string
  companyId: string
  fullName: string
  cpf: string
  nationality: string
  shareholding: number
  isPep: boolean
  createdAt: string
}

/**
 * Value Object: Partners Collection
 * A resolved collection of partners with aggregate computed properties.
 */
export interface PartnersCollection {
  partners: PartnerSummary[]
  totalCount: number
  totalShareholding: number
  remainingShareholding: number
}

/** Sort partners by shareholding descending */
export const sortPartnersByShareholding = (partners: PartnerSummary[]): PartnerSummary[] =>
  [...partners].sort((a, b) => b.shareholding - a.shareholding)

/** Sum all shareholdings */
export const calculateTotalShareholding = (partners: PartnerSummary[]): number =>
  partners.reduce((sum, p) => sum + p.shareholding, 0)

/**
 * Distribute 100% shareholding evenly across a list of partners.
 * The last partner absorbs the floating-point remainder so the total is exactly 100.
 * Returns a new array — does not mutate the input.
 */
export const distributeShareholdingEvenly = <T extends { shareholding: number }>(
  partners: T[],
): T[] => {
  if (partners.length === 0) return partners
  const even = Math.floor((100 / partners.length) * 100) / 100
  return partners.map((p, i) => ({
    ...p,
    shareholding:
      i === partners.length - 1
        ? Math.round((100 - even * (partners.length - 1)) * 100) / 100
        : even,
  }))
}

/**
 * Returns true if all partners have effectively zero shareholding.
 * Used to detect when the CNPJ API did not publish individual percentages.
 */
export const hasNoShareholdingData = <T extends { shareholding: number }>(
  partners: T[],
): boolean => partners.reduce((sum, p) => sum + Number(p.shareholding), 0) < 0.01
