/**
 * Identifies the source of a social contract pipeline failure.
 *
 * ocr_unreadable  — OCR ran but the document produced no readable text
 *                   (scanned image, password-protected, corrupted PDF)
 * ocr_api         — OCR.space API call failed (network, invalid key, quota)
 * ai_api          — OpenAI API call failed (network, invalid key, quota, rate limit)
 * ai_response     — OpenAI responded but returned malformed / unparseable JSON
 * document_rejected — AI analyzed the document and determined it is not a valid social contract
 */
export type PipelineErrorSource =
  | 'ocr_unreadable'
  | 'ocr_api'
  | 'ai_api'
  | 'ai_response'
  | 'document_rejected'

export class PipelineError extends Error {
  readonly source: PipelineErrorSource

  constructor(source: PipelineErrorSource, message: string) {
    super(message)
    this.name = 'PipelineError'
    this.source = source
  }
}
