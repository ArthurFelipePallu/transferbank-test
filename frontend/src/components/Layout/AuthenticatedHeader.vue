<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AppBrandLogo from '@/components/App/AppBrandLogo.vue'
import UserMenuButton from '@/components/Navigation/UserMenuButton.vue'
import UserDropdownMenu from '@/components/Navigation/UserDropdownMenu.vue'
import LanguageSwitcher from '@/components/Language/LanguageSwitcher.vue'
import type { MenuItem } from '@/domain/navigation/types/MenuItem'

const router = useRouter()
const authStore = useAuthStore()
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeDropdown()
  router.push({ name: 'login' })
}

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
  closeDropdown()
}

// Menu configuration following DDD principles
const services: MenuItem[] = [
  { label: 'Accounts', route: 'accounts' },
  { label: 'Transfers', route: 'transfers' },
  { label: 'Loans', route: 'loans' },
  { label: 'Investments', route: 'investments' },
]

const support: MenuItem[] = [
  { label: 'Help Center', route: 'help-center' },
  { label: 'Security', route: 'security' },
  { label: 'Contact Us', route: 'contact-us' },
]
</script>

<template>
  <header class="auth-header">
    <div class="header-container">
      <!-- Logo -->
      <router-link :to="{ name: 'dashboard' }" class="logo-link">
        <AppBrandLogo />
      </router-link>

      <!-- Right Side: Language Switcher + User Menu -->
      <div class="header-actions">
        <LanguageSwitcher />
        
        <div class="user-menu">
          <UserMenuButton 
            :company-name="authStore.companyName || 'Company'"
            :is-open="isDropdownOpen"
            @toggle="toggleDropdown"
            @blur="closeDropdown"
          />

          <UserDropdownMenu 
            :is-visible="isDropdownOpen"
            :services="services"
            :support="support"
            @navigate="navigateTo"
            @logout="handleLogout"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.auth-header {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  color: var(--color-white);
  position: relative;
  z-index: 100;
}

.header-container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  position: relative;
}

/* Tablet */
@media (min-width: 768px) {
  .header-container {
    padding: 0.9rem 1.25rem;
    gap: 1rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .header-container {
    padding: 0.9rem 1.5rem;
    gap: 1.5rem;
  }
}
</style>
