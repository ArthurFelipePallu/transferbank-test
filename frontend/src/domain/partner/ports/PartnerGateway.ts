import type {
  PartnerRegistration,
  RegisteredPartner,
  ShareholdingInfo
} from '../interfaces/partnerGatewayInterface'

export interface PartnerGateway {
  register(data: PartnerRegistration): Promise<RegisteredPartner>
  getById(id: string): Promise<RegisteredPartner>
  getByCompanyId(companyId: string): Promise<RegisteredPartner[]>
  getShareholdingInfo(companyId: string): Promise<ShareholdingInfo>
}
