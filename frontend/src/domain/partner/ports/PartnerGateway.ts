import type {
  PartnerRegistration,
  PartnerUpdate,
  PartnerPatch,
  ShareholdingInfo,
} from '../interfaces/partnerGatewayInterface'
import type { PartnerSummary } from '../entities/PartnerSummary'

/**
 * Port: Partner Gateway
 * Single contract for all partner operations — read and write.
 */
export interface PartnerGateway {
  register(data: PartnerRegistration): Promise<PartnerSummary>
  update(id: string, data: PartnerUpdate): Promise<PartnerSummary>
  patch(id: string, data: PartnerPatch): Promise<PartnerSummary>
  getById(id: string): Promise<PartnerSummary>
  getByCompanyId(companyId: string): Promise<PartnerSummary[]>
  getShareholdingInfo(companyId: string): Promise<ShareholdingInfo>
}
