<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import ReviewSection from './ReviewSection.vue'

defineProps<{
  fullName?: string
  cpf?: string
  nationality?: string
  isPep?: boolean
}>()

const { t } = useTranslation()
</script>

<template>
  <ReviewSection :title="t('partner.registration.review.personalInfo')">
    <div class="review-grid">
      <div class="review-item">
        <span class="review-label">{{ t('partner.fullName') }}</span>
        <span class="review-value">{{ fullName }}</span>
      </div>
      <div class="review-item">
        <span class="review-label">{{ t('partner.cpf') }}</span>
        <span class="review-value">{{ cpf }}</span>
      </div>
      <div class="review-item">
        <span class="review-label">{{ t('partner.nationality') }}</span>
        <span class="review-value">{{ nationality }}</span>
      </div>
      <div class="review-item">
        <span class="review-label">{{ t('partner.registration.review.pepStatus') }}</span>
        <span class="review-value">
          <span v-if="isPep" class="badge badge--warning">{{ t('common.yes') }}</span>
          <span v-else class="badge badge--success">{{ t('common.no') }}</span>
        </span>
      </div>
    </div>
  </ReviewSection>
</template>

<style scoped>
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
  background: var(--color-teal-alpha-10);
  color: var(--color-primary-teal);
}

.badge--warning {
  background: var(--color-warning-alpha-10);
  color: var(--color-warning);
}

@media (min-width: 640px) {
  .review-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
