import { computed } from 'vue'
import { useSocialContractOcr } from './useSocialContractOcr'
import { useSocialContractAnalysis } from './useSocialContractAnalysis'
import { getOcrGateway } from '@/infrastructure/ocr/ocrGatewayFactory'
import { getDocumentAnalysisGateway } from '@/infrastructure/ai/openAiGatewayFactory'
import type { PipelineError } from '@/domain/socialContract/errors/PipelineError'

/**
 * Orchestrates the full social contract validation pipeline:
 * 1. OCR — extract text from the PDF
 * 2. AI analysis — validate the extracted text
 *
 * OCR errors take priority over AI errors in `pipelineError`.
 */
export function useSocialContractPipeline() {
  const ocr = useSocialContractOcr(getOcrGateway())
  const analysis = useSocialContractAnalysis(getDocumentAnalysisGateway())

  const isProcessing = computed(() => ocr.isLoading.value || analysis.isLoading.value)
  const isPassed = computed(() => ocr.isValid.value && analysis.result.value?.isValid === true)

  /** OCR error takes priority; falls back to AI error. Null when no error. */
  const pipelineError = computed<PipelineError | null>(
    () => ocr.pipelineError.value ?? analysis.pipelineError.value,
  )

  const run = async (file: File): Promise<void> => {
    ocr.reset()
    analysis.reset()

    await ocr.extract(file)

    if (ocr.isValid.value && ocr.extractedText.value) {
      await analysis.analyze(ocr.extractedText.value)
    }
  }

  const reset = (): void => {
    ocr.reset()
    analysis.reset()
  }

  return {
    // OCR state
    isOcrLoading: ocr.isLoading,
    isOcrValid: ocr.isValid,
    // Analysis state
    isAiLoading: analysis.isLoading,
    aiResult: analysis.result,
    // Combined
    isProcessing,
    isPassed,
    pipelineError,
    run,
    reset,
  }
}
