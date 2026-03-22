<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

defineProps<{
  index: number
  isActive: boolean
  isCompleted: boolean
  /** When false, always show the index number even if the step is completed */
  showCheckmark: boolean
}>()
</script>

<template>
  <div
    class="step-bubble rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
    :class="{
      'step-bubble--active': isActive,
      'step-bubble--completed': isCompleted && !isActive,
    }"
    aria-hidden="true"
  >
    <BaseLucideIcon
      v-if="isCompleted && showCheckmark"
      name="Check"
      :size="12"
      :stroke-width="3"
    />
    <span v-else class="lh-1">{{ index }}</span>
  </div>
</template>

<style scoped>
.step-bubble {
  width: 1.75rem;
  height: 1.75rem;
  font-size: var(--font-size-xs);
  background: var(--color-chip-bg);
  color: var(--color-text-muted);
  border: 2px solid var(--color-chip-border);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
}

.step-bubble--active {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  border-color: var(--color-primary-teal);
  box-shadow: var(--shadow-step-bubble-active);
}

.step-bubble--completed {
  background: var(--color-primary-teal);
  color: var(--color-white);
  border-color: var(--color-primary-teal);
}

@media (min-width: 768px) {
  .step-bubble {
    width: 2rem;
    height: 2rem;
    font-size: var(--font-size-sm);
  }
}
</style>
