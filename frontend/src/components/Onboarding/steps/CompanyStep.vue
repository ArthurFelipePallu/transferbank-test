<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import FormInputField from '@/components/UI/FormInputField.vue'
import PhoneInputField from '@/components/UI/PhoneInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import { onboardingCompanySchema, type OnboardingCompanyValues } from '@/domain/onboarding/onboarding.schema'
import { useTranslation } from '@/composables/i18n/useTranslation'

interface Props {
  initialValues?: Partial<OnboardingCompanyValues>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  next: [values: OnboardingCompanyValues]
  back: []
  update: [values: Partial<OnboardingCompanyValues>]
}>()

const { t } = useTranslation()
const phoneInputRef = ref<InstanceType<typeof PhoneInputField> | null>(null)

const { handleSubmit, meta, values } = useForm<OnboardingCompanyValues>({
  validationSchema: onboardingCompanySchema,
  initialValues: {
    companyName: props.initialValues?.companyName ?? '',
    fantasyName: props.initialValues?.fantasyName ?? '',
    phone: props.initialValues?.phone ?? '',
    email: props.initialValues?.email ?? '',
  },
  validateOnMount: false,
})

const submit = handleSubmit((vals) => {
  // fullPhoneNumber is a ComputedRef<string> exposed by PhoneInputField
  const fullPhone = (phoneInputRef.value?.fullPhoneNumber as { value: string } | undefined)?.value || vals.phone
  emit('next', { ...vals, phone: fullPhone })
})

// Persist field values to store as user types
watch(values, (v) => emit('update', { ...v }), { deep: true })
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <FormStepHeader
      :title="t('onboarding.steps.company.title')"
      :description="t('onboarding.steps.company.description')"
    />

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <FormInputField
          name="companyName"
          :label="t('onboarding.companyName')"
          :placeholder="t('onboarding.placeholders.companyName')"
        />
      </div>
      <div class="col-12 col-md-6">
        <FormInputField
          name="fantasyName"
          :label="t('onboarding.fantasyName')"
          :placeholder="t('onboarding.placeholders.fantasyName')"
        />
      </div>
    </div>

    <div class="row g-3 mb-3">
      <div class="col-12 col-md-6">
        <PhoneInputField
          ref="phoneInputRef"
          name="phone"
          :label="t('onboarding.phone')"
          placeholder="(11) 99999-9999"
        />
      </div>
      <div class="col-12 col-md-6">
        <FormInputField
          name="email"
          :label="t('onboarding.email')"
          type="email"
          :placeholder="t('onboarding.placeholders.email')"
          autocomplete="email"
          inputmode="email"
        />
      </div>
    </div>

    <FormNavigation
      :show-back="true"
      :next-disabled="!meta.valid"
      @back="$emit('back')"
      @next="submit"
    />
  </form>
</template>
