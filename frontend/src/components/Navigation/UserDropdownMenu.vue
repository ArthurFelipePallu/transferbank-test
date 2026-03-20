<script setup lang="ts">
import { ref } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import LanguageSwitcher from '@/components/Language/LanguageSwitcher.vue'
import type { NavItem } from '@/domain/navigation/types/NavItem'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { useClickOutside } from '@/composables/ui/useClickOutside'

const props = defineProps<{
  isVisible: boolean
  dashboard: NavItem[]
  services: NavItem[]
  support: NavItem[]
  companyName: string
  companyEmail: string
}>()

const emit = defineEmits<{
  navigate: [route: string]
  logout: []
  close: []
}>()

const { t } = useTranslation()

const dropdownRef = ref<HTMLElement | null>(null)
useClickOutside(dropdownRef, () => { if (props.isVisible) emit('close') })

const handleNavigate = (routeName: string) => {
  emit('navigate', routeName)
}
</script>

<template>
  <Transition name="dropdown">
    <div
      v-if="isVisible"
      ref="dropdownRef"
      class="user-dropdown"
      role="menu"
    >
      <!-- Identity header — purple gradient band -->
      <div class="dropdown-header">
        <div class="identity-avatar avatar-circle avatar-circle--ghost avatar-circle--lg">
          {{ companyName.charAt(0).toUpperCase() }}
        </div>
        <div class="identity-info">
          <span class="identity-name">{{ companyName }}</span>
          <span class="identity-email">{{ companyEmail }}</span>
        </div>
      </div>

      <!-- Dashboard shortcut -->
      <div class="dropdown-body">
        <button
          v-for="item in dashboard"
          :key="item.routeName"
          class="dropdown-item dropdown-item--dashboard"
          role="menuitem"
          @click="handleNavigate(item.routeName)"
        >
          <BaseLucideIcon v-if="item.icon" :name="item.icon" :size="14" class="item-icon" />
          <span>{{ t(item.label) }}</span>
        </button>

        <hr class="dropdown-divider" />

        <!-- Language -->
        <div class="dropdown-lang">
          <LanguageSwitcher />
        </div>

        <hr class="dropdown-divider" />

        <!-- Services -->
        <p class="dropdown-section-label">{{ t('navigation.services') }}</p>
        <button
          v-for="item in services"
          :key="item.routeName"
          class="dropdown-item"
          role="menuitem"
          @click="handleNavigate(item.routeName)"
        >
          <BaseLucideIcon v-if="item.icon" :name="item.icon" :size="14" class="item-icon" />
          <span>{{ t(item.label) }}</span>
        </button>

        <hr class="dropdown-divider" />

        <!-- Support -->
        <p class="dropdown-section-label">{{ t('navigation.support') }}</p>
        <button
          v-for="item in support"
          :key="item.routeName"
          class="dropdown-item"
          role="menuitem"
          @click="handleNavigate(item.routeName)"
        >
          <BaseLucideIcon v-if="item.icon" :name="item.icon" :size="14" class="item-icon" />
          <span>{{ t(item.label) }}</span>
        </button>

        <hr class="dropdown-divider" />

        <!-- Logout -->
        <button class="dropdown-item dropdown-item--danger" role="menuitem" @click="$emit('logout')">
          <BaseLucideIcon name="LogOut" :size="14" class="item-icon" />
          <span>{{ t('auth.logout') }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 260px;
  background: linear-gradient(160deg, var(--color-primary-bg-start), var(--color-primary-bg-mid) 50%, var(--color-primary-bg-end));
  border: 1px solid var(--color-white-alpha-15);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-card-strong);
  z-index: var(--z-dropdown);
  overflow: hidden;
}

/* ── Identity header ── */
.dropdown-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-white-alpha-10);
}

.identity-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.identity-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-white);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.identity-email {
  font-size: var(--font-size-xs);
  color: var(--color-white-alpha-70);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Body ── */
.dropdown-body {
  padding: var(--spacing-xs);
}

.dropdown-divider {
  border: none;
  border-top: 1px solid var(--color-white-alpha-10);
  margin: var(--spacing-xs) 0;
}

.dropdown-lang {
  padding: var(--spacing-xs) var(--spacing-xs);
}

/* Make the language switcher fill the dropdown width */
.dropdown-lang :deep(.language-switcher) { width: 100%; }
.dropdown-lang :deep(.language-button) {
  width: 100%;
  justify-content: flex-start;
  border-color: var(--color-white-alpha-20);
  color: var(--color-white);
  background: transparent;
  min-height: 2.25rem;
  padding: var(--spacing-xs) var(--spacing-sm);
}
.dropdown-lang :deep(.language-button):hover {
  background: var(--color-white-alpha-12);
  border-color: var(--color-white-alpha-40);
}
.dropdown-lang :deep(.language-button) svg { color: var(--color-white-alpha-70); }
.dropdown-lang :deep(.lang-abbr) { color: var(--color-white); }

/* Language dropdown inside the user dropdown — open upward to avoid clipping */
.dropdown-lang :deep(.language-dropdown) {
  top: auto;
  bottom: calc(100% + 0.25rem);
}

.dropdown-section-label {
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-white-alpha-50);
  padding: var(--spacing-xs) var(--spacing-sm) 0.125rem;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  text-align: left;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-white-alpha-85);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  min-height: unset;
}

.dropdown-item:hover { background: var(--color-white-alpha-10); color: var(--color-white); }

/* Dashboard item — teal accent */
.dropdown-item--dashboard {
  font-weight: 600;
  color: var(--color-accent-teal-1);
}
.dropdown-item--dashboard:hover { background: var(--color-teal-alpha-20); color: var(--color-accent-teal-1); }

.item-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.dropdown-item--danger { color: var(--color-danger-light); }
.dropdown-item--danger:hover { background: var(--color-danger-alpha-15); }

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from,
.dropdown-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>
