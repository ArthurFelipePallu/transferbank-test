<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormInputField from '@/components/Form/FormInputField.vue'
import { partnerPersonalInfoSchema, type PartnerPersonalInfoFormValues } from '@/domain/partner/partner.schema'

const props = defineProps<{
  initialValues?: Partial<PartnerPersonalInfoFormValues>
}>()

const emit = defineEmits<{
  next: [values: PartnerPersonalInfoFormValues]
}>()

const { handleSubmit, meta, values, setFieldValue } = useForm<PartnerPersonalInfoFormValues>({
  validationSchema: partnerPersonalInfoSchema,
  initialValues: props.initialValues || {
    fullName: '',
    cpf: '',
    nationality: 'Brazilian',
    isPep: false,
  },
})

const submit = handleSubmit((values) => {
  emit('next', values)
})
</script>

<template>
  <form class="step-form" @submit.prevent="submit">
    <h2 class="form-title">Personal Information</h2>
    <p class="form-description">Enter the partner's basic information</p>

    <div class="form-fields">
      <FormInputField
        name="fullName"
        label="Full Name"
        placeholder="John Doe Silva"
        autocomplete="name"
      />

      <FormInputField
        name="cpf"
        label="CPF"
        placeholder="000.000.000-00"
        inputmode="numeric"
        mask="cpf"
      />

      <FormInputField
        name="nationality"
        label="Nationality"
        placeholder="Brazilian"
      />

      <div class="checkbox-field">
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="checkbox-input"
            :checked="values.isPep"
            @change="setFieldValue('isPep', !values.isPep)"
          />
          <span class="checkbox-text">
            This person is a PEP (Politically Exposed Person)
          </span>
        </label>
        <p class="checkbox-hint">
          PEPs are individuals who hold or have held prominent public positions
        </p>
      </div>
    </div>

    <div class="form-actions">
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

.checkbox-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-chip-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--color-chip-border);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: var(--color-primary-teal);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-main);
  line-height: 1.5;
}

.checkbox-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-left: 2rem;
  line-height: 1.4;
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

  .form-actions {
    flex: 0;
  }

  .btn {
    flex: 0;
    min-width: 200px;
  }
}
</style>
