<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  total: number
  remaining: number
}>()

const { t } = useTranslation()

const percent  = computed(() => Math.min(100, props.total))
const variant  = computed(() => {
  if (Math.abs(props.total - 100) < 0.01) return 'bg-success'
  if (props.total > 100) return 'bg-danger'
  return 'bg-primary'
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between small text-muted mb-1">
      <span>
        {{ t('onboarding.partnersStep.totalShareholding') }}:
        <strong>{{ total.toFixed(2) }}%</strong>
      </span>
      <span>
        {{ t('onboarding.partnersStep.remaining') }}:
        <strong>{{ remaining.toFixed(2) }}%</strong>
      </span>
    </div>
    <div class="progress" style="height: 5px;" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar" :class="variant" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
