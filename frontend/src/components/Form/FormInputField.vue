<script setup lang="ts">
import { Field } from 'vee-validate'
import { ref, computed } from 'vue'
import { applyCnpjMask, applyCpfMask, applyPhoneMask, applyCepMask } from '@/utils/formatters'
import { useTranslation } from '@/composables/useTranslation'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'

const { tError } = useTranslation()


type InputMode =
  | 'text'
  | 'search'
  | 'email'
  | 'tel'
  | 'url'
  | 'none'
  | 'numeric'
  | 'decimal'

type MaskType = 'cnpj' | 'cpf' | 'phone' | 'cep' | 'none'

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    type?: HTMLInputElement['type']
    placeholder?: string
    autocomplete?: string
    inputmode?: InputMode
    mask?: MaskType
    validateOnInput?: boolean
  }>(),
  {
    type: 'text',
    mask: 'none',
    validateOnInput: false,
  },
)

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

const hasMask = computed(() => props.mask && props.mask !== 'none')

// Apply mask based on type
const applyMask = (value: string): string => {
  if (!value) return ''
  
  switch (props.mask) {
    case 'cnpj':
      return applyCnpjMask(value)
    case 'cpf':
      return applyCpfMask(value)
    case 'phone':
      return applyPhoneMask(value)
    case 'cep':
      return applyCepMask(value)
    default:
      return value
  }
}
</script>

<template>
  <Field v-slot="{ field, meta, errorMessage }" :name="name">
    <div class="mb-3">
      <label :for="name" class="form-label">
        {{ label }}
      </label>

      <div class="input-group" :class="{ 'is-invalid': meta.touched && errorMessage }">
        <span v-if="$slots.icon" class="input-group-text bg-white border-end-0">
          <slot name="icon" />
        </span>

        <input 
          :id="name"
          :type="inputType"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          :inputmode="inputmode"
          :value="field.value"
          class="form-control"
          :class="{ 
            'border-start-0': $slots.icon,
            'is-invalid': meta.touched && errorMessage 
          }"
          @input="(e) => {
            const input = e.target as HTMLInputElement
            const masked = hasMask ? applyMask(input.value) : input.value
            field.onChange(masked)
            if (validateOnInput) {
              field.onBlur(e)
            }
          }"
          @blur="(e) => field.onBlur(e)"
        />

        <button v-if="type === 'password' && $slots.passwordVisibility" 
                type="button" 
                class="btn btn-outline-secondary border-start-0"
                @click="togglePassword">
          <slot name="passwordVisibility" :visible="showPassword" />
        </button>
      </div>

      <div v-if="meta.touched && errorMessage" class="invalid-feedback d-block">
        {{ tError(errorMessage) }}
      </div>

      <slot name="below" :meta="meta" :value="field.value" />
    </div>
  </Field>
</template>

<style scoped>
.input-group-text {
  color: var(--color-input-placeholder);
}

.form-control:focus {
  border-color: var(--color-primary-teal);
  box-shadow: var(--shadow-input-focus);
}

.input-group-text + .form-control:focus {
  border-left-color: var(--color-primary-teal);
}
</style>
