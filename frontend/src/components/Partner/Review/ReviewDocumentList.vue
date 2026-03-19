<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useTranslation } from '@/composables/i18n/useTranslation'
import ReviewSection from './ReviewSection.vue'
import type { PartnerDocument } from '@/domain/partner/partner.types'

defineProps<{
  documents?: PartnerDocument[]
}>()

const { t } = useTranslation()

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>

<template>
  <ReviewSection :title="t('partner.documents')">
    <div class="documents-list">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="document-item"
      >
        <Check :size="16" class="document-check" />
        <div class="document-info">
          <span class="document-name">{{ doc.name }}</span>
          <span class="document-size">{{ formatFileSize(doc.size) }}</span>
        </div>
      </div>
    </div>
  </ReviewSection>
</template>

<style scoped>
.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-chip-bg);
  border-radius: 0.5rem;
}

.document-check {
  color: var(--color-primary-teal);
  flex-shrink: 0;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.document-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-size {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
