<script setup lang="ts">
import AppLogo from './AppLogo.vue';

</script>


<template>
    <div class="brand">
        <AppLogo />
        <span class="brand-name">Mediteranian Bank</span>
    </div>
</template>


<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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