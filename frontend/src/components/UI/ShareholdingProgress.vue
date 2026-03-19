<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  total: number
  remaining: number
}>()

const { t } = useTranslation()

const percent  = computed(() => Math.min(100, Number(props.total) || 0))
const barVariant = computed(() => {
  const total = Number(props.total) || 0
  if (Math.abs(total - 100) < 0.01) return 'bg-success'
  if (total > 100) return 'bg-danger'
  return 'bg-primary'
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between small text-muted mb-1">
      <span>
        {{ t('onboarding.partnersStep.totalShareholding') }}:
        <strong>{{ Number(total).toFixed(2) }}%</strong>
      </span>
      <span>
        {{ t('onboarding.partnersStep.remaining') }}:
        <strong>{{ Number(remaining).toFixed(2) }}%</strong>
      </span>
    </div>
    <div class="progress" style="height: 5px;" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar" :class="barVariant" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
