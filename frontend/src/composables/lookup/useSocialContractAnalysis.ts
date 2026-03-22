import { ref } from 'vue'
import type { IDocumentAnalysisGateway } from '@/domain/socialContract/ports/IDocumentAnalysisGateway'
import type { DocumentAnalysisResult } from '@/domain/socialContract/entities/DocumentAnalysisResult'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { analyzeSocialContract } from '@/application/socialContract/analyzeSocialContract'

export function useSocialContractAnalysis(gateway: IDocumentAnalysisGateway) {
  const isLoading = ref(false)
  const result = ref<DocumentAnalysisResult | null>(null)
  const pipelineError = ref<PipelineError | null>(null)

  const analyze = async (extractedText: string): Promise<void> => {
    isLoading.value = true
    result.value = null
    pipelineError.value = null

    try {
      result.value = await analyzeSocialContract(gateway, extractedText)
    } catch (err) {
      pipelineError.value =
        err instanceof PipelineError
          ? err
          : new PipelineError('ai_api', err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      isLoading.value = false
    }
  }

  const reset = (): void => {
    result.value = null
    pipelineError.value = null
    isLoading.value = false
  }

  return { isLoading, result, pipelineError, analyze, reset }
}
