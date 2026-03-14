<script setup lang="ts">


</script>


<template>
    <div class="brand-logo">
        <img src="/bank-logo.png" alt="Mediteranian Bank logo" class="brand-logo-image" />
    </div>
</template>


<style scoped>
.brand-logo {
  /* Mobile: 36px */
  width: 36px;
  height: 36px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-button-primary);
  transition: all 0.2s ease;
}

.brand-logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Tablet: slightly larger */
@media (min-width: 768px) {
  .brand-logo {
    width: 40px;
    height: 40px;
  }
}

/* Desktop: larger */
@media (min-width: 1024px) {
  .brand-logo {
    width: 48px;
    height: 48px;
  }
}

/* Large Desktop: even larger */
@media (min-width: 1440px) {
  .brand-logo {
    width: 52px;
    height: 52px;
  }
}
</style>