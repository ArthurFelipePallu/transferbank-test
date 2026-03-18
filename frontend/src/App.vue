<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/App/AppHeader.vue'
import AuthenticatedHeader from './components/Layout/AuthenticatedHeader.vue'
import AppFooter from './components/App/AppFooter.vue'
import NotificationToast from './components/UI/NotificationToast.vue'
import LoadingOverlay from './components/UI/LoadingOverlay.vue'
import CookieConsentBanner from './components/UI/CookieConsentBanner.vue'
import { useAuthStore } from './stores/useAuthStore'

const authStore = useAuthStore()

const showAuthenticatedHeader = computed(() => authStore.isAuthenticated)

onMounted(() => {
  // Restore auth session if exists
  authStore.restoreSession()
  

})
</script>

<template>
  <div class="app-shell">
    <AuthenticatedHeader v-if="showAuthenticatedHeader" />
    <AppHeader v-else />
    
    <!-- RouterView with transition -->
    <main class="app-main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    
    <AppFooter />
    
    <!-- Global UI Components -->
    <NotificationToast />
    <LoadingOverlay />
    <CookieConsentBanner />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Offset fixed header — approximate header height at each breakpoint */
.app-main {
  padding-top: 56px; /* mobile */
}

@media (min-width: 768px) {
  .app-main { padding-top: 62px; }
}

@media (min-width: 1024px) {
  .app-main { padding-top: 66px; }
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
