<script setup lang="ts">
defineProps<{
  isCompleted: boolean
}>()
</script>

<template>
  <div
    class="step-connector"
    :class="{ 'step-connector--completed': isCompleted }"
    aria-hidden="true"
  />
</template>

<style scoped>
.step-connector {
  flex: 1;
  height: 2px;
  background: var(--color-chip-border);
  transition: background 0.25s ease;
  align-self: center;
  min-width: 0.5rem;
}

.step-connector--completed {
  background: var(--color-primary-teal);
}
</style>
