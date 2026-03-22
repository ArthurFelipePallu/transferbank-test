<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import PdfPreviewModal from '@/components/UI/PdfPreviewModal.vue'
import PdfDropZone from '@/components/SocialContract/PdfDropZone.vue'
import DocumentAnalysisResultCard from '@/components/SocialContract/DocumentAnalysisResultCard.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { useSocialContractPipeline } from '@/composables/lookup/useSocialContractPipeline'
import {
  SOCIAL_CONTRACT_MAX_SIZE_BYTES,
  SOCIAL_CONTRACT_ACCEPTED_TYPE,
} from '@/domain/validation/ValidationConstants'
import type { SocialContractFile } from '@/domain/onboarding/onboarding.types'
import type { PipelineErrorSource } from '@/domain/socialContract/errors/PipelineError'
import type { IconName } from '@/utils/LucideIconMap'

const emit = defineEmits<{
  next: [file: SocialContractFile]
  back: []
}>()

const { t } = useTranslation()
const {
  isOcrLoading,
  isOcrValid,
  isAiLoading,
  aiResult,
  isProcessing,
  isPassed,
  pipelineError,
  run,
  reset: resetPipeline,
} = useSocialContractPipeline()

const selected = ref<SocialContractFile | null>(null)
const validationError = ref<string | null>(null)
const showPreview = ref(false)

const canProceed = computed(() => selected.value !== null && !isProcessing.value && isPassed.value)

const SOURCE_ICON: Record<PipelineErrorSource, IconName> = {
  ocr_unreadable: 'FileX',
  ocr_api: 'ServerCrash',
  ai_api: 'ServerCrash',
  ai_response: 'BrainCircuit',
  document_rejected: 'ShieldX',
}

const pipelineErrorMessage = computed<string | null>(() => {
  const source = pipelineError.value?.source
  if (!source || source === 'document_rejected') return null
  return t(`onboarding.socialContractStep.errors.${source}`)
})

const pipelineErrorIcon = computed<IconName>(() =>
  pipelineError.value ? SOURCE_ICON[pipelineError.value.source] : 'AlertCircle',
)

const applyFile = async (file: File): Promise<void> => {
  validationError.value = null

  if (file.type !== SOCIAL_CONTRACT_ACCEPTED_TYPE) {
    validationError.value = t('onboarding.socialContractStep.errorType')
    return
  }
  if (file.size > SOCIAL_CONTRACT_MAX_SIZE_BYTES) {
    validationError.value = t('onboarding.socialContractStep.errorSize')
    return
  }

  if (selected.value) URL.revokeObjectURL(selected.value.objectUrl)

  selected.value = {
    file,
    name: file.name,
    sizeBytes: file.size,
    objectUrl: URL.createObjectURL(file),
  }

  await run(file)
}

const handleRemove = (): void => {
  if (selected.value) URL.revokeObjectURL(selected.value.objectUrl)
  selected.value = null
  validationError.value = null
  resetPipeline()
}

const handlePreview = (): void => {
  showPreview.value = true
}

const closePreview = (): void => {
  showPreview.value = false
}

const submit = (): void => {
  if (!selected.value) return
  emit('next', selected.value)
}

onBeforeUnmount(() => {
  if (selected.value) URL.revokeObjectURL(selected.value.objectUrl)
})
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.steps.socialContract.title')"
      :description="t('onboarding.steps.socialContract.description')"
    />

    <PdfDropZone
      class="mb-3"
      :file-name="selected?.name"
      :file-size-bytes="selected?.sizeBytes"
      :disabled="isProcessing"
      @file-selected="applyFile"
      @remove="handleRemove"
      @preview="handlePreview"
    />

    <!-- File validation error -->
    <p v-if="validationError" class="text-danger small mb-3 d-flex align-items-center gap-1">
      <BaseLucideIcon name="AlertCircle" :size="14" />
      {{ validationError }}
    </p>

    <!-- Pipeline status -->
    <div v-if="selected" class="mb-3">

      <!-- OCR loading -->
      <p v-if="isOcrLoading" class="text-muted small mb-2 d-flex align-items-center gap-2">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ t('onboarding.socialContractStep.ocrExtracting') }}
      </p>

      <!-- AI loading (only after OCR succeeds) -->
      <p
        v-else-if="isOcrValid && isAiLoading"
        class="text-muted small mb-2 d-flex align-items-center gap-2"
      >
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ t('onboarding.socialContractStep.aiAnalyzing') }}
      </p>

      <!-- Source-specific pipeline error -->
      <div
        v-else-if="pipelineErrorMessage"
        class="alert alert-danger d-flex align-items-start gap-2 py-2 px-3 small mb-2"
        role="alert"
      >
        <BaseLucideIcon :name="pipelineErrorIcon" :size="16" class="flex-shrink-0 mt-1" />
        <span>{{ pipelineErrorMessage }}</span>
      </div>

      <!-- AI analysis result card (handles document_rejected internally) -->
      <DocumentAnalysisResultCard
        v-else-if="isOcrValid && aiResult"
        :result="aiResult"
      />
    </div>

    <p class="text-muted small mb-3">
      {{ t('onboarding.socialContractStep.sizeHint') }}
    </p>

    <FormNavigation
      :show-back="true"
      :next-disabled="!canProceed"
      @back="emit('back')"
      @next="submit"
    />

    <PdfPreviewModal
      v-if="showPreview && selected"
      :object-url="selected.objectUrl"
      :file-name="selected.name"
      @close="closePreview"
    />
  </form>
</template>
