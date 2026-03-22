import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'

/**
 * OCR gateway that delegates to our own backend proxy.
 * The backend holds the OCR.space API key — nothing sensitive reaches the browser.
 */
export class BackendOcrGateway implements IOcrGateway {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async extractText(file: File): Promise<string> {
    const body = new FormData()
    body.append('file', file)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}/api/document/extract-text`, {
        method: 'POST',
        body,
      })
    } catch {
      throw new PipelineError('ocr_api', 'Backend OCR request failed (network error)')
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const source = data?.source ?? 'ocr_api'
      throw new PipelineError(source, data?.message ?? `OCR request failed: ${response.status}`)
    }

    return data?.text ?? ''
  }
}
