import { api } from '@/api/apiClient'
import type { PartnerGateway } from '@/domain/partner/ports/PartnerGateway'
import type { PartnerRegistration, PartnerUpdate, PartnerPatch, ShareholdingInfo } from '@/domain/partner/interfaces/partnerGatewayInterface'
import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'
import type { PartnerResponse } from '@/api/backendApi'
import { PARTNER_SUMMARY_DEFAULTS } from '@/domain/partner/entities/PartnerDefaults'

// ─── Mapper ───────────────────────────────────────────────────────────────────

const toPartnerSummary = (r: PartnerResponse): PartnerSummary => ({
  ...PARTNER_SUMMARY_DEFAULTS,
  id: r.id ?? PARTNER_SUMMARY_DEFAULTS.id,
  companyId: r.companyId ?? PARTNER_SUMMARY_DEFAULTS.companyId,
  fullName: r.fullName ?? PARTNER_SUMMARY_DEFAULTS.fullName,
  cpf: r.cpf ?? PARTNER_SUMMARY_DEFAULTS.cpf,
  nationality: r.nationality ?? PARTNER_SUMMARY_DEFAULTS.nationality,
  shareholding: r.shareholding ?? PARTNER_SUMMARY_DEFAULTS.shareholding,
  isPep: r.isPep ?? PARTNER_SUMMARY_DEFAULTS.isPep,
  createdAt: r.createdAt ?? PARTNER_SUMMARY_DEFAULTS.createdAt,
})

// ─── Gateway ──────────────────────────────────────────────────────────────────

class HttpPartnerGatewayImpl implements PartnerGateway {
  async register(data: PartnerRegistration): Promise<PartnerSummary> {
    const response = await api.partner.partnerRegisterCreate({
      companyId: data.companyId,
      fullName: data.fullName,
      cpf: data.cpf,
      nationality: data.nationality,
      shareholding: data.shareholding,
      isPep: data.isPep,
      documents: data.documents.map((d) => ({ name: d.name, size: d.size, type: d.type })),
    })
    return toPartnerSummary(response.data)
  }

  async update(id: string, data: PartnerUpdate): Promise<PartnerSummary> {
    const response = await api.partner.partnerUpdate(id, {
      fullName: data.fullName,
      nationality: data.nationality,
      shareholding: data.shareholding,
      isPep: data.isPep,
      documents: data.documents.map((d) => ({ name: d.name, size: d.size, type: d.type })),
    })
    return toPartnerSummary(response.data)
  }

  async patch(id: string, data: PartnerPatch): Promise<PartnerSummary> {
    const response = await api.partner.partnerPartialUpdate(id, {
      fullName: data.fullName,
      nationality: data.nationality,
      shareholding: data.shareholding,
      isPep: data.isPep,
      documents: data.documents?.map((d) => ({ name: d.name, size: d.size, type: d.type })),
    })
    return toPartnerSummary(response.data)
  }

  async getById(id: string): Promise<PartnerSummary> {
    const response = await api.partner.partnerDetail(id)
    return toPartnerSummary(response.data)
  }

  async getByCompanyId(companyId: string): Promise<PartnerSummary[]> {
    const response = await api.partner.partnerCompanyDetail(companyId)
    return (response.data ?? []).map(toPartnerSummary)
  }

  async getShareholdingInfo(companyId: string): Promise<ShareholdingInfo> {
    const response = await api.partner.partnerCompanyShareholdingList(companyId)
    const total = response.data ?? 0
    return {
      companyId,
      totalShareholding: total,
      remaining: Math.max(0, 100 - total),
    }
  }
}

export const httpPartnerGateway: PartnerGateway = new HttpPartnerGatewayImpl()
