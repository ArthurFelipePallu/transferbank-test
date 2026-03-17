<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button 
    class="mobile-menu-button" 
    @click="$emit('toggle')"
    aria-label="Toggle menu"
  >
    <Menu v-if="!isOpen" :size="24" />
    <X v-else :size="24" />
  </button>
</template>

<style scoped>
.mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.mobile-menu-button:hover {
  background-color: var(--color-white-alpha-12);
}

.mobile-menu-button:active {
  background-color: var(--color-white-alpha-20);
}

@media (min-width: 768px) {
  .mobile-menu-button {
    display: none;
  }
}
</style>
