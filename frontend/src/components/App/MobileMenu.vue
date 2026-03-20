<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import SideMenu from '@/components/UI/SideMenu.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { NavItem } from '@/domain/navigation/types/NavItem'

const props = defineProps<{
  isOpen: boolean
  mainLinks: NavItem[]
  authLinks: NavItem[]
}>()

const emit = defineEmits<{ close: [] }>()
const { t } = useTranslation()

const isMenuOpen = ref(props.isOpen)
watch(() => props.isOpen, (val) => { isMenuOpen.value = val })
watch(isMenuOpen, (val) => { if (!val) emit('close') })
</script>

<template>
  <SideMenu v-model="isMenuOpen" :title="t('navigation.menu')">
    <nav :aria-label="t('navigation.menu')">
      <RouterLink
        v-for="link in mainLinks"
        :key="link.routeName"
        class="nav-item"
        :to="{ name: link.routeName }"
        @click="emit('close')"
      >
        <BaseLucideIcon v-if="link.icon" :name="link.icon" :size="16" class="nav-icon" />
        {{ t(link.label) }}
      </RouterLink>
    </nav>

    <hr class="nav-divider" />

    <nav :aria-label="t('navigation.menu')">
      <RouterLink
        v-for="link in authLinks"
        :key="link.routeName"
        class="nav-item"
        :class="{
          'nav-item--ghost':   link.variant === 'ghost',
          'nav-item--primary': link.variant === 'primary',
        }"
        :to="{ name: link.routeName }"
        @click="emit('close')"
      >
        <BaseLucideIcon v-if="link.icon" :name="link.icon" :size="16" class="nav-icon" />
        {{ t(link.label) }}
      </RouterLink>
    </nav>
  </SideMenu>
</template>

<style scoped>
.nav-divider {
  border: none;
  border-top: 1px solid var(--color-white-alpha-15);
  margin: var(--spacing-sm) 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
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

.nav-item--ghost   { background: var(--color-white-alpha-8); }

.nav-item--primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  box-shadow: var(--shadow-button-primary);
  font-weight: 600;
}

.nav-item--primary:hover {
  box-shadow: var(--shadow-button-primary-active);
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
}
</style>
