import { ref } from 'vue'
import type { IOcrGateway } from '@/domain/socialContract/ports/IOcrGateway'
import { PipelineError } from '@/domain/socialContract/errors/PipelineError'
import { extractSocialContractText } from '@/application/socialContract/extractSocialContractText'

export function useSocialContractOcr(gateway: IOcrGateway) {
  const isLoading = ref(false)
  const extractedText = ref<string | null>(null)
  const pipelineError = ref<PipelineError | null>(null)
  const isValid = ref(false)

  const extract = async (file: File): Promise<void> => {
    isLoading.value = true
    extractedText.value = null
    pipelineError.value = null
    isValid.value = false

    try {
      extractedText.value = await extractSocialContractText(gateway, file)
      isValid.value = true
    } catch (err) {
      pipelineError.value =
        err instanceof PipelineError
          ? err
          : new PipelineError('ocr_api', err instanceof Error ? err.message : 'OCR failed')
    } finally {
      isLoading.value = false
    }
  }

  const reset = (): void => {
    extractedText.value = null
    pipelineError.value = null
    isLoading.value = false
    isValid.value = false
  }

  return { isLoading, extractedText, pipelineError, isValid, extract, reset }
}
