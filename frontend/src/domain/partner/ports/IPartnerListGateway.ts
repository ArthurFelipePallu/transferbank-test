import type { PartnerSummary } from '../entities/PartnerSummary'

/**
 * Port: Partner List Gateway Interface
 * Defines the contract for fetching partner data
 */
export interface IPartnerListGateway {
  /**
   * Fetch all partners for a specific company
   * @param companyId - The company identifier
   * @returns Promise with array of partner summaries
   */
  getPartnersByCompanyId(companyId: string): Promise<PartnerSummary[]>
}
