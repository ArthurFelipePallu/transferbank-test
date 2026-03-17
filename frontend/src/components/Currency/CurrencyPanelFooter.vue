<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="panel-footer p-3 border-top">
    <p class="text-muted small mb-0 text-center">
      <BaseLucideIcon name="Info" :size="14" class="me-1" />
      {{ message || 'Rates update automatically' }}
    </p>
  </div>
</template>

<style scoped>
.panel-footer {
  background: var(--color-white-alpha-5);
  border-top-color: var(--color-white-alpha-10) !important;
}

.text-muted {
  color: var(--color-white-alpha-70) !important;
}
</style>
