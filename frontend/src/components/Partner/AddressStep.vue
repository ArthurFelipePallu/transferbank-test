<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import FormInputField from '@/components/Form/FormInputField.vue'
import { partnerAddressSchema, type PartnerAddressFormValues } from '@/domain/partner/partner.schema'

const props = defineProps<{
  initialValues?: Partial<PartnerAddressFormValues>
}>()

const emit = defineEmits<{
  next: [values: PartnerAddressFormValues]
  back: []
}>()

const validationSchema = toTypedSchema(partnerAddressSchema)

const { handleSubmit, meta } = useForm<PartnerAddressFormValues>({
  validationSchema,
  initialValues: props.initialValues || {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brazil',
  },
})

const submit = handleSubmit((values) => {
  emit('next', values)
})
</script>

<template>
  <form class="step-form" @submit.prevent="submit">
    <h2 class="form-title">Address Information</h2>
    <p class="form-description">Enter the partner's complete address</p>

    <div class="form-fields">
      <FormInputField
        name="zipCode"
        label="ZIP Code"
        placeholder="00000-000"
        inputmode="numeric"
      />

      <FormInputField
        name="street"
        label="Street"
        placeholder="Avenida Paulista"
      />

      <div class="field-row">
        <FormInputField
          name="number"
          label="Number"
          placeholder="1000"
          inputmode="numeric"
        />

        <FormInputField
          name="complement"
          label="Complement (Optional)"
          placeholder="Apt 101"
        />
      </div>

      <FormInputField
        name="neighborhood"
        label="Neighborhood"
        placeholder="Bela Vista"
      />

      <div class="field-row">
        <FormInputField
          name="city"
          label="City"
          placeholder="São Paulo"
        />

        <FormInputField
          name="state"
          label="State"
          placeholder="SP"
        />
      </div>

      <FormInputField
        name="country"
        label="Country"
        placeholder="Brazil"
      />
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn--secondary" @click="$emit('back')">
        Back
      </button>
      <button type="submit" class="btn btn--primary" :disabled="!meta.valid">
        Next Step
      </button>
    </div>
  </form>
</template>

<style scoped>
.step-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
}

.form-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: -0.75rem 0 0;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  flex: 1;
}

.btn--secondary {
  background: var(--color-chip-bg);
  color: var(--color-text-main);
  border: 1px solid var(--color-chip-border);
}

.btn--secondary:hover {
  background: var(--color-surface);
}

.btn--secondary:active {
  transform: translateY(1px);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  box-shadow: var(--shadow-button-primary);
}

.btn--primary:hover:not(:disabled) {
  box-shadow: var(--shadow-button-primary-active);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(1px);
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

@media (min-width: 640px) {
  .form-title {
    font-size: 1.6rem;
  }

  .field-row {
    flex-direction: row;
  }

  .field-row > * {
    flex: 1;
  }

  .form-actions {
    justify-content: flex-end;
  }

  .btn {
    flex: 0;
    min-width: 150px;
  }
}
</style>
