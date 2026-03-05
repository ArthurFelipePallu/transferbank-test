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
  padding: 0.6rem 0.8rem;

  border-radius: 1rem;
  border: 1px solid var(--color-surface-border);

  background: var(--color-white);
  color: var(--color-text-main);

  font-size: 0.95rem;
  font-weight: 600;

  cursor: pointer;

  box-shadow: var(--shadow-button-secondary);

  transition:
    transform 0.08s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
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
}

.label {
  display: flex;
  align-items: center;
}
</style>