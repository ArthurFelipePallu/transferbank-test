<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()
const { notifications } = storeToRefs(uiStore)

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return Info
  }
}
</script>

<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification--${notification.type}`"
      >
        <component :is="getIcon(notification.type)" :size="20" class="notification-icon" />
        <p class="notification-message">{{ notification.message }}</p>
        <button
          class="notification-close"
          @click="uiStore.removeNotification(notification.id)"
          aria-label="Close notification"
        >
          <X :size="18" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: calc(100vw - 2rem);
  width: 400px;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--color-white);
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  pointer-events: auto;
  min-height: 60px;
}

.notification--success {
  border-left-color: var(--color-primary-teal);
}

.notification--success .notification-icon {
  color: var(--color-primary-teal);
}

.notification--error {
  border-left-color: var(--color-error);
}

.notification--error .notification-icon {
  color: var(--color-error);
}

.notification--warning {
  border-left-color: var(--color-warning);
}

.notification--warning .notification-icon {
  color: var(--color-warning);
}

.notification--info {
  border-left-color: var(--color-primary-teal);
}

.notification--info .notification-icon {
  color: var(--color-primary-teal);
}

.notification-icon {
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-text-main);
  margin: 0;
  line-height: 1.4;
}

.notification-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: var(--color-chip-bg);
  color: var(--color-text-main);
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

@media (max-width: 640px) {
  .notification-container {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    width: auto;
  }

  .notification {
    padding: 0.875rem 1rem;
  }

  .notification-message {
    font-size: 0.85rem;
  }
}
</style>
