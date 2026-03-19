<script setup lang="ts">
/**
 * PepCheckbox - reusable PEP (Politically Exposed Person) checkbox card.
 * Used in both onboarding partner form and standalone partner registration.
 * Accepts any unique id to avoid duplicate `for` attribute collisions.
 */
import { useTranslation } from '@/composables/i18n/useTranslation'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

const props = withDefaults(defineProps<{
  modelValue: boolean
  inputId?: string
  labelKey?: TranslationKey
  descriptionKey?: TranslationKey
}>(), {
  inputId: 'isPep',
  labelKey: 'onboarding.partnersStep.isPep',
  descriptionKey: 'onboarding.partnersStep.pepDescription',
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useTranslation()
</script>

<template>
  <div class="card border-primary-subtle bg-light mb-1">
    <div class="card-body py-2 px-3">
      <div class="form-check mb-0">
        <input
          type="checkbox"
          class="form-check-input"
          :id="props.inputId"
          :checked="props.modelValue"
          @change="emit('update:modelValue', !props.modelValue)"
        />
        <label class="form-check-label small fw-medium" :for="props.inputId">
          <slot name="label">{{ t(props.labelKey) }}</slot>
        </label>
      </div>
      <p class="text-muted mb-0 mt-1 pep-description">
        <slot name="description">{{ t(props.descriptionKey) }}</slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
.pep-description { font-size: 0.72rem; }
</style>
