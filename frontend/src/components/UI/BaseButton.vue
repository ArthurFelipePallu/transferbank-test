<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    fullWidth: false,
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--full-width': fullWidth }
    ]"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Variants */
.base-button--primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  box-shadow: var(--shadow-button-primary);
}

.base-button--primary:hover:not(:disabled) {
  box-shadow: var(--shadow-button-primary-active);
}

.base-button--primary:active:not(:disabled) {
  transform: translateY(1px);
}

.base-button--secondary {
  background: var(--color-chip-bg);
  color: var(--color-text-main);
  border: 1px solid var(--color-chip-border);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--color-surface);
}

.base-button--secondary:active:not(:disabled) {
  transform: translateY(1px);
}

.base-button--outline {
  background: transparent;
  color: var(--color-text-main);
  border: 1px solid var(--color-input-border);
}

.base-button--outline:hover:not(:disabled) {
  background: var(--color-chip-bg);
  border-color: var(--color-primary-teal);
  color: var(--color-primary-teal);
}

.base-button--outline:active:not(:disabled) {
  transform: translateY(1px);
}

/* Sizes */
.base-button--sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.base-button--md {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
}

.base-button--lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.base-button--full-width {
  width: 100%;
}

@media (min-width: 640px) {
  .base-button {
    min-width: 150px;
  }
}
</style>
