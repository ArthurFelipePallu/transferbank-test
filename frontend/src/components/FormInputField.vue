<script setup lang="ts">
import { Field } from 'vee-validate'

type InputMode =
  | 'text'
  | 'search'
  | 'email'
  | 'tel'
  | 'url'
  | 'none'
  | 'numeric'
  | 'decimal'

withDefaults(
  defineProps<{
    name: string
    label: string
    type?: HTMLInputElement['type']
    placeholder?: string
    autocomplete?: string
    inputmode?: InputMode
  }>(),
  {
    type: 'text',
  },
)
</script>

<template>
  <Field v-slot="{ field, meta, errorMessage }" :name="name">
    <div class="field">
      <label :for="name">
        {{ label }}
      </label>

      <input v-bind="field" :id="name" :type="type" :placeholder="placeholder" :autocomplete="autocomplete"
        :inputmode="inputmode" />

      <p v-if="meta.touched && errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <slot name="below" :meta="meta" :value="field.value" />
    </div>
  </Field>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-main);
}

input {
  border-radius: 0.75rem;
  border: 1px solid var(--color-input-border);
  background: var(--color-white);
  color: var(--color-text-main);
  padding: 0.7rem 0.9rem;
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

input::placeholder {
  color: var(--color-input-placeholder);
}

input:focus {
  border-color: var(--color-primary-teal);
  box-shadow: var(--shadow-input-focus);
  background: var(--color-white);
}

.error {
  font-size: 0.75rem;
  color: var(--color-error);
}
</style>
