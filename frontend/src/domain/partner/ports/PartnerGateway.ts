import type { PartnerSummary } from '../entities/PartnerSummary'

// ─── Command types (write side) ───────────────────────────────────────────────

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

export interface PartnerUpdate {
  fullName: string
  nationality: string
  shareholding: number
  isPep: boolean
  documents: PartnerDocument[]
}

export interface PartnerPatch {
  fullName?: string
  nationality?: string
  shareholding?: number
  isPep?: boolean
  documents?: PartnerDocument[]
}

// ─── Query types (read side) ──────────────────────────────────────────────────

export type { PartnerSummary }

export interface ShareholdingInfo {
  companyId: string
  totalShareholding: number
  remaining: number
}

/**
 * Port: Partner Gateway
 * Single contract for all partner operations — read and write.
 * Types and interface co-located so callers only need one import path.
 */
export interface IPartnerGateway {
  register(data: PartnerRegistration): Promise<PartnerSummary>
  update(id: string, data: PartnerUpdate): Promise<PartnerSummary>
  patch(id: string, data: PartnerPatch): Promise<PartnerSummary>
  getById(id: string): Promise<PartnerSummary>
  getByCompanyId(companyId: string): Promise<PartnerSummary[]>
  getShareholdingInfo(companyId: string): Promise<ShareholdingInfo>
}
