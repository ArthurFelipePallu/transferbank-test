export interface Partner {
  id?: string
  fullName: string
  cpf: string
  address: PartnerAddress
  nationality: string
  shareholding: number
  isPep: boolean
  documents: PartnerDocument[]
}

export interface PartnerAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PartnerDocument {
  id: string
  name: string
  size: number
  type: string
  file?: File
}

export interface PartnerFormStep {
  id: number
  title: string
  description: string
  isCompleted: boolean
}

export enum PartnerRegistrationStep {
  PERSONAL_INFO = 1,
  ADDRESS = 2,
  SHAREHOLDING = 3,
  DOCUMENTS = 4,
  REVIEW = 5,
}
