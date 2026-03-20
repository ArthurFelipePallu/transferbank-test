<script setup lang="ts">
import { ref } from 'vue'
import LanguageSwitcher from '@/components/Language/LanguageSwitcher.vue'
import UserMenuButton from './UserMenuButton.vue'
import UserDropdownMenu from './UserDropdownMenu.vue'
import type { NavItem } from '@/domain/navigation/types/NavItem'

defineProps<{
  companyName: string
  companyEmail: string
  dashboard: NavItem[]
  services: NavItem[]
  support: NavItem[]
}>()

const emit = defineEmits<{
  navigate: [route: string]
  logout: []
}>()

const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }
const close  = () => { isOpen.value = false }

const handleNavigate = (route: string) => {
  emit('navigate', route)
  close()
}

const handleLogout = () => {
  emit('logout')
  close()
}
</script>

<template>
  <nav class="d-none d-md-inline-flex align-items-center gap-3">
    <LanguageSwitcher />

    <!-- Relative wrapper anchors the dropdown -->
    <div class="user-menu-anchor">
      <UserMenuButton
        :company-name="companyName"
        :is-open="isOpen"
        @toggle="toggle"
      />

      <UserDropdownMenu
        :is-visible="isOpen"
        :company-name="companyName"
        :company-email="companyEmail"
        :dashboard="dashboard"
        :services="services"
        :support="support"
        @navigate="handleNavigate"
        @logout="handleLogout"
        @close="close"
      />
    </div>
  </nav>
</template>

<style scoped>
.user-menu-anchor {
  position: relative;
}
</style>
