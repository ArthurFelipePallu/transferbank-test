import type { PartnerGateway } from '@/domain/partner/ports/PartnerGateway'
import type { PartnerRegistration, PartnerUpdate, PartnerPatch, ShareholdingInfo } from '@/domain/partner/ports/PartnerGateway'
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
 * Full update of a partner (PUT).
 * All mutable fields must be provided — CPF is immutable and excluded.
 */
export const updatePartner = async (
  gateway: PartnerGateway,
  id: string,
  data: PartnerUpdate,
): Promise<PartnerSummary> => {
  return gateway.update(id, data)
}

/**
 * Partial update of a partner (PATCH).
 * Only the provided fields are applied — omitted fields are left unchanged.
 */
export const patchPartner = async (
  gateway: PartnerGateway,
  id: string,
  data: PartnerPatch,
): Promise<PartnerSummary> => {
  return gateway.patch(id, data)
}

/**
 * Fetch all partners for a company as a sorted, enriched collection.
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
