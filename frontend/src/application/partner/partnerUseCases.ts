import type { PartnerGateway } from '@/domain/partner/ports/PartnerGateway'
import type { PartnerRegistration, ShareholdingInfo } from '@/domain/partner/interfaces/partnerGatewayInterface'
import type { PartnerSummary, PartnersCollection } from '@/domain/partner/entities/PartnerSummary'
import { sortPartnersByShareholding, calculateTotalShareholding } from '@/domain/partner/entities/PartnerSummary'
import { sanitizeCpf } from '@/utils/formatters'

/**
 * Register a new partner for a company.
 * Sanitizes CPF before sending to the gateway.
 */
export const registerPartner = async (
  gateway: PartnerGateway,
  data: PartnerRegistration,
): Promise<PartnerSummary> => {
  return gateway.register({ ...data, cpf: sanitizeCpf(data.cpf) })
}

/**
 * Fetch all partners for a company as a sorted, enriched collection.
 * Domain logic (sorting, totals) lives here — not in the store or component.
 */
export const fetchPartnersCollection = async (
  gateway: PartnerGateway,
  companyId: string,
): Promise<PartnersCollection> => {
  const partners = await gateway.getByCompanyId(companyId)
  const sorted = sortPartnersByShareholding(partners)
  const total = calculateTotalShareholding(partners)
  return {
    partners: sorted,
    totalCount: partners.length,
    totalShareholding: total,
    remainingShareholding: Math.max(0, 100 - total),
  }
}

/**
 * Validate whether a company's total shareholding equals 100%.
 * Returns structured result — caller decides how to surface it.
 */
export const validateShareholding = async (
  gateway: PartnerGateway,
  companyId: string,
): Promise<{ isValid: boolean; total: number; remaining: number }> => {
  const info: ShareholdingInfo = await gateway.getShareholdingInfo(companyId)
  return {
    isValid: Math.abs(info.totalShareholding - 100) < 0.01,
    total: info.totalShareholding,
    remaining: info.remaining,
  }
}
