<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import AppFooter from './components/App/AppFooter.vue'
import NotificationToast from './components/UI/NotificationToast.vue'
import LoadingOverlay from './components/UI/LoadingOverlay.vue'
import { useAuthStore } from './stores/useAuthStore'
import { useOnboardingStore } from './stores/useOnboardingStore'

const authStore = useAuthStore()
const onboardingStore = useOnboardingStore()

onMounted(() => {
  // Restore auth session if exists
  authStore.restoreSession()
  
  // Load onboarding data if exists
  onboardingStore.loadOnboardingData()
})
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <RouterView />
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
</style>
