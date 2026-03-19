<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { RouteName } from '@/domain/navigation/types/RouteNames'
import { useTranslation } from '@/composables/i18n/useTranslation'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useTranslation()
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = (event: Event) => {
  event.stopPropagation()
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleLogout = async () => {
  closeMenu()
  await authStore.logout()
  router.push({ name: RouteName.Login })
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="menuRef" class="user-menu">
    <button 
      type="button"
      class="user-menu-button" 
      @click="toggleMenu"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <div class="user-avatar">
        <BaseLucideIcon name="User" :size="18" />
      </div>
      <span class="user-name">{{ authStore.companyName || 'Account' }}</span>
      <BaseLucideIcon 
        name="ChevronDown" 
        :size="16" 
        :class="{ 'rotate-180': isOpen }"
        class="chevron"
      />
    </button>

    <Transition name="dropdown">
      <div v-show="isOpen" class="user-menu-dropdown">
        <div class="dropdown-header">
          <div class="dropdown-user-info">
            <p class="dropdown-company-name">{{ authStore.companyName }}</p>
            <p class="dropdown-email">{{ authStore.userEmail }}</p>
          </div>
        </div>
        
        <div class="dropdown-divider"></div>
        
        <button type="button" class="dropdown-item" @click="handleLogout">
          <BaseLucideIcon name="LogOut" :size="16" />
          <span>{{ t('navigation.logout') }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
  display: none;
}

@media (min-width: 768px) {
  .user-menu {
    display: block;
  }
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-white-alpha-10);
  border: 1px solid var(--color-white-alpha-20);
  border-radius: 0.5rem;
  color: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.user-menu-button:hover {
  background: var(--color-white-alpha-15);
  border-color: var(--color-white-alpha-30);
}

.user-avatar {
  width: 28px;
  height: 28px;
  background: var(--color-white-alpha-20);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.user-menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 240px;
  background: var(--color-white);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px var(--color-black-alpha-15);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-teal-alpha-5), var(--color-accent-teal-alpha-5));
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dropdown-company-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-surface-border);
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--color-text-main);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--color-teal-alpha-8);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
