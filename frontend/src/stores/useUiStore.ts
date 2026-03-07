import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

export const useUiStore = defineStore('ui', () => {
  // State
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const loadingMessage = ref<string>('')
  const isMobileMenuOpen = ref(false)

  // Getters
  const hasNotifications = computed(() => notifications.value.length > 0)
  const latestNotification = computed(() => notifications.value[notifications.value.length - 1])

  // Actions
  const showNotification = (
    type: NotificationType,
    message: string,
    duration: number = 5000,
  ) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      duration,
    }

    notifications.value.push(notification)

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }

    return notification.id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const showSuccess = (message: string, duration?: number) => {
    return showNotification('success', message, duration)
  }

  const showError = (message: string, duration?: number) => {
    return showNotification('error', message, duration)
  }

  const showWarning = (message: string, duration?: number) => {
    return showNotification('warning', message, duration)
  }

  const showInfo = (message: string, duration?: number) => {
    return showNotification('info', message, duration)
  }

  const startLoading = (message: string = 'Loading...') => {
    isLoading.value = true
    loadingMessage.value = message
  }

  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const openMobileMenu = () => {
    isMobileMenuOpen.value = true
  }

  return {
    // State
    notifications,
    isLoading,
    loadingMessage,
    isMobileMenuOpen,

    // Getters
    hasNotifications,
    latestNotification,

    // Actions
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    startLoading,
    stopLoading,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
  }
})
