import type { PartnerGateway } from '@/domain/partner/ports/PartnerGateway'
import type {
  PartnerRegistration,
  RegisteredPartner,
  ShareholdingInfo,
} from '@/domain/partner/interfaces/partnerGatewayInterface'

export const registerPartnerViaGateway = async (
  gateway: PartnerGateway,
  data: PartnerRegistration
): Promise<RegisteredPartner> => {
  return await gateway.register(data)
}

export const getPartnerById = async (
  gateway: PartnerGateway,
  id: string
): Promise<RegisteredPartner> => {
  return await gateway.getById(id)
}

export const getPartnersByCompanyId = async (
  gateway: PartnerGateway,
  companyId: string
): Promise<RegisteredPartner[]> => {
  return await gateway.getByCompanyId(companyId)
}

export const getCompanyShareholdingInfo = async (
  gateway: PartnerGateway,
  companyId: string
): Promise<ShareholdingInfo> => {
  return await gateway.getShareholdingInfo(companyId)
}

export const validateCompanyShareholding = async (
  gateway: PartnerGateway,
  companyId: string
): Promise<{ isValid: boolean; total: number; remaining: number }> => {
  const info = await gateway.getShareholdingInfo(companyId)
  const isValid = Math.abs(info.totalShareholding - 100) < 0.01
  
  return {
    isValid,
    total: info.totalShareholding,
    remaining: info.remaining,
  }
}
