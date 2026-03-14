<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

defineProps<{
  title?: string
  subtitle?: string
  iconName?: string
}>()
</script>

<template>
  <div class="panel-header p-4 border-bottom">
    <div class="d-flex align-items-center gap-3">
      <div class="icon-wrapper">
        <BaseLucideIcon :name="iconName || 'TrendingUp'" :size="24" />
      </div>
      <div>
        <h2 class="h5 mb-1 fw-bold">{{ title || 'Market Information' }}</h2>
        <p class="text-muted small mb-0">{{ subtitle || 'Real-time currency rates' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>
