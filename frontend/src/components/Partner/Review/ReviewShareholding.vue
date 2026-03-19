<script setup lang="ts">
import { useTranslation } from '@/composables/i18n/useTranslation'
import ReviewSection from './ReviewSection.vue'

defineProps<{
  shareholding?: number
}>()

const { t } = useTranslation()
</script>

<template>
  <ReviewSection :title="t('partner.shareholding')">
    <div class="shareholding-display">
      <span class="shareholding-value">{{ shareholding }}%</span>
      <span class="shareholding-label">{{ t('partner.registration.review.ownershipPercentage') }}</span>
    </div>
  </ReviewSection>
</template>

<style scoped>
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
</style>
