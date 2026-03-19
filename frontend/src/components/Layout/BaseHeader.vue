<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/useUiStore'
import { useScrollVisibility } from '@/composables/ui/useScrollVisibility'

const uiStore = useUiStore()
const { isHeaderVisible } = storeToRefs(uiStore)

// Registers scroll listener — updates uiStore.isHeaderVisible
useScrollVisibility()
</script>

<template>
  <header class="base-header" :class="{ 'base-header--hidden': !isHeaderVisible }">
    <div class="base-header-inner">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.base-header {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  color: var(--color-white);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  overflow: visible;

  /* Smooth hide/show — matches React example's duration + easing */
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  will-change: transform, opacity;
}

.base-header--hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.base-header-inner {
  width: 100%;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  overflow: visible;
}

@media (min-width: 768px) {
  .base-header-inner {
    padding: 0.9rem 1.25rem;
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .base-header-inner {
    max-width: 80%;
    padding: 0.9rem 1.5rem;
    gap: 1.5rem;
  }
}

@media (min-width: 1920px) {
  .base-header-inner {
    max-width: 1536px;
  }
}
</style>
