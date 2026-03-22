import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import type { DocumentAnalysisResult } from '@/domain/socialContract/entities/DocumentAnalysisResult'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { DOCUMENT_CONFIDENCE_THRESHOLD } from '@/domain/socialContract/entities/DocumentAnalysisResult'

/**
 * Document analysis gateway that delegates to our own backend proxy.
 * The backend holds the OpenAI API key — nothing sensitive reaches the browser.
 */
export class BackendDocumentAnalysisGateway implements IDocumentAnalysisGateway {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async analyze(extractedText: string): Promise<DocumentAnalysisResult> {
    let response: Response
    try {
      response = await fetch(`${this.baseUrl}/api/document/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }),
      })
    } catch {
      throw new PipelineError('ai_api', 'Backend AI request failed (network error)')
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const source = data?.source ?? 'ai_api'
      throw new PipelineError(source, data?.message ?? `AI request failed: ${response.status}`)
    }

    if (!data || typeof data.confidenceIndex !== 'number') {
      throw new PipelineError('ai_response', 'Unexpected response format from AI analysis')
    }

    // Enforce threshold client-side as a safety net
    const result = data as DocumentAnalysisResult
    result.isValid = result.confidenceIndex >= DOCUMENT_CONFIDENCE_THRESHOLD
    return result
  }
}
