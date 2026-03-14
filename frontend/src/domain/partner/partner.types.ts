import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

export interface Partner {
  id?: string
  fullName: string
  cpf: string
  nationality: string
  shareholding: number
  isPep: boolean
  documents: PartnerDocument[]
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
  title: TranslationKey
  description: TranslationKey
  isCompleted: boolean
}

export enum PartnerRegistrationStep {
  PERSONAL_INFO = 1,
  SHAREHOLDING = 2,
  DOCUMENTS = 3,
  REVIEW = 4,
}
