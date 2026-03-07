<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppBrandLogo from './AppBrandLogo.vue'
import DesktopNav from './DesktopNav.vue'
import MobileMenuButton from './MobileMenuButton.vue'
import MobileMenu from './MobileMenu.vue'
import { navigationConfig } from '@/config/navigation'

const isMobileMenuOpen = ref(false)
const router = useRouter()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close menu on route change
router.afterEach(() => {
  closeMobileMenu()
})

// Prevent body scroll when menu is open
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <header class="app-header">
    <div class="app-header-inner">
      <AppBrandLogo />
      <DesktopNav 
        :main-links="navigationConfig.mainLinks" 
        :auth-links="navigationConfig.authLinks" 
      />
      <MobileMenuButton :is-open="isMobileMenuOpen" @toggle="toggleMobileMenu" />
    </div>

    <MobileMenu 
      :is-open="isMobileMenuOpen" 
      :main-links="navigationConfig.mainLinks"
      :auth-links="navigationConfig.authLinks"
      @close="closeMobileMenu" 
    />
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  color: var(--color-white);
  position: relative;
  z-index: 100;
}

.app-header-inner {
  max-width: var(--app-max-container-width);
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .app-header-inner {
    padding: 0.9rem 1.25rem;
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .app-header-inner {
    padding: 0.9rem 1.5rem;
    gap: 1.5rem;
  }
}
</style>
