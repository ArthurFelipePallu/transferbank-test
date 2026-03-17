<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { IconName } from '@/utils/LucideIconMap'

defineProps<{
  title: string
  description: string
  variant?: 'default' | 'primary'
  icon?: IconName
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="btn w-100 text-start action-card"
    :class="{ 'action-card-primary': variant === 'primary' }"
    @click="emit('click')"
  >
    <div class="d-flex align-items-center gap-3">
      <div v-if="icon" class="icon-wrapper flex-shrink-0 action-card-icon-bg">
        <BaseLucideIcon
          :name="icon"
          :size="20"
          :color="variant === 'primary' ? 'white' : 'var(--color-primary-teal)'"
        />
      </div>
      <div class="flex-grow-1 text-start">
        <h3 class="h6 fw-semibold mb-1">{{ title }}</h3>
        <p class="small mb-0" :class="variant === 'primary' ? 'opacity-90' : 'text-muted'">
          {{ description }}
        </p>
      </div>
      <ArrowRight :size="20" class="flex-shrink-0 action-card-arrow" />
    </div>
  </button>
</template>

<style scoped>
.action-card {
  padding: 1.25rem;
  background: var(--bs-light);
  border: 1px solid var(--bs-border-color);
  transition: all 0.2s ease;
  height: 100%;
  align-items: stretch;
}

.action-card:hover {
  border-color: var(--color-primary-teal);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-weak);
}

.action-card-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  color: white;
}

.action-card-primary:hover {
  color: white;
}

.action-card-icon-bg {
  background: var(--color-teal-alpha-10);
  border-radius: var(--border-radius-md);
}

.action-card-primary .action-card-icon-bg {
  background: var(--color-white-alpha-20);
}

.action-card-arrow {
  color: var(--color-primary-teal);
  transition: transform 0.2s ease;
}

.action-card-primary .action-card-arrow {
  color: white;
}

.action-card:hover .action-card-arrow {
  transform: translateX(4px);
}
</style>
