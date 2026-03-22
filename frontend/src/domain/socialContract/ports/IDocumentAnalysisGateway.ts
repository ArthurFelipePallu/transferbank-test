import type { DocumentAnalysisResult } from '@/domain/socialContract/entities/DocumentAnalysisResult'

/**
 * Document Analysis Gateway Port — Domain Layer
 * Abstracts AI-based validation of document text.
 */
export interface IDocumentAnalysisGateway {
  analyze(extractedText: string): Promise<DocumentAnalysisResult>
}
