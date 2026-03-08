export interface PartnerDocument {
  name: string
  size: number
  type: string
}

export interface PartnerRegistration {
  companyId: string
  fullName: string
  cpf: string
  nationality: string
  shareholding: number
  isPep: boolean
  documents: PartnerDocument[]
}

export interface RegisteredPartner {
  id: string
  companyId: string
  fullName: string
  cpf: string
  nationality: string
  shareholding: number
  isPep: boolean
  documents: Array<{
    id: string
    name: string
    size: number
    type: string
    uploadedAt: string
  }>
  createdAt: string
}

export interface ShareholdingInfo {
  companyId: string
  totalShareholding: number
  remaining: number
}
