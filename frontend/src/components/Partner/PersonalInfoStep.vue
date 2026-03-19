<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormInputField from '@/components/UI/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import PepCheckbox from '@/components/UI/PepCheckbox.vue'
import { partnerPersonalInfoSchema, type PartnerPersonalInfoFormValues } from '@/domain/partner/partner.schema'
import { useTranslation } from '@/composables/i18n/useTranslation'
import { PARTNER_REGISTRATION_DEFAULTS } from '@/domain/partner/entities/PartnerDefaults'

const props = defineProps<{
  initialValues?: Partial<PartnerPersonalInfoFormValues>
}>()

const emit = defineEmits<{
  next: [values: PartnerPersonalInfoFormValues]
}>()

const { t } = useTranslation()

const { handleSubmit, meta, values, setFieldValue } = useForm<PartnerPersonalInfoFormValues>({
  validationSchema: partnerPersonalInfoSchema,
  initialValues: props.initialValues || {
    fullName: PARTNER_REGISTRATION_DEFAULTS.fullName,
    cpf: PARTNER_REGISTRATION_DEFAULTS.cpf,
    nationality: PARTNER_REGISTRATION_DEFAULTS.nationality,
    isPep: PARTNER_REGISTRATION_DEFAULTS.isPep,
  },
})

const submit = handleSubmit((values) => {
  emit('next', values)
})
</script>

<template>
  <form @submit.prevent="submit">
    <FormStepHeader
      :title="t('partner.registration.personalInfo.stepTitle')"
      :description="t('partner.registration.personalInfo.stepDescription')"
    />

    <div class="row g-3">
      <div class="col-12">
        <FormInputField
          name="fullName"
          :label="t('partner.fullName')"
          :placeholder="t('partner.registration.personalInfo.fullNamePlaceholder')"
          autocomplete="name"
        />
      </div>

      <div class="col-12">
        <FormInputField
          name="cpf"
          :label="t('partner.cpf')"
          :placeholder="t('partner.registration.personalInfo.cpfPlaceholder')"
          inputmode="numeric"
          mask="cpf"
        />
      </div>

      <div class="col-12">
        <FormInputField
          name="nationality"
          :label="t('partner.nationality')"
          :placeholder="t('partner.registration.personalInfo.nationalityPlaceholder')"
        />
      </div>

      <div class="col-12">
        <PepCheckbox
          :model-value="values.isPep"
          input-id="partner-isPep"
          label-key="partner.registration.personalInfo.pepLabel"
          description-key="partner.registration.personalInfo.pepDescription"
          @update:model-value="setFieldValue('isPep', $event)"
        />
      </div>
    </div>

    <FormNavigation
      :show-back="false"
      :next-label="t('partner.registration.personalInfo.nextStep')"
      :next-disabled="!meta.valid"
    />
  </form>
</template>

<style scoped>
/* Component-specific styles only */
</style>
