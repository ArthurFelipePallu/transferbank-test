<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import BaseButton from '@/components/UI/BaseButton.vue'
import type { PartnerFormValues } from '@/domain/partner/partner.schema'

defineProps<{
  formData: Partial<PartnerFormValues>
}>()

const emit = defineEmits<{
  submit: []
  back: []
}>()

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<template>
  <div class="review-step">
    <h2 class="form-title">Review Information</h2>
    <p class="form-description">Please review all information before submitting</p>

    <div class="review-sections">
      <!-- Personal Information -->
      <div class="review-section">
        <h3 class="section-title">Personal Information</h3>
        <div class="review-grid">
          <div class="review-item">
            <span class="review-label">Full Name</span>
            <span class="review-value">{{ formData.fullName }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">CPF</span>
            <span class="review-value">{{ formData.cpf }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">Nationality</span>
            <span class="review-value">{{ formData.nationality }}</span>
          </div>
          <div class="review-item">
            <span class="review-label">PEP Status</span>
            <span class="review-value">
              <span v-if="formData.isPep" class="badge badge--warning">Yes</span>
              <span v-else class="badge badge--success">No</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Shareholding -->
      <div class="review-section">
        <h3 class="section-title">Shareholding</h3>
        <div class="shareholding-display">
          <span class="shareholding-value">{{ formData.shareholding }}%</span>
          <span class="shareholding-label">Ownership Percentage</span>
        </div>
      </div>

      <!-- Documents -->
      <div class="review-section">
        <h3 class="section-title">Documents</h3>
        <div class="documents-list">
          <div
            v-for="doc in formData.documents"
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
      </div>
    </div>

    <div class="form-actions">
      <BaseButton variant="outline" @click="$emit('back')">
        Back
      </BaseButton>
      <BaseButton variant="primary" @click="$emit('submit')">
        Submit Partner
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.review-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
}

.form-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: -0.75rem 0 0;
}

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-section {
  padding: 1.25rem;
  background: var(--color-white);
  border: 1px solid var(--color-surface-border);
  border-radius: 0.75rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-surface-border);
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-item--full {
  grid-column: 1 / -1;
}

.review-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.review-value {
  font-size: 0.95rem;
  color: var(--color-text-main);
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--success {
  background: rgba(28, 156, 140, 0.1);
  color: var(--color-primary-teal);
}

.badge--warning {
  background: rgba(244, 194, 29, 0.1);
  color: var(--color-warning);
}

.shareholding-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border-radius: 0.75rem;
  color: var(--color-white);
}

.shareholding-value {
  font-size: 2.5rem;
  font-weight: 700;
}

.shareholding-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .form-title {
    font-size: 1.6rem;
  }

  .review-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    justify-content: flex-end;
  }
}
</style>
