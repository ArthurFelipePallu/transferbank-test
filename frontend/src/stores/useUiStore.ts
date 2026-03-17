import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { NotificationType } from '@/domain/ui/types/NotificationType'

export { NotificationType }

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
  const isHeaderVisible = ref(true)

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
    return showNotification(NotificationType.Success, message, duration)
  }

  const showError = (message: string, duration?: number) => {
    return showNotification(NotificationType.Error, message, duration)
  }

  const showWarning = (message: string, duration?: number) => {
    return showNotification(NotificationType.Warning, message, duration)
  }

  const showInfo = (message: string, duration?: number) => {
    return showNotification(NotificationType.Info, message, duration)
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

  const hideHeader = () => {
    isHeaderVisible.value = false
  }

  const showHeader = () => {
    isHeaderVisible.value = true
  }

  return {
    // State
    notifications,
    isLoading,
    loadingMessage,
    isMobileMenuOpen,
    isHeaderVisible,

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
    hideHeader,
    showHeader,
  }
})
