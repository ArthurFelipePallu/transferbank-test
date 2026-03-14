<script setup lang="ts">
defineProps<{
  label: string
  value: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <div class="info-item">
    <span class="text-uppercase small fw-semibold text-muted d-block mb-2">
      {{ label }}
    </span>
    <span 
      class="fw-medium"
      :class="{
        'text-success': variant === 'success',
        'text-warning': variant === 'warning',
        'text-danger': variant === 'danger',
        'fw-semibold': variant !== 'default'
      }"
    >
      {{ value }}
    </span>
  </div>
</template>

<style scoped>
.info-item {
  /* Minimal styling - relies on Bootstrap */
}
</style>
