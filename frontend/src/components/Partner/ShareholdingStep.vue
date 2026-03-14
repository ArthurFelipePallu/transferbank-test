<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormInputField from '@/components/Form/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import StatCard from '@/components/UI/StatCard.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import { partnerShareholdingSchema, type PartnerShareholdingFormValues } from '@/domain/partner/partner.schema'

const props = defineProps<{
  initialValues?: Partial<PartnerShareholdingFormValues>
  totalShareholding: number
}>()

const emit = defineEmits<{
  next: [values: PartnerShareholdingFormValues]
  back: []
}>()

const { handleSubmit, meta, values } = useForm<PartnerShareholdingFormValues>({
  validationSchema: partnerShareholdingSchema,
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
  <form @submit.prevent="submit">
    <FormStepHeader
      title="Shareholding"
      description="Define the partner's ownership percentage"
    />

    <div class="row g-3 mb-4">
      <div class="col-6">
        <StatCard
          label="Current Total"
          :value="`${totalShareholding.toFixed(2)}%`"
        />
      </div>
      <div class="col-6">
        <StatCard
          label="Remaining"
          :value="`${remainingShareholding().toFixed(2)}%`"
          :highlight="willExceed()"
        />
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12">
        <FormInputField
          name="shareholding"
          label="Shareholding Percentage"
          type="number"
          placeholder="0.00"
          inputmode="decimal"
        />
      </div>

      <div v-if="willExceed()" class="col-12">
        <AlertCard variant="warning">
          Warning: Total shareholding will exceed 100%
        </AlertCard>
      </div>

      <div class="col-12">
        <AlertCard variant="info">
          The sum of all partners' shareholding must equal exactly 100%
        </AlertCard>
      </div>
    </div>

    <FormNavigation
      next-label="Next Step"
      :next-disabled="!meta.valid"
      @back="$emit('back')"
    />
  </form>
</template>

<style scoped>
/* Component-specific styles only */
</style>
