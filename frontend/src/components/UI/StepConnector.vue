<script setup lang="ts">
defineProps<{
  isCompleted: boolean
  isAnimating?: boolean
}>()
</script>

<template>
  <div class="step-connector flex-grow-1 position-relative align-self-center" aria-hidden="true">
    <!-- Grey base track -->
    <div class="position-absolute top-0 start-0 end-0 bottom-0 rounded-1 step-connector__track" />
    <!-- Teal fill — animates width on completion, stays full when already done -->
    <div
      class="position-absolute top-0 start-0 bottom-0 rounded-1 step-connector__fill"
      :class="{
        'step-connector__fill--completed': isCompleted && !isAnimating,
        'step-connector__fill--animating': isAnimating,
      }"
    />
  </div>
</template>

<style scoped>
.step-connector {
  height: 2px;
  min-width: 0.5rem;
  /* Offset downward to align with bubble center when labels are visible */
  margin-bottom: calc(var(--font-size-xs) * var(--line-height-tight) + var(--spacing-xs));
}

.step-connector__track {
  background: var(--color-chip-border);
}

.step-connector__fill {
  width: 0%;
  background: var(--color-primary-teal);
  transition: none;
}

.step-connector__fill--completed {
  width: 100%;
}

.step-connector__fill--animating {
  width: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 639px) {
  .step-connector {
    margin-bottom: 0;
  }
}
</style>
