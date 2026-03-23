import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { axiosInstance } from '@/api/axiosInstance'
import axios from 'axios'

const OCR_ENDPOINT = '/api/document/extract-text'

/**
 * OCR gateway that delegates to the backend proxy via axiosInstance.
 * The backend holds the OCR.space API key — nothing sensitive reaches the browser.
 */
export class BackendOcrGateway implements IOcrGateway {
  async extractText(file: File): Promise<string> {
    const body = new FormData()
    body.append('file', file)

    try {
      const response = await axiosInstance.post<{ text: string }>(OCR_ENDPOINT, body)
      return response.data?.text ?? ''
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data
        const source = data?.source ?? 'ocr_api'
        throw new PipelineError(source, data?.message ?? `OCR request failed: ${error.response?.status}`)
      }
      throw new PipelineError('ocr_api', 'Backend OCR request failed (network error)')
    }
  }
}