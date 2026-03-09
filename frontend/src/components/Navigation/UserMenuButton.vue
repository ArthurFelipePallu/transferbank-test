<script setup lang="ts">
import { User, ChevronDown } from 'lucide-vue-next'

defineProps<{
  companyName: string
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button class="user-button" @click="$emit('toggle')">
    <div class="user-info">
      <span class="company-name">{{ companyName }}</span>
      <User :size="18" class="user-icon" />
    </div>
    <ChevronDown :size="16" class="chevron-icon" :class="{ 'chevron-open': isOpen }" />
  </button>
</template>

<style scoped>
.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  backdrop-filter: blur(10px);
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.company-name {
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-icon {
  flex-shrink: 0;
}

.chevron-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.chevron-open {
  transform: rotate(180deg);
}

/* Tablet and up */
@media (min-width: 640px) {
  .company-name {
    max-width: 180px;
  }
}

@media (min-width: 768px) {
  .company-name {
    max-width: 200px;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1024px) {
  .company-name {
    max-width: 250px;
    font-size: 1rem;
  }
}
</style>
