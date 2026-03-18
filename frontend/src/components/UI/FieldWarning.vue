<script setup lang="ts">
defineProps<{ message: string | null }>()
</script>

<template>
  <p v-if="message" class="field-warning mt-1">{{ message }}</p>
</template>

<style scoped>
.field-warning {
  font-size: 0.75rem;
  color: var(--color-warning-ui-text);
  background: var(--color-warning-ui-bg);
  border: 1px solid var(--color-warning-alpha-40);
  border-radius: var(--border-radius-sm);
  padding: 0.25rem 0.5rem;
  margin: 0;
  line-height: 1.4;
}
</style>
