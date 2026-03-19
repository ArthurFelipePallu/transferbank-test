<script setup lang="ts">
import { X, User, LogOut } from 'lucide-vue-next'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import LanguageSwitcher from '@/components/Language/LanguageSwitcher.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { NavItem } from '@/domain/navigation/types/NavItem'
import { ref } from 'vue'

defineProps<{
  isOpen: boolean
  companyName: string
  companyEmail: string
  services: NavItem[]
  support: NavItem[]
}>()

const emit = defineEmits<{
  navigate: [route: string]
  logout: []
  close: []
}>()

const { t } = useTranslation()
const expandedSection = ref<string | null>(null)

const toggleSection = (section: string) => {
  expandedSection.value = expandedSection.value === section ? null : section
}

const handleNavigation = (route: string) => {
  emit('navigate', route)
  emit('close')
}

const handleLogout = () => {
  emit('logout')
  emit('close')
}
</script>

<template>
  <!-- Mobile Menu Overlay -->
  <Transition name="overlay">
    <div 
      v-if="isOpen" 
      class="mobile-menu-overlay"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Mobile Side Menu -->
  <Transition name="slide">
    <nav v-if="isOpen" class="mobile-menu">
      <div class="mobile-menu-header">
        <span class="mobile-menu-title">{{ t('navigation.menu') }}</span>
        <button 
          class="mobile-menu-close" 
          @click="$emit('close')"
          aria-label="Close menu"
        >
          <BaseLucideIcon name="X" :size="24" />
        </button>
      </div>
      
      <div class="mobile-menu-content">
        <!-- Company Info -->
        <div class="company-info">
          <div class="company-icon">
            <User :size="20" />
          </div>
          <div class="company-details">
            <div class="company-name">{{ companyName }}</div>
            <div class="company-email">{{ companyEmail }}</div>
          </div>
        </div>

        <div class="mobile-menu-divider" />

        <!-- Language Switcher -->
        <div class="language-section">
          <LanguageSwitcher />
        </div>

        <div class="mobile-menu-divider" />

        <!-- Services Section -->
        <div class="menu-section">
          <button 
            class="section-header"
            @click="toggleSection('services')"
          >
            <span>{{ t('navigation.services') }}</span>
            <BaseLucideIcon 
              name="ChevronDown" 
              :size="18" 
              :class="{ 'chevron-open': expandedSection === 'services' }"
            />
          </button>
          
          <Transition name="expand">
            <div v-if="expandedSection === 'services'" class="section-items">
              <button
                v-for="item in services"
                :key="item.routeName"
                class="menu-item"
                @click="handleNavigation(item.routeName)"
              >
                {{ t(item.label as any) }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Support Section -->
        <div class="menu-section">
          <button 
            class="section-header"
            @click="toggleSection('support')"
          >
            <span>{{ t('navigation.support') }}</span>
            <BaseLucideIcon 
              name="ChevronDown" 
              :size="18" 
              :class="{ 'chevron-open': expandedSection === 'support' }"
            />
          </button>
          
          <Transition name="expand">
            <div v-if="expandedSection === 'support'" class="section-items">
              <button
                v-for="item in support"
                :key="item.routeName"
                class="menu-item"
                @click="handleNavigation(item.routeName)"
              >
                {{ t(item.label as any) }}
              </button>
            </div>
          </Transition>
        </div>

        <div class="mobile-menu-divider" />

        <!-- Logout -->
        <button class="logout-button" @click="handleLogout">
          <LogOut :size="18" />
          <span>{{ t('navigation.logout') }}</span>
        </button>
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

/* Company Info */
.company-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-white-alpha-10);
  border-radius: 0.75rem;
}

.company-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-white-alpha-15);
  border-radius: 50%;
  color: var(--color-white);
  flex-shrink: 0;
}

.company-details {
  flex: 1;
  min-width: 0;
}

.company-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-white);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company-email {
  font-size: 0.8125rem;
  color: var(--color-white-alpha-70);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Language Section */
.language-section {
  padding: 0.5rem;
}

/* Menu Sections */
.menu-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--color-white-alpha-8);
  border: none;
  border-radius: 0.75rem;
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.section-header:hover {
  background-color: var(--color-white-alpha-12);
}

.section-header:active {
  background-color: var(--color-white-alpha-15);
}

.chevron-open {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.section-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0 0 0;
}

.menu-item {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: var(--color-white-alpha-90);
  font-size: 0.9375rem;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.menu-item:hover {
  background-color: var(--color-white-alpha-8);
}

.menu-item:active {
  background-color: var(--color-white-alpha-12);
}

/* Logout Button */
.logout-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: var(--color-danger-alpha-15);
  border: 1px solid var(--color-danger-alpha-30);
  border-radius: 0.75rem;
  color: var(--color-danger-light);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.logout-button:hover {
  background: var(--color-danger-alpha-25);
  border-color: var(--color-danger-alpha-50);
}

.logout-button:active {
  background: var(--color-danger-alpha-30);
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
