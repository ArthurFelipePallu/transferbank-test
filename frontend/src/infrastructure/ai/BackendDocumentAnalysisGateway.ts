import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import type { DocumentAnalysisResult } from '@/domain/socialContract/entities/DocumentAnalysisResult'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { DOCUMENT_CONFIDENCE_THRESHOLD } from '@/domain/socialContract/entities/DocumentAnalysisResult'
import { axiosInstance } from '@/api/axiosInstance'
import axios from 'axios'

const ANALYZE_ENDPOINT = '/api/document/analyze'

/**
 * Document analysis gateway that delegates to the backend proxy via axiosInstance.
 * The backend holds the OpenAI API key — nothing sensitive reaches the browser.
 */
export class BackendDocumentAnalysisGateway implements IDocumentAnalysisGateway {
  async analyze(extractedText: string): Promise<DocumentAnalysisResult> {
    try {
      const response = await axiosInstance.post<DocumentAnalysisResult>(
        ANALYZE_ENDPOINT,
        { text: extractedText },
      )
      const result = response.data
      result.isValid = result.confidenceIndex >= DOCUMENT_CONFIDENCE_THRESHOLD
      return result
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data
        const source = data?.source ?? 'ai_api'
        throw new PipelineError(source, data?.message ?? `AI request failed: ${error.response?.status}`)
      }
      throw new PipelineError('ai_api', 'Backend AI request failed (network error)')
    }
  }
}