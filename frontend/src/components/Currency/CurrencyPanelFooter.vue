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
  background: rgba(255, 255, 255, 0.05);
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}

.text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>
