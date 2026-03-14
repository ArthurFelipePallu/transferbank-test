<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  variant?: 'default' | 'primary'
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
    <div class="d-flex justify-content-between align-items-center">
      <div class="flex-grow-1">
        <h3 class="h6 fw-semibold mb-1">{{ title }}</h3>
        <p 
          class="small mb-0"
          :class="variant === 'primary' ? 'opacity-90' : 'text-muted'"
        >
          {{ description }}
        </p>
      </div>
      <ArrowRight :size="24" class="flex-shrink-0 ms-3" />
    </div>
  </button>
</template>

<style scoped>
.action-card {
  padding: 1.25rem;
  background: var(--bs-light);
  border: 1px solid var(--bs-border-color);
  transition: all 0.2s ease;
}

.action-card:hover {
  border-color: var(--color-primary-teal);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-card-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  color: white;
}

.action-card-primary:hover {
  color: white;
}

.action-card svg {
  color: var(--color-primary-teal);
  transition: transform 0.2s ease;
}

.action-card-primary svg {
  color: white;
}

.action-card:hover svg {
  transform: translateX(4px);
}
</style>
