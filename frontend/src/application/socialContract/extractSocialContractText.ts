import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'

/**
 * Use case: extract text from a social contract PDF via OCR.
 * Throws PipelineError('ocr_unreadable') if the document produces no readable text.
 */
export async function extractSocialContractText(
  gateway: IOcrGateway,
  file: File,
): Promise<string> {
  const text = await gateway.extractText(file)

  if (!text.trim()) {
    throw new PipelineError('ocr_unreadable', 'Document produced no readable text')
  }

  return text
}
