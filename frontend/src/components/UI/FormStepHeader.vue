<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="form-step-header">
    <h2 class="h4 fw-semibold mb-2">{{ title }}</h2>
    <p class="text-muted small mb-4">{{ description }}</p>
  </div>
</template>

<style scoped>
.form-step-header {
  margin-bottom: 1rem;
}
</style>
