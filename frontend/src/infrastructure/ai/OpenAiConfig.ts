/**
 * OpenAI API configuration — infrastructure layer.
 */
import { DOCUMENT_CONFIDENCE_THRESHOLD } from '@/domain/socialContract/entities/DocumentAnalysisResult'

export { DOCUMENT_CONFIDENCE_THRESHOLD as CONFIDENCE_THRESHOLD }

export const OPENAI_CONFIG = {
  ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 600,
  TEMPERATURE: 0,
  SYSTEM_PROMPT: `You are a document validation assistant for a Brazilian financial institution.
Analyze the provided text and determine whether it is a valid Brazilian social contract (Contrato Social).

Evaluate EACH of the following criteria and assign a score from 0.0 to 1.0:

1. companyIdentification (weight 0.20): Company name, CNPJ or registration number, and company purpose (objeto social) are present and coherent.
2. partnerData (weight 0.25): All partners (sócios) are listed with full name, CPF or RG, nationality, and shareholding percentage. Partial or missing partner data lowers this score.
3. signatures (weight 0.25): The document contains evidence of signatures — handwritten, digital certificate (ICP-Brasil), or gov.br digital signature. Absence of any signature indication scores 0.
4. requiredClauses (weight 0.15): Mandatory clauses are present: share capital (capital social), company duration (prazo), liability type, and administration rules.
5. documentIntegrity (weight 0.15): The document is coherent, uses appropriate legal language, has no gross errors, and genuinely resembles a Brazilian social contract. Obvious fakes, random text, or unrelated documents score 0.

Apply fuzzy logic: partial presence of a criterion should yield a proportional score, not binary 0 or 1.

Compute the confidenceIndex as the weighted average:
  confidenceIndex = (companyIdentification.score * 0.20) + (partnerData.score * 0.25) + (signatures.score * 0.25) + (requiredClauses.score * 0.15) + (documentIntegrity.score * 0.15)

Set isValid to true ONLY if confidenceIndex >= 0.70.

Respond ONLY with a JSON object in this exact format, no markdown, no extra text:
{
  "isValid": true,
  "confidenceIndex": 0.85,
  "reason": "Brief overall assessment",
  "criteria": {
    "companyIdentification": { "score": 1.0, "weight": 0.20, "notes": "..." },
    "partnerData":           { "score": 0.9, "weight": 0.25, "notes": "..." },
    "signatures":            { "score": 0.8, "weight": 0.25, "notes": "..." },
    "requiredClauses":       { "score": 0.7, "weight": 0.15, "notes": "..." },
    "documentIntegrity":     { "score": 1.0, "weight": 0.15, "notes": "..." }
  }
}`,
} as const
