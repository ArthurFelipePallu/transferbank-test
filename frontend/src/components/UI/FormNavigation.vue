<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

withDefaults(
  defineProps<{
    showBack?: boolean
    backLabel?: string
    nextLabel?: string
    nextDisabled?: boolean
    /** Set to 'button' when FormNavigation is outside a <form> element */
    nextType?: 'submit' | 'button'
  }>(),
  {
    showBack: true,
    nextDisabled: false,
    nextType: 'submit',
  }
)

defineEmits<{
  back: []
  next: []
}>()
</script>

<template>
  <div class="d-flex gap-2 mt-4" :class="{ 'justify-content-end': showBack }">
    <button
      v-if="showBack"
      type="button"
      class="btn btn-outline-secondary px-4 py-2 fw-semibold rounded-3"
      @click="$emit('back')"
    >
      {{ backLabel ?? t('common.back') }}
    </button>
    <button
      :type="nextType"
      class="btn btn-primary px-4 py-2 fw-semibold rounded-3"
      :disabled="nextDisabled"
      @click="nextType === 'button' ? $emit('next') : undefined"
    >
      {{ nextLabel ?? t('common.next') }}
    </button>
  </div>
</template>

<style scoped>
/* Custom button styles - gradient and shadows */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  box-shadow: var(--shadow-button-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: var(--shadow-button-primary-active);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-outline-secondary {
  background: transparent;
  color: var(--color-text-main);
  border: 1px solid var(--color-input-border);
}

.btn-outline-secondary:hover {
  background: var(--color-chip-bg);
  border-color: var(--color-primary-teal);
  color: var(--color-primary-teal);
}

.btn-outline-secondary:active {
  transform: translateY(1px);
}

@media (min-width: 640px) {
  .btn {
    min-width: 150px;
  }
}
</style>
