<script setup lang="ts">
/**
 * Base Header Component
 * Following DDD/SOLID principles - Don't Repeat Yourself
 * Provides common header structure and styling for all header types
 */
</script>

<template>
  <header class="base-header">
    <div class="base-header-inner">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.base-header {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  color: var(--color-white);
  position: relative;
  z-index: 100;
  overflow: visible;
}

.base-header-inner {
  /* Mobile: full width */
  width: 100%;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  overflow: visible;
}

@media (min-width: 768px) {
  .base-header-inner {
    padding: 0.9rem 1.25rem;
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .base-header-inner {
    /* Desktop: constrain to 80% */
    max-width: 80%;
    padding: 0.9rem 1.5rem;
    gap: 1.5rem;
  }
}

/* Ensure content doesn't go to extremes on very large screens */
@media (min-width: 1920px) {
  .base-header-inner {
    max-width: 1536px; /* 80% of 1920px */
  }
}
</style>
