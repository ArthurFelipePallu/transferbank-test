<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import AuthenticatedHeader from './components/Layout/AuthenticatedHeader.vue'
import AppFooter from './components/App/AppFooter.vue'
import NotificationToast from './components/UI/NotificationToast.vue'
import LoadingOverlay from './components/UI/LoadingOverlay.vue'
import { useAuthStore } from './stores/useAuthStore'
import { useOnboardingStore } from './stores/useOnboardingStore'

const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()
const route = useRoute()

const showAuthenticatedHeader = computed(() => {
  return authStore.isAuthenticated && !!route.meta.requiresAuth
})

onMounted(() => {
  // Restore auth session if exists
  authStore.restoreSession()
  
  // Load onboarding data if exists
  onboardingStore.loadOnboardingData()
})
</script>

<template>
  <div class="app-shell">
    <AuthenticatedHeader v-if="showAuthenticatedHeader" />
    <AppHeader v-else />
    
    <!-- RouterView with transition -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    
    <AppFooter />
    
    <!-- Global UI Components -->
    <NotificationToast />
    <LoadingOverlay />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
