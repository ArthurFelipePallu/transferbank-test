<script setup lang="ts">
import { ref } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { formatFileSize } from '@/domain/socialContract/entities/DocumentAnalysisResult'

defineProps<{
  fileName?: string
  fileSizeBytes?: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
  remove: []
  preview: []
}>()

const { t } = useTranslation()
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const handleDrop = (e: DragEvent): void => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('fileSelected', file)
}

const handleFileChange = (e: Event): void => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('fileSelected', file)
  input.value = ''
}

const handleBrowseClick = (): void => { fileInputRef.value?.click() }
</script>

<template>
  <div>
    <div
      class="drop-zone rounded-3 border border-2 d-flex flex-column align-items-center justify-content-center gap-2 p-4"
      :class="{
        'drop-zone--active': isDragging,
        'drop-zone--filled': !!fileName,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="!fileName && handleBrowseClick()"
    >
      <template v-if="!fileName">
        <BaseLucideIcon name="CloudUpload" :size="36" class="text-muted" />
        <p class="mb-0 text-muted small text-center">
          {{ t('onboarding.socialContractStep.dropHint') }}
        </p>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click.stop="handleBrowseClick"
        >
          {{ t('onboarding.socialContractStep.browse') }}
        </button>
      </template>

      <template v-else>
        <div class="d-flex align-items-center gap-3 w-100">
          <BaseLucideIcon name="FileText" :size="32" class="text-primary flex-shrink-0" />
          <div class="flex-grow-1 overflow-hidden">
            <p class="mb-0 fw-semibold text-truncate small">{{ fileName }}</p>
            <p class="mb-0 text-muted small opacity-75">{{ formatFileSize(fileSizeBytes ?? 0) }}</p>
          </div>
          <div class="d-flex gap-2 flex-shrink-0">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              :disabled="disabled"
              @click.stop="emit('preview')"
            >
              <BaseLucideIcon name="Eye" :size="14" />
              {{ t('onboarding.socialContractStep.preview') }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              :disabled="disabled"
              @click.stop="emit('remove')"
            >
              <BaseLucideIcon name="Trash2" :size="14" />
            </button>
          </div>
        </div>
      </template>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="application/pdf"
      class="d-none"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.drop-zone {
  border-color: var(--bs-border-color) !important;
  border-style: dashed !important;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  min-height: 160px;
}

.drop-zone:hover,
.drop-zone--active {
  border-color: var(--bs-primary) !important;
  background-color: color-mix(in srgb, var(--bs-primary) 5%, transparent);
}

.drop-zone--filled {
  cursor: default;
  border-style: solid !important;
  border-color: var(--bs-success) !important;
}
</style>
