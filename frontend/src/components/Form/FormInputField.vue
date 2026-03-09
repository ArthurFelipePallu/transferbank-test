<script setup lang="ts">
import { Field } from 'vee-validate'
import { ref, computed } from 'vue'
import { applyCnpjMask, applyCpfMask, applyPhoneMask, applyCepMask } from '@/utils/formatters'

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
    <div class="field">
      <label :for="name">
        {{ label }}
      </label>

      <div class="input-wrapper">
        <span v-if="$slots.icon" class="icon">
          <slot name="icon" />
        </span>

        <!-- Single input with conditional masking -->
        <input 
          :id="name"
          :type="inputType"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          :inputmode="inputmode"
          :value="field.value"
          class="input"
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

        <!-- PASSWORD TOGGLE -->
        <button v-if="type === 'password' && $slots.passwordVisibility" type="button" class="icon-button"
          @click="togglePassword">
          <slot name="passwordVisibility" :visible="showPassword" />
        </button>
      </div>

      <p v-if="meta.touched && errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <slot name="below" :meta="meta" :value="field.value" />
    </div>
  </Field>
</template>

<style scoped>
label,
.error,
.icon {
  user-select: none;
}


.field {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-main);
  padding-left: 5px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  border-radius: 0.5rem;
  border: 1px solid var(--color-input-border);
  background: var(--color-white);

  padding: 0.85rem 1rem;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.input-wrapper:focus-within {
  border-color: var(--color-primary-teal);
  box-shadow: var(--shadow-input-focus);
}

.icon {
  display: flex;
  align-items: center;
  color: var(--color-input-placeholder);
  flex-shrink: 0;
}

.icon-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-input-placeholder);
  padding: 0.25rem;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1rem;
  background: transparent;
  color: var(--color-text-main);
  min-width: 0;
}

.input::placeholder {
  color: var(--color-input-placeholder);
}

.error {
  font-size: 0.75rem;
  color: var(--color-error);
  padding-left: 10px;
}

@media (min-width: 640px) {
  .input-wrapper {
    padding: 0.7rem 0.9rem;
  }

  .input {
    font-size: 0.9rem;
  }
}
</style>
