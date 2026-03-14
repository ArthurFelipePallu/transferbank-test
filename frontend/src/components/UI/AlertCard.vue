<script setup lang="ts">
type AlertVariant = 'info' | 'warning' | 'success' | 'danger'

withDefaults(
  defineProps<{
    variant?: AlertVariant
    icon?: string
  }>(),
  {
    variant: 'info',
  }
)

const variantIcons: Record<AlertVariant, string> = {
  info: '💡',
  warning: '⚠️',
  success: '✓',
  danger: '✕',
}
</script>

<template>
  <div class="alert" :class="`alert-${variant}`" role="alert">
    <div class="d-flex align-items-start gap-2">
      <span class="alert-icon">{{ icon || variantIcons[variant] }}</span>
      <div class="flex-grow-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.alert-icon {
  flex-shrink: 0;
  font-size: 1rem;
  line-height: 1;
}
</style>
