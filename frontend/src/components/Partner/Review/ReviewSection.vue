<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="review-section">
    <h3 class="section-title">{{ title }}</h3>
    <slot />
  </div>
</template>

<style scoped>
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
</style>
