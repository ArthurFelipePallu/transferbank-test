<script setup lang="ts">
import { ref } from 'vue'
import { User, LogOut } from 'lucide-vue-next'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownSubmenu from './DropdownSubmenu.vue'
import type { MenuItem } from '@/domain/navigation/types/MenuItem'
import { useTranslation } from '@/composables/useTranslation'

defineProps<{
  isVisible: boolean
  services: MenuItem[]
  support: MenuItem[]
}>()

const emit = defineEmits<{
  navigate: [route: string]
  logout: []
}>()

const { t } = useTranslation()

const activeSubmenu = ref<string | null>(null)

const showSubmenu = (menu: string) => {
  activeSubmenu.value = menu
}

const hideSubmenu = () => {
  activeSubmenu.value = null
}

const handleNavigation = (route: string) => {
  emit('navigate', route)
  hideSubmenu()
}
</script>

<template>
  <Transition name="dropdown">
    <div v-if="isVisible" class="user-dropdown-menu">
      <!-- Dashboard -->
      <div class="dropdown-section">
        <DropdownMenuItem 
          :item="{ label: t('navigation.dashboard'), route: 'dashboard' }"
          @click="handleNavigation('dashboard')"
        >
          <template #icon>
            <User :size="18" />
          </template>
        </DropdownMenuItem>
      </div>

      <div class="dropdown-divider"></div>

      <!-- Services with Submenu -->
      <div class="dropdown-section">
        <DropdownMenuItem 
          :item="{ label: t('navigation.services') }"
          :has-submenu="true"
          @mouseenter="showSubmenu('services')"
          @mouseleave="hideSubmenu"
        >
          <template #submenu>
            <DropdownSubmenu 
              :items="services"
              :is-visible="activeSubmenu === 'services'"
              @item-click="handleNavigation"
            />
          </template>
        </DropdownMenuItem>
      </div>

      <div class="dropdown-divider"></div>

      <!-- Support with Submenu -->
      <div class="dropdown-section">
        <DropdownMenuItem 
          :item="{ label: t('navigation.support') }"
          :has-submenu="true"
          @mouseenter="showSubmenu('support')"
          @mouseleave="hideSubmenu"
        >
          <template #submenu>
            <DropdownSubmenu 
              :items="support"
              :is-visible="activeSubmenu === 'support'"
              @item-click="handleNavigation"
            />
          </template>
        </DropdownMenuItem>
      </div>

      <div class="dropdown-divider"></div>

      <!-- Logout -->
      <div class="dropdown-section">
        <DropdownMenuItem 
          :item="{ label: t('auth.logout'), isDanger: true }"
          @click="$emit('logout')"
        >
          <template #icon>
            <LogOut :size="18" />
          </template>
        </DropdownMenuItem>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  overflow: visible;
  z-index: 1000;
}

.dropdown-section {
  padding: 0.5rem;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0.25rem 0;
}

/* Dropdown Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Tablet and up */
@media (min-width: 768px) {
  .user-dropdown-menu {
    min-width: 220px;
  }
}
</style>
