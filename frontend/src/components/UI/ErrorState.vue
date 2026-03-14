<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

defineProps<{
  message: string
  variant?: 'danger' | 'warning' | 'info'
}>()
</script>

<template>
  <div 
    class="alert" 
    :class="`alert-${variant || 'danger'}`" 
    role="alert"
  >
    <BaseLucideIcon name="TriangleAlert" :size="16" class="me-2" />
    {{ message }}
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: center;
}
</style>
