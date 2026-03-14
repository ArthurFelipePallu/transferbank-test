<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import FileUpload from './FileUpload.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import FormNavigation from '@/components/UI/FormNavigation.vue'
import AlertCard from '@/components/UI/AlertCard.vue'
import { partnerDocumentsSchema, type PartnerDocumentsFormValues } from '@/domain/partner/partner.schema'
import type { PartnerDocument } from '@/domain/partner/partner.types'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  initialValues?: Partial<PartnerDocumentsFormValues>
}>()

const emit = defineEmits<{
  next: [values: PartnerDocumentsFormValues]
  back: []
}>()

const { t } = useTranslation()

const { handleSubmit, meta, setFieldValue, errors } = useForm<PartnerDocumentsFormValues>({
  validationSchema: partnerDocumentsSchema,
  initialValues: props.initialValues || {
    documents: [],
  },
})

const documents = ref<PartnerDocument[]>(props.initialValues?.documents || [])

const updateDocuments = (files: PartnerDocument[]) => {
  documents.value = files
  setFieldValue('documents', files)
}

const submit = handleSubmit((values) => {
  emit('next', values)
})
</script>

<template>
  <form @submit.prevent="submit">
    <FormStepHeader
      :title="t('partner.registration.documents.stepTitle')"
      :description="t('partner.registration.documents.stepDescription')"
    />

    <div class="row g-3">
      <div class="col-12">
        <FileUpload
          :model-value="documents"
          :label="t('partner.registration.documents.uploadLabel')"
          :error="errors.documents"
          @update:model-value="updateDocuments"
        />
      </div>

      <div class="col-12">
        <AlertCard variant="info">
          <p class="fw-semibold mb-2">📄 {{ t('partner.registration.documents.requiredTitle') }}</p>
          <ul class="mb-0 ps-3">
            <li>{{ t('partner.registration.documents.idCard') }}</li>
            <li>{{ t('partner.registration.documents.driversLicense') }}</li>
            <li>{{ t('partner.registration.documents.proofOfAddress') }}</li>
          </ul>
        </AlertCard>
      </div>
    </div>

    <FormNavigation
      :next-label="t('partner.registration.documents.reviewAndSubmit')"
      :next-disabled="!meta.valid"
      @back="$emit('back')"
    />
  </form>
</template>

<style scoped>
/* Component-specific styles only */
</style>
