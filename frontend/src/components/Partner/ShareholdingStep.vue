<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormInputField from '@/components/UI/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import StatCard from '@/components/UI/StatCard.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import { partnerShareholdingSchema, type PartnerShareholdingFormValues } from '@/domain/partner/partner.schema'
import { useTranslation } from '@/composables/i18n/useTranslation'

const props = defineProps<{
  initialValues?: Partial<PartnerShareholdingFormValues>
  totalShareholding: number
}>()

const emit = defineEmits<{
  next: [values: PartnerShareholdingFormValues]
  back: []
}>()

const { t } = useTranslation()

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
      :title="t('partner.registration.shareholding.stepTitle')"
      :description="t('partner.registration.shareholding.stepDescription')"
    />

    <div class="row g-3 mb-4">
      <div class="col-6">
        <StatCard
          :label="t('partner.registration.shareholding.currentTotal')"
          :value="`${totalShareholding.toFixed(2)}%`"
        />
      </div>
      <div class="col-6">
        <StatCard
          :label="t('partner.registration.shareholding.remaining')"
          :value="`${remainingShareholding().toFixed(2)}%`"
          :highlight="willExceed()"
        />
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12">
        <FormInputField
          name="shareholding"
          :label="t('partner.shareholding')"
          type="number"
          :placeholder="t('partner.registration.shareholding.percentagePlaceholder')"
          inputmode="decimal"
        />
      </div>

      <div v-if="willExceed()" class="col-12">
        <AlertCard variant="warning">
          {{ t('partner.registration.shareholding.warningExceeds') }}
        </AlertCard>
      </div>

      <div class="col-12">
        <AlertCard variant="info">
          {{ t('partner.registration.shareholding.infoMustEqual') }}
        </AlertCard>
      </div>
    </div>

    <FormNavigation
      :next-label="t('partner.registration.shareholding.nextStep')"
      :next-disabled="!meta.valid"
      @back="$emit('back')"
    />
  </form>
</template>

<style scoped>
/* Component-specific styles only */
</style>
