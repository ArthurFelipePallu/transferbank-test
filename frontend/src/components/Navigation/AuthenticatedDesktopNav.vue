<script setup lang="ts">
import LanguageSwitcher from '@/components/Language/LanguageSwitcher.vue'
import UserMenuButton from './UserMenuButton.vue'
import UserDropdownMenu from './UserDropdownMenu.vue'
import { ref } from 'vue'
import { useClickOutside } from '@/composables/ui/useClickOutside'
import type { NavItem } from '@/domain/navigation/types/NavItem'

defineProps<{
  companyName: string
  services: NavItem[]
  support: NavItem[]
}>()

const emit = defineEmits<{
  navigate: [route: string]
  logout: []
}>()

const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  
  // Enable click-outside detection after dropdown opens
  if (isDropdownOpen.value) {
    clickOutside.enable()
  } else {
    clickOutside.disable()
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
  clickOutside.disable()
}

// Use click-outside composable with 100ms delay
const clickOutside = useClickOutside('.user-menu-container', closeDropdown, {
  enabled: isDropdownOpen,
  delay: 100,
})

const handleToggle = () => {
  toggleDropdown()
}

const handleNavigation = (route: string) => {
  emit('navigate', route)
  closeDropdown()
}

const handleLogout = () => {
  emit('logout')
  closeDropdown()
}
</script>

<template>
  <nav class="d-none d-md-inline-flex align-items-center gap-3">
    <!-- Language Switcher -->
    <LanguageSwitcher />

    <!-- User Dropdown Menu -->
    <div class="user-menu-container" @click.stop>
      <UserMenuButton 
        :company-name="companyName"
        :is-open="isDropdownOpen"
        @toggle="handleToggle"
      />
      
      <UserDropdownMenu 
        :is-visible="isDropdownOpen"
        :services="services"
        :support="support"
        @navigate="handleNavigation"
        @logout="handleLogout"
      />
    </div>
  </nav>
</template>

<style scoped>
.user-menu-container {
  position: relative;
  z-index: 1001;
}
</style>
