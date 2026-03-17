<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTranslation } from '@/composables/useTranslation'
import type { NavItem } from '@/domain/navigation/types/NavItem'
import UserMenu from './UserMenu.vue'

defineProps<{
  mainLinks: NavItem[]
  authLinks: NavItem[]
}>()

const authStore = useAuthStore()
const { t } = useTranslation()
</script>

<template>
  <nav class="desktop-nav">
    <RouterLink 
      v-for="link in mainLinks" 
      :key="link.routeName"
      class="nav-link" 
      :to="{ name: link.routeName }"
    >
      {{ t(link.label as any) }}
    </RouterLink>

    <span class="nav-separator" aria-hidden="true">|</span>

    <UserMenu v-if="authStore.isAuthenticated" />
    
    <template v-else>
      <RouterLink 
        v-for="link in authLinks" 
        :key="link.routeName"
        class="nav-link"
        :class="{
          'nav-link--ghost': link.variant === 'ghost',
          'nav-link--primary': link.variant === 'primary'
        }"
        :to="{ name: link.routeName }"
      >
        {{ t(link.label as any) }}
      </RouterLink>
    </template>
  </nav>
</template>

<style scoped>
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    border: none;
    background: transparent;
    color: var(--color-white);
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-radius: 0.375rem;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .nav-link:hover {
    background-color: var(--color-white-alpha-12);
  }

  .nav-link--ghost {
    padding: 0.5rem 1rem;
  }

  .nav-link--primary {
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
    box-shadow: var(--shadow-button-primary);
  }

  .nav-link--primary:hover {
    box-shadow: var(--shadow-button-primary-active);
  }

  .nav-separator {
    color: var(--color-white-alpha-40);
    padding-inline: 0.2rem;
  }
}

@media (min-width: 1024px) {
  .desktop-nav {
    gap: 0.75rem;
  }

  .nav-link {
    font-size: 0.87rem;
    padding: 0.5rem 0.85rem;
  }

  .nav-link--ghost {
    padding: 0.5rem 1.1rem;
  }

  .nav-link--primary {
    padding: 0.5rem 1.4rem;
  }

  .nav-separator {
    padding-inline: 0.25rem;
  }
}
</style>
