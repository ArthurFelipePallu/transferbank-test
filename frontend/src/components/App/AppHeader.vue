<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppBrandLogo from './AppBrandLogo.vue';
</script>

<template>
  <header class="app-header">
    <div class="app-header-inner">
      <AppBrandLogo />

      <nav class="nav">
        <RouterLink class="nav-link" :to="{ name: 'solutions' }">Solutions</RouterLink>
        <RouterLink class="nav-link" :to="{ name: 'pricing' }">Pricing</RouterLink>
        <RouterLink class="nav-link" :to="{ name: 'resources' }">Resources</RouterLink>

        <span class="nav-separator" aria-hidden="true">|</span>

        <RouterLink class="nav-link nav-link--ghost" :to="{ name: 'login' }">Login</RouterLink>
        <RouterLink class="nav-link nav-link--primary" :to="{ name: 'home' }">
          Open account
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  color: var(--color-white);
}

.app-header-inner {
  max-width: var(--app-max-container-width);
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}


.nav {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  border: none;
  background: transparent;
  color: var(--color-white);
  font-size: 0.87rem;
  font-weight: 500;
  padding: 0.3rem 0.55rem;
  cursor: pointer;
  border-radius: 999px;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.nav-link--ghost {
  padding-inline: 0.9rem;
}

.nav-link--primary {
  padding-inline: 1rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  box-shadow: var(--shadow-button-primary);
}

.nav-link--primary:hover {
  box-shadow: var(--shadow-button-primary-active);
}

.nav-separator {
  color: rgba(255, 255, 255, 0.4);
  padding-inline: 0.25rem;
}

@media (max-width: 768px) {
  .app-header-inner {
    padding-inline: 1rem;
    gap: 1rem;
  }

  .brand-name {
    font-size: 0.95rem;
  }

  .nav {
    gap: 0.5rem;
  }

  .nav-link {
    font-size: 0.8rem;
    padding-inline: 0.4rem;
  }

  .nav-link--primary {
    padding-inline: 0.75rem;
  }
}
</style>
