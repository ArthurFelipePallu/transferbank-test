<script setup lang="ts">
import { useForm } from 'vee-validate'
import FormInputField from '@/components/Form/FormInputField.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
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
  <form @submit.prevent="submit">
    <FormStepHeader
      title="Personal Information"
      description="Enter the partner's basic information"
    />

    <div class="row g-3">
      <div class="col-12">
        <FormInputField
          name="fullName"
          label="Full Name"
          placeholder="John Doe Silva"
          autocomplete="name"
        />
      </div>

      <div class="col-12">
        <FormInputField
          name="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          inputmode="numeric"
          mask="cpf"
        />
      </div>

      <div class="col-12">
        <FormInputField
          name="nationality"
          label="Nationality"
          placeholder="Brazilian"
        />
      </div>

      <div class="col-12">
        <div class="card border-primary-subtle bg-light">
          <div class="card-body">
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="isPep"
                :checked="values.isPep"
                @change="setFieldValue('isPep', !values.isPep)"
              />
              <label class="form-check-label fw-medium" for="isPep">
                This person is a PEP (Politically Exposed Person)
              </label>
            </div>
            <p class="text-muted small mb-0 mt-2">
              PEPs are individuals who hold or have held prominent public positions
            </p>
          </div>
        </div>
      </div>
    </div>

    <FormNavigation
      :show-back="false"
      next-label="Next Step"
      :next-disabled="!meta.valid"
    />
  </form>
</template>

<style scoped>
/* Component-specific styles only */
</style>
