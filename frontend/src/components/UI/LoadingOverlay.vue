<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { Loader2 } from 'lucide-vue-next'
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()
const { isLoading, loadingMessage } = storeToRefs(uiStore)
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <Loader2 :size="48" class="loading-spinner" />
        <p class="loading-message">{{ loadingMessage }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-black-alpha-50);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: var(--color-white);
  border-radius: 1rem;
  box-shadow: 0 8px 32px var(--color-black-alpha-20);
  min-width: 200px;
}

.loading-spinner {
  color: var(--color-primary-teal);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-message {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-main);
  margin: 0;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
