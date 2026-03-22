import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { OCR_SPACE_CONFIG } from './OcrSpaceConfig'

export class OcrSpaceGateway implements IOcrGateway {
  private readonly apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async extractText(file: File): Promise<string> {
    const body = new FormData()
    body.append('file', file)
    body.append('language', OCR_SPACE_CONFIG.LANGUAGE)
    body.append('OCREngine', OCR_SPACE_CONFIG.ENGINE)
    body.append('isOverlayRequired', OCR_SPACE_CONFIG.OVERLAY_REQUIRED)
    body.append('filetype', OCR_SPACE_CONFIG.FILE_TYPE)

    let response: Response
    try {
      response = await fetch(OCR_SPACE_CONFIG.ENDPOINT, {
        method: 'POST',
        headers: { apikey: this.apiKey },
        body,
      })
    } catch {
      throw new PipelineError('ocr_api', 'OCR.space network request failed')
    }

    if (!response.ok) {
      throw new PipelineError('ocr_api', `${OCR_SPACE_CONFIG.HTTP_ERROR_PREFIX} ${response.status}`)
    }

    const data = await response.json()

    if (data.IsErroredOnProcessing) {
      throw new PipelineError('ocr_api', data.ErrorMessage?.[0] ?? OCR_SPACE_CONFIG.GENERIC_ERROR)
    }

    return (data.ParsedResults as Array<{ ParsedText: string }>)
      .map((r) => r.ParsedText)
      .join('\n')
      .trim()
  }
}

