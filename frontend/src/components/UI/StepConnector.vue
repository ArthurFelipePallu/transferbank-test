<script setup lang="ts">
defineProps<{
  isCompleted: boolean
  isAnimating?: boolean
}>()
</script>

<template>
  <div class="step-connector" aria-hidden="true">
    <!-- Base track -->
    <div class="step-connector__track" />
    <!-- Fill overlay: animates width 0->100% when isAnimating, stays full when completed -->
    <div
      class="step-connector__fill"
      :class="{
        'step-connector__fill--completed': isCompleted && !isAnimating,
        'step-connector__fill--animating': isAnimating,
      }"
    />
  </div>
</template>

<style scoped>
.step-connector {
  flex: 1;
  position: relative;
  height: 2px;
  align-self: center;
  /* Push connector down to align with bubble center when labels are shown */
  margin-bottom: calc(var(--font-size-xs) * var(--line-height-tight) + var(--spacing-xs));
  min-width: 0.5rem;
}

/* Grey base track */
.step-connector__track {
  position: absolute;
  inset: 0;
  background: var(--color-chip-border);
  border-radius: 1px;
}

/* Teal fill overlay */
.step-connector__fill {
  position: absolute;
  inset: 0;
  background: var(--color-primary-teal);
  border-radius: 1px;
  width: 0%;
  transition: none;
}

/* Already completed — instant full width, no animation */
.step-connector__fill--completed {
  width: 100%;
}

/* Just completed — animate from 0 to 100% */
.step-connector__fill--animating {
  width: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* On mobile, no label offset needed */
@media (max-width: 639px) {
  .step-connector {
    margin-bottom: 0;
  }
}
</style>
