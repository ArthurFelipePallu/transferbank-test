import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import type { DocumentAnalysisResult } from '@/domain/socialContract/entities/DocumentAnalysisResult'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { OPENAI_CONFIG, CONFIDENCE_THRESHOLD } from './OpenAiConfig'

const TEXT_TRUNCATION_LIMIT = 12_000

export class OpenAiDocumentAnalysisGateway implements IDocumentAnalysisGateway {
  private readonly apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async analyze(extractedText: string): Promise<DocumentAnalysisResult> {
    // Truncate to stay within token limits while preserving the most relevant content
    const truncated = extractedText.slice(0, TEXT_TRUNCATION_LIMIT)

    let response: Response
    try {
      response = await fetch(OPENAI_CONFIG.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.MODEL,
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: OPENAI_CONFIG.TEMPERATURE,
          messages: [
            { role: 'system', content: OPENAI_CONFIG.SYSTEM_PROMPT },
            { role: 'user', content: truncated },
          ],
        }),
      })
    } catch {
      throw new PipelineError('ai_api', 'OpenAI network request failed')
    }

    if (!response.ok) {
      throw new PipelineError('ai_api', `OpenAI request failed: ${response.status}`)
    }

    const data = await response.json()
    const content: string = data.choices?.[0]?.message?.content ?? ''

    try {
      const parsed = JSON.parse(content) as DocumentAnalysisResult
      // Enforce the threshold server-side regardless of what the model returned
      parsed.isValid = parsed.confidenceIndex >= CONFIDENCE_THRESHOLD
      return parsed
    } catch {
      throw new PipelineError('ai_response', 'Unexpected response format from AI analysis')
    }
  }
}
