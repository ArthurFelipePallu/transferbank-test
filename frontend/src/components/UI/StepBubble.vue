<script setup lang="ts">
import { Check } from 'lucide-vue-next'

defineProps<{
  index: number
  isActive: boolean
  isCompleted: boolean
}>()
</script>

<template>
  <div
    class="step-bubble"
    :class="{
      'step-bubble--active': isActive,
      'step-bubble--completed': isCompleted,
    }"
    aria-hidden="true"
  >
    <Check v-if="isCompleted" class="step-bubble__check" :size="12" :stroke-width="3" />
    <span v-else class="step-bubble__index">{{ index }}</span>
  </div>
</template>

<style scoped>
.step-bubble {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: var(--font-size-xs);
  font-weight: 700;
  background: var(--color-chip-bg);
  color: var(--color-text-muted);
  border: 2px solid var(--color-chip-border);
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
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

.step-bubble__index {
  line-height: 1;
}

.step-bubble__check {
  display: block;
}

@media (min-width: 768px) {
  .step-bubble {
    width: 2rem;
    height: 2rem;
    font-size: var(--font-size-sm);
  }
}
</style>
