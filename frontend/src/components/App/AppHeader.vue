<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppBrandLogo from './AppBrandLogo.vue'
import DesktopNav from './DesktopNav.vue'
import MobileMenuButton from './MobileMenuButton.vue'
import MobileMenu from './MobileMenu.vue'
import { navigationConfig } from '@/config/navigation'
import { useUiStore } from '@/stores/useUiStore'
import BaseHeader from '@/components/Layout/BaseHeader.vue'

const router = useRouter()
const uiStore = useUiStore()

const { isMobileMenuOpen } = storeToRefs(uiStore)

// Close menu on route change
router.afterEach(() => {
  uiStore.closeMobileMenu()
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
  <BaseHeader>
    <AppBrandLogo />
    <DesktopNav
      :main-links="navigationConfig.mainLinks"
      :auth-links="navigationConfig.authLinks"
    />
    <MobileMenuButton
      :is-open="isMobileMenuOpen"
      @toggle="uiStore.toggleMobileMenu"
    />
    <MobileMenu
      :is-open="isMobileMenuOpen"
      :main-links="navigationConfig.mainLinks"
      :auth-links="navigationConfig.authLinks"
      @close="uiStore.closeMobileMenu"
    />
  </BaseHeader>
</template>

<style scoped>
/* BaseHeader owns all positioning and transition styles */
</style>
