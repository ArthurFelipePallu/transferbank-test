/**
 * Per-criterion score used in the fuzzy confidence calculation.
 * score: 0.0–1.0 representing how well the criterion was met.
 * weight: relative importance of this criterion in the final confidence index.
 * notes: optional detail from the AI about this criterion.
 */
export interface DocumentCriterionScore {
  score: number
  weight: number
  notes: string
}

/**
 * Breakdown of all evaluated criteria.
 */
export interface DocumentAnalysisCriteria {
  /** Company name, CNPJ, registration number, company purpose (objeto social) */
  companyIdentification: DocumentCriterionScore
  /** All partners listed with full name, CPF/RG, nationality, shareholding % */
  partnerData: DocumentCriterionScore
  /** Signature present — handwritten, digital certificate, or gov.br */
  signatures: DocumentCriterionScore
  /** Mandatory clauses: capital, duration, liability, administration */
  requiredClauses: DocumentCriterionScore
  /** No gross errors, coherent legal language, resembles a real social contract */
  documentIntegrity: DocumentCriterionScore
}

/**
 * Result of an AI-based document analysis with fuzzy confidence scoring.
 *
 * confidenceIndex: 0.0–1.0 weighted average across all criteria.
 * isValid: true only when confidenceIndex >= CONFIDENCE_THRESHOLD.
 * reason: human-readable summary of the overall assessment.
 */
export interface DocumentAnalysisResult {
  isValid: boolean
  confidenceIndex: number
  reason: string
  criteria: DocumentAnalysisCriteria
}

/** Ordered list of all criterion keys — used for rendering breakdowns. */
export type CriterionKey = keyof DocumentAnalysisCriteria

export const CRITERION_KEYS: CriterionKey[] = [
  'companyIdentification',
  'partnerData',
  'signatures',
  'requiredClauses',
  'documentIntegrity',
]

/** Minimum confidence index (0–1) required to accept a document as valid. */
export const DOCUMENT_CONFIDENCE_THRESHOLD = 0.7

/** Score thresholds for per-criterion visual states. */
export const CRITERION_SCORE_HIGH = 0.7
export const CRITERION_SCORE_MEDIUM = 0.4

/** Format a 0–1 confidence value as a percentage string. */
export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`
}

/** Format a byte count as a human-readable string. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
