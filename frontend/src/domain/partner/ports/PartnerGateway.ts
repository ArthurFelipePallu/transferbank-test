import type {
  PartnerRegistration,
  ShareholdingInfo,
} from '../interfaces/partnerGatewayInterface'
import type { PartnerSummary } from '../entities/PartnerSummary'

/**
 * Port: Partner Gateway
 * Single contract for all partner operations — read and write.
 * ISP: callers depend only on the methods they use via this one interface.
 */
export interface PartnerGateway {
  register(data: PartnerRegistration): Promise<PartnerSummary>
  getById(id: string): Promise<PartnerSummary>
  getByCompanyId(companyId: string): Promise<PartnerSummary[]>
  getShareholdingInfo(companyId: string): Promise<ShareholdingInfo>
}
