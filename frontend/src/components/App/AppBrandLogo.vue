<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLogo from './AppLogo.vue'
import { RouteName } from '@/domain/navigation/types/RouteNames'
</script>

<template>
  <RouterLink :to="{ name: RouteName.Home }" class="brand" aria-label="Go to home">
    <AppLogo />
    <span class="brand-name">Mediteranian Bank</span>
  </RouterLink>
</template>


<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
  min-height: unset; /* override base.css link min-height */
}

.brand:hover {
  color: inherit;
  opacity: 0.85;
}

.brand-name {
  /* Mobile: 0.85rem (13.6px) */
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition: font-size 0.2s ease;
}

/* Small tablet */
@media (min-width: 640px) {
  .brand {
    gap: 0.6rem;
  }

  .brand-name {
    font-size: 0.95rem;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .brand {
    gap: 0.7rem;
  }

  .brand-name {
    font-size: 1.05rem;
  }
}

/* Desktop: larger */
@media (min-width: 1024px) {
  .brand {
    gap: 0.75rem;
  }

  .brand-name {
    font-size: 1.15rem;
  }
}

/* Large Desktop: even larger */
@media (min-width: 1440px) {
  .brand {
    gap: 0.85rem;
  }

  .brand-name {
    font-size: 1.25rem;
  }
}
</style>