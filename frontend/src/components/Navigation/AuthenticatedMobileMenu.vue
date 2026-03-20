<script setup lang="ts">
import { ref, watch } from 'vue'
import SideMenu from '@/components/UI/SideMenu.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import LanguageSwitcher from '@/components/Language/LanguageSwitcher.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { NavItem } from '@/domain/navigation/types/NavItem'

/**
 * AuthenticatedMobileMenu
 * Presentation layer only — receives all nav data via props.
 * No direct config/store imports — parent (AuthenticatedHeader) owns data.
 */
const props = defineProps<{
  isOpen: boolean
  companyName: string
  companyEmail: string
  dashboard: NavItem[]
  services: NavItem[]
  support: NavItem[]
}>()

const emit = defineEmits<{
  navigate: [route: string]
  logout: []
  close: []
}>()

const { t } = useTranslation()

const isMenuOpen = ref(props.isOpen)
watch(() => props.isOpen, (val) => { isMenuOpen.value = val })
watch(isMenuOpen, (val) => { if (!val) emit('close') })

const handleNavigate = (routeName: string) => {
  emit('navigate', routeName)
  emit('close')
}

const handleLogout = () => {
  emit('logout')
  emit('close')
}
</script>

<template>
  <SideMenu v-model="isMenuOpen">
    <template #header>
      <div class="company-block">
        <div class="avatar-circle avatar-circle--ghost avatar-circle--lg company-avatar" aria-hidden="true">
          {{ companyName.charAt(0).toUpperCase() }}
        </div>
        <div class="company-info">
          <span class="company-name">{{ companyName }}</span>
          <span class="company-email">{{ companyEmail }}</span>
        </div>
      </div>
    </template>

    <!-- Language switcher -->
    <div class="lang-row">
      <LanguageSwitcher />
    </div>

    <!-- Dashboard -->
    <nav :aria-label="t('navigation.dashboard')">
      <button
        v-for="item in dashboard"
        :key="item.routeName"
        class="nav-item"
        @click="handleNavigate(item.routeName)"
      >
        <BaseLucideIcon v-if="item.icon" :name="item.icon" :size="16" class="nav-icon" />
        {{ t(item.label) }}
      </button>
    </nav>

    <!-- Services -->
    <p class="nav-group-label">{{ t('navigation.services') }}</p>
    <nav :aria-label="t('navigation.services')">
      <button
        v-for="item in services"
        :key="item.routeName"
        class="nav-item"
        @click="handleNavigate(item.routeName)"
      >
        <BaseLucideIcon v-if="item.icon" :name="item.icon" :size="16" class="nav-icon" />
        {{ t(item.label) }}
      </button>
    </nav>

    <!-- Support -->
    <p class="nav-group-label">{{ t('navigation.support') }}</p>
    <nav :aria-label="t('navigation.support')">
      <button
        v-for="item in support"
        :key="item.routeName"
        class="nav-item"
        @click="handleNavigate(item.routeName)"
      >
        <BaseLucideIcon v-if="item.icon" :name="item.icon" :size="16" class="nav-icon" />
        {{ t(item.label) }}
      </button>
    </nav>

    <template #footer>
      <button class="logout-btn" @click="handleLogout">
        <BaseLucideIcon name="LogOut" :size="16" />
        <span>{{ t('auth.logout') }}</span>
      </button>
    </template>
  </SideMenu>
</template>

<style scoped>
/* Company identity */
.company-block {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) 0;
}

.company-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.company-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-white);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.company-email {
  font-size: var(--font-size-xs);
  color: var(--color-white-alpha-70);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Language row */
.lang-row {
  padding: var(--spacing-xs) 0 var(--spacing-sm);
  border-bottom: 1px solid var(--color-white-alpha-15);
  margin-bottom: var(--spacing-xs);
}

.lang-row :deep(.language-switcher) { width: 100%; }
.lang-row :deep(.language-button)   { width: 100%; justify-content: center; }

/* Section labels */
.nav-group-label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-white-alpha-70);
  padding: var(--spacing-sm) var(--spacing-xs) var(--spacing-xs);
  margin: 0;
}

/* Nav items */
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: var(--touch-target-min);
}

.nav-item:hover  { background: var(--color-white-alpha-12); }
.nav-item:active { background: var(--color-white-alpha-20); }

.nav-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

/* Logout */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-danger-alpha-15);
  border: 1px solid var(--color-danger-alpha-30);
  border-radius: var(--border-radius-lg);
  color: var(--color-danger-light);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  min-height: var(--touch-target-min);
}

.logout-btn:hover {
  background: var(--color-danger-alpha-25);
  border-color: var(--color-danger-alpha-50);
}
</style>
