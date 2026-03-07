<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button class="social-button">
    <span class="icon">
      <slot name="icon" />
    </span>

    <span class="label">
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  width: 100%;
  padding: 0.85rem 1rem;

  border-radius: 0.75rem;
  border: 1px solid var(--color-surface-border);

  background: var(--color-white);
  color: var(--color-text-main);

  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;

  box-shadow: var(--shadow-button-secondary);

  transition:
    transform 0.08s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.social-button:hover {
  background: var(--color-bg-section);
  box-shadow: var(--shadow-button-secondary-hover);
}

.social-button:active {
  transform: translateY(1px);
}

.icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.label {
  display: flex;
  align-items: center;
}

@media (min-width: 640px) {
  .social-button {
    padding: 0.7rem 0.9rem;
    border-radius: 1rem;
    font-size: 0.95rem;
  }
}
</style>