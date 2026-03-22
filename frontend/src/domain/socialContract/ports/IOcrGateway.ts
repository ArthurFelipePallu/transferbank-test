/**
 * OCR Gateway Port — Domain Layer
 * Abstracts text extraction from documents.
 */
export interface IOcrGateway {
  extractText(file: File): Promise<string>
}
