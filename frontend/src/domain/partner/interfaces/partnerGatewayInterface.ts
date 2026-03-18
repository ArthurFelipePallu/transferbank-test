import type { PartnerSummary } from '@/domain/partner/entities/PartnerSummary'

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

// ─── Query types (read side) ──────────────────────────────────────────────────

/** Re-export so callers only need one import path */
export type { PartnerSummary }

export interface ShareholdingInfo {
  companyId: string
  totalShareholding: number
  remaining: number
}
