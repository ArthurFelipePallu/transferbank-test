import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import type { DocumentAnalysisResult } from '@/domain/socialContract/entities/DocumentAnalysisResult'

/**
 * Use case: analyze extracted text to determine if it is a valid social contract.
 */
export async function analyzeSocialContract(
  gateway: IDocumentAnalysisGateway,
  extractedText: string,
): Promise<DocumentAnalysisResult> {
  return gateway.analyze(extractedText)
}
