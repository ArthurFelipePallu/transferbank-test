<script setup lang="ts">
import { Field } from 'vee-validate'
import { ref, computed } from 'vue'

type InputMode =
  | 'text'
  | 'search'
  | 'email'
  | 'tel'
  | 'url'
  | 'none'
  | 'numeric'
  | 'decimal'

const props = withDefaults(
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

        <input v-bind="field" :id="name" :type="inputType" :placeholder="placeholder" :autocomplete="autocomplete"
          :inputmode="inputmode" class="input" />

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

  padding: 0.7rem 0.9rem;

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
}

.icon-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-input-placeholder);
}

.input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 0.9rem;
  background: transparent;
  color: var(--color-text-main);
}

.input::placeholder {
  color: var(--color-input-placeholder);
}

.error {
  font-size: 0.75rem;
  color: var(--color-error);
  padding-left: 10px;
}
</style>