<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { NavLink } from '@/config/navigation'

defineProps<{
  mainLinks: NavLink[]
  authLinks: NavLink[]
}>()
</script>

<template>
  <nav class="desktop-nav">
    <RouterLink 
      v-for="link in mainLinks" 
      :key="link.routeName"
      class="nav-link" 
      :to="{ name: link.routeName }"
    >
      {{ link.label }}
    </RouterLink>

    <span class="nav-separator" aria-hidden="true">|</span>

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
      {{ link.label }}
    </RouterLink>
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
    padding: 0.35rem 0.55rem;
    cursor: pointer;
    border-radius: 999px;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }

  .nav-link--ghost {
    padding-inline: 0.8rem;
  }

  .nav-link--primary {
    padding-inline: 0.9rem;
    background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
    box-shadow: var(--shadow-button-primary);
  }

  .nav-link--primary:hover {
    box-shadow: var(--shadow-button-primary-active);
  }

  .nav-separator {
    color: rgba(255, 255, 255, 0.4);
    padding-inline: 0.2rem;
  }
}

@media (min-width: 1024px) {
  .desktop-nav {
    gap: 0.75rem;
  }

  .nav-link {
    font-size: 0.87rem;
    padding: 0.3rem 0.55rem;
  }

  .nav-link--ghost {
    padding-inline: 0.9rem;
  }

  .nav-link--primary {
    padding-inline: 1rem;
  }

  .nav-separator {
    padding-inline: 0.25rem;
  }
}
</style>
