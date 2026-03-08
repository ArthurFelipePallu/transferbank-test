import { api } from '@/api/apiClient'
import type {
  RegisterPartnerRequest,
  PartnerResponse,
  DocumentRequest,
} from '@/api/backendApi'
import type {
  PartnerRegistration,
  RegisteredPartner,
  ShareholdingInfo,
  PartnerDocument,
} from '@/domain/partner/interfaces/partnerGatewayInterface'
import type { PartnerGateway } from '@/domain/partner/ports/PartnerGateway'

const mapToDocumentRequest = (doc: PartnerDocument): DocumentRequest => ({
  name: doc.name,
  size: doc.size,
  type: doc.type,
})

const mapToRegisterRequest = (data: PartnerRegistration): RegisterPartnerRequest => ({
  companyId: data.companyId,
  fullName: data.fullName,
  cpf: data.cpf,
  nationality: data.nationality,
  shareholding: data.shareholding,
  isPep: data.isPep,
  documents: data.documents.map(mapToDocumentRequest),
})

const mapToRegisteredPartner = (response: PartnerResponse): RegisteredPartner => ({
  id: response.id || '',
  companyId: response.companyId || '',
  fullName: response.fullName || '',
  cpf: response.cpf || '',
  nationality: response.nationality || '',
  shareholding: response.shareholding || 0,
  isPep: response.isPep || false,
  documents:
    response.documents?.map((doc) => ({
      id: doc.id || '',
      name: doc.name || '',
      size: doc.size || 0,
      type: doc.type || '',
      uploadedAt: doc.uploadedAt || '',
    })) || [],
  createdAt: response.createdAt || '',
})

export const httpPartnerGateway: PartnerGateway = {
  async register(data) {
    const request = mapToRegisterRequest(data)
    const response = await api.partner.partnerRegisterCreate(request)
    return mapToRegisteredPartner(response.data)
  },

  async getById(id) {
    const response = await api.partner.partnerDetail(id)
    return mapToRegisteredPartner(response.data)
  },

  async getByCompanyId(companyId) {
    const response = await api.partner.partnerCompanyDetail(companyId)
    return response.data.map(mapToRegisteredPartner)
  },

  async getShareholdingInfo(companyId) {
    const response = await api.partner.partnerCompanyShareholdingList(companyId)
    
    // The API returns an object with totalShareholding and remaining
    const data = response.data as any
    
    if (typeof data === 'object' && 'totalShareholding' in data) {
      return {
        companyId,
        totalShareholding: data.totalShareholding,
        remaining: data.remaining,
      }
    }
    
    // Fallback if it returns just a number (total)
    const total = typeof data === 'number' ? data : 0
    return {
      companyId,
      totalShareholding: total,
      remaining: 100 - total,
    }
  },
}
