<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import type { NavLink } from '@/config/navigation'
import BaseLucideIcon from '../BaseLucideIcon.vue'

defineProps<{
  isOpen: boolean
  mainLinks: NavLink[]
  authLinks: NavLink[]
}>()

const emit = defineEmits<{ close: [] }>()
const { t } = useTranslation()

const handleLinkClick = () => emit('close')
</script>

<template>
  <Transition name="overlay">
    <div v-if="isOpen" class="mobile-menu-overlay" @click="$emit('close')" />
  </Transition>

  <Transition name="slide">
    <nav v-if="isOpen" class="mobile-menu">
      <div class="mobile-menu-header">
        <span class="mobile-menu-title">{{ t('navigation.menu') }}</span>
        <button class="mobile-menu-close" @click="$emit('close')" :aria-label="t('common.close')">
          <BaseLucideIcon name="X" :size="24" />
        </button>
      </div>
      
      <div class="mobile-menu-content">
        <RouterLink 
          v-for="link in mainLinks" 
          :key="link.routeName"
          class="nav-link" 
          :to="{ name: link.routeName }"
          @click="handleLinkClick"
        >
          {{ t(link.label as any) }}
        </RouterLink>

        <div class="mobile-menu-divider" />

        <RouterLink 
          v-for="link in authLinks" 
          :key="link.routeName"
          class="nav-link"
          :class="{
            'nav-link--ghost': link.variant === 'ghost',
            'nav-link--primary': link.variant === 'primary'
          }"
          :to="{ name: link.routeName }"
          @click="handleLinkClick"
        >
          {{ t(link.label as any) }}
        </RouterLink>
      </div>
    </nav>
  </Transition>
</template>

<style scoped>
/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-black-alpha-50);
  z-index: 200;
  backdrop-filter: blur(2px);
}

/* Mobile Side Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  box-shadow: -4px 0 24px var(--color-black-alpha-30);
  z-index: 300;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-menu-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-white-alpha-15);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-white);
}

.mobile-menu-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.mobile-menu-close:hover {
  background-color: var(--color-white-alpha-12);
}

.mobile-menu-close:active {
  background-color: var(--color-white-alpha-20);
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
}

.mobile-menu-divider {
  height: 1px;
  background: var(--color-white-alpha-15);
  margin: 0.75rem 0;
}

.nav-link {
  border: none;
  background: transparent;
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.85rem 1rem;
  cursor: pointer;
  border-radius: 0.75rem;
  text-decoration: none;
  text-align: left;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.nav-link:hover {
  background-color: var(--color-white-alpha-12);
}

.nav-link:active {
  transform: scale(0.98);
}

.nav-link--ghost {
  background: var(--color-white-alpha-8);
}

.nav-link--primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  box-shadow: var(--shadow-button-primary);
  font-weight: 600;
}

.nav-link--primary:hover {
  box-shadow: var(--shadow-button-primary-active);
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
