<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-3 social-button">
    <span class="d-flex align-items-center flex-shrink-0">
      <slot name="icon" />
    </span>
    <span class="d-flex align-items-center fw-semibold">
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.social-button {
  box-shadow: var(--shadow-button-secondary);
  transition: transform 0.08s ease, box-shadow 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.social-button:hover {
  box-shadow: var(--shadow-button-secondary-hover);
}

.social-button:active {
  transform: translateY(1px);
}
</style>
