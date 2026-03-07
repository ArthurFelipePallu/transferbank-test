<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import FormInputField from '@/components/Form/FormInputField.vue'
import { partnerShareholdingSchema, type PartnerShareholdingFormValues } from '@/domain/partner/partner.schema'

const props = defineProps<{
  initialValues?: Partial<PartnerShareholdingFormValues>
  totalShareholding: number
}>()

const emit = defineEmits<{
  next: [values: PartnerShareholdingFormValues]
  back: []
}>()

const validationSchema = toTypedSchema(partnerShareholdingSchema)

const { handleSubmit, meta, values } = useForm<PartnerShareholdingFormValues>({
  validationSchema,
  initialValues: props.initialValues || {
    shareholding: 0,
  },
})

const submit = handleSubmit((values) => {
  emit('next', values)
})

const remainingShareholding = () => {
  const current = Number(values.shareholding) || 0
  return Math.max(0, 100 - props.totalShareholding - current)
}

const willExceed = () => {
  const current = Number(values.shareholding) || 0
  return props.totalShareholding + current > 100
}
</script>

<template>
  <form class="step-form" @submit.prevent="submit">
    <h2 class="form-title">Shareholding</h2>
    <p class="form-description">Define the partner's ownership percentage</p>

    <div class="shareholding-info">
      <div class="info-card">
        <span class="info-label">Current Total</span>
        <span class="info-value">{{ totalShareholding.toFixed(2) }}%</span>
      </div>
      <div class="info-card">
        <span class="info-label">Remaining</span>
        <span class="info-value" :class="{ 'info-value--warning': willExceed() }">
          {{ remainingShareholding().toFixed(2) }}%
        </span>
      </div>
    </div>

    <div class="form-fields">
      <FormInputField
        name="shareholding"
        label="Shareholding Percentage"
        type="number"
        placeholder="0.00"
        inputmode="decimal"
      />

      <div v-if="willExceed()" class="warning-message">
        <p>⚠️ Warning: Total shareholding will exceed 100%</p>
      </div>

      <div class="info-message">
        <p>💡 The sum of all partners' shareholding must equal exactly 100%</p>
      </div>
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

.shareholding-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border-radius: 0.75rem;
  color: var(--color-white);
}

.info-label {
  font-size: 0.8rem;
  opacity: 0.9;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.info-value--warning {
  color: var(--color-warning);
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.warning-message {
  padding: 1rem;
  background: rgba(244, 194, 29, 0.1);
  border: 1px solid var(--color-warning);
  border-radius: 0.75rem;
}

.warning-message p {
  font-size: 0.875rem;
  color: var(--color-text-main);
  margin: 0;
}

.info-message {
  padding: 1rem;
  background: rgba(28, 156, 140, 0.05);
  border: 1px solid var(--color-primary-teal);
  border-radius: 0.75rem;
}

.info-message p {
  font-size: 0.875rem;
  color: var(--color-text-main);
  margin: 0;
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

  .form-actions {
    justify-content: flex-end;
  }

  .btn {
    flex: 0;
    min-width: 150px;
  }
}
</style>
