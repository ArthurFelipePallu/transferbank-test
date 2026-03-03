<script setup lang="ts">
import { Field } from 'vee-validate'

withDefaults(
  defineProps<{
    name: string
    label: string
    type?: string
    placeholder?: string
    autocomplete?: string
    inputmode?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    autocomplete: '',
    inputmode: '',
  },
)
</script>

<template>
  <Field v-slot="{ field, meta }" :name="name">
    <div class="field">
      <label :for="name">
        {{ label }}
      </label>

      <input
        v-bind="field"
        :id="name"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete || undefined"
        :inputmode="inputmode || undefined"
      />

      <p v-if="meta.touched && meta.error" class="error">
        {{ meta.error }}
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

