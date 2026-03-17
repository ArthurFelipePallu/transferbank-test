<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, X, FileText } from 'lucide-vue-next'
import type { PartnerDocument } from '@/domain/partner/partner.types'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  modelValue: PartnerDocument[]
  label: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [files: PartnerDocument[]]
}>()

const { t } = useTranslation()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const files = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  const documents: PartnerDocument[] = newFiles.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  }))
  
  files.value = [...files.value, ...documents]
}

const removeFile = (id: string) => {
  files.value = files.value.filter((f) => f.id !== id)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const openFileDialog = () => {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="file-upload">
    <label class="file-upload-label">{{ label }}</label>
    
    <div
      class="file-upload-area"
      :class="{ 'file-upload-area--dragging': isDragging, 'file-upload-area--error': error }"
      @click="openFileDialog"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <Upload :size="32" class="upload-icon" />
      <p class="upload-text">
        <span class="upload-text-primary">{{ t('fileUpload.clickToUpload') }}</span>
        <span class="upload-text-secondary">{{ t('fileUpload.orDragAndDrop') }}</span>
      </p>
      <p class="upload-hint">{{ t('fileUpload.acceptedFormats') }}</p>
      
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/*,.pdf"
        class="file-input"
        @change="handleFileSelect"
      />
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="files.length > 0" class="file-list">
      <div
        v-for="file in files"
        :key="file.id"
        class="file-item"
      >
        <FileText :size="20" class="file-icon" />
        <div class="file-info">
          <p class="file-name">{{ file.name }}</p>
          <p class="file-size">{{ formatFileSize(file.size) }}</p>
        </div>
        <button
          type="button"
          class="file-remove"
          @click="removeFile(file.id)"
          :aria-label="t('fileUpload.removeFile')"
        >
          <X :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-upload-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-main);
  padding-left: 5px;
}

.file-upload-area {
  border: 2px dashed var(--color-input-border);
  border-radius: 0.75rem;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-white);
  position: relative;
}

.file-upload-area:hover {
  border-color: var(--color-primary-teal);
  background: var(--color-teal-alpha-2);
}

.file-upload-area--dragging {
  border-color: var(--color-primary-teal);
  background: var(--color-teal-alpha-5);
  transform: scale(1.01);
}

.file-upload-area--error {
  border-color: var(--color-error);
}

.upload-icon {
  color: var(--color-primary-teal);
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.upload-text-primary {
  color: var(--color-primary-teal);
  font-weight: 600;
}

.upload-text-secondary {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.file-input {
  display: none;
}

.error {
  font-size: 0.75rem;
  color: var(--color-error);
  padding-left: 10px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-chip-bg);
  border: 1px solid var(--color-chip-border);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.file-item:hover {
  background: var(--color-surface);
}

.file-icon {
  color: var(--color-primary-teal);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.file-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.file-remove:hover {
  color: var(--color-error);
  background: var(--color-error-alpha-10);
}

@media (min-width: 640px) {
  .file-upload-area {
    padding: 2.5rem 2rem;
  }

  .upload-text {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
