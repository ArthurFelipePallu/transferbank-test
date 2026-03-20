<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMobileMenu } from '@/composables/ui/useMobileMenu'
import { servicesLinks, supportLinks, dashboardLinks } from '@/config/navigation'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import BaseHeader from '@/components/Layout/BaseHeader.vue'
import AppBrandLogo from '@/components/App/AppBrandLogo.vue'
import MobileMenuButton from '@/components/App/MobileMenuButton.vue'
import AuthenticatedMobileMenu from '@/components/Navigation/AuthenticatedMobileMenu.vue'
import AuthenticatedDesktopNav from '@/components/Navigation/AuthenticatedDesktopNav.vue'

const router = useRouter()
const authStore = useAuthStore()
const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenu()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: RouteName.Login })
}

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<template>
  <BaseHeader>
    <!-- Logo -->
    <router-link :to="{ name: RouteName.Dashboard }" class="brand-link">
      <AppBrandLogo />
    </router-link>

    <!-- Desktop Navigation (hidden on mobile) -->
    <AuthenticatedDesktopNav 
      :company-name="authStore.companyName || 'Company'"
      :company-email="authStore.userEmail || ''"
      :dashboard="dashboardLinks"
      :services="servicesLinks"
      :support="supportLinks"
      @navigate="navigateTo"
      @logout="handleLogout"
    />

    <!-- Mobile Menu Button (hidden on desktop) -->
    <MobileMenuButton 
      :is-open="isMobileMenuOpen" 
      @toggle="toggleMobileMenu" 
    />

    <!-- Mobile Menu -->
    <AuthenticatedMobileMenu 
      :is-open="isMobileMenuOpen"
      :company-name="authStore.companyName || 'Company'"
      :company-email="authStore.userEmail || ''"
      :dashboard="dashboardLinks"
      :services="servicesLinks"
      :support="supportLinks"
      @navigate="navigateTo"
      @logout="handleLogout"
      @close="closeMobileMenu"
    />
  </BaseHeader>
</template>

<style scoped>
.brand-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.brand-link:hover {
  color: inherit;
}
</style>
