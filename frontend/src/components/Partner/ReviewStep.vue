<script setup lang="ts">
import BaseButton from '@/components/UI/BaseButton.vue'
import FormStepHeader from '@/components/UI/FormStepHeader.vue'
import ReviewPersonalInfo from './Review/ReviewPersonalInfo.vue'
import ReviewShareholding from './Review/ReviewShareholding.vue'
import ReviewDocumentList from './Review/ReviewDocumentList.vue'
import type { PartnerFormValues } from '@/domain/partner/partner.schema'
import { useTranslation } from '@/composables/i18n/useTranslation'

defineProps<{
  formData: Partial<PartnerFormValues>
}>()

defineEmits<{
  submit: []
  back: []
}>()

const { t } = useTranslation()
</script>

<template>
  <div class="review-step">
    <FormStepHeader
      :title="t('partner.registration.review.stepTitle')"
      :description="t('partner.registration.review.stepDescription')"
    />

    <div class="review-sections">
      <ReviewPersonalInfo
        :full-name="formData.fullName"
        :cpf="formData.cpf"
        :nationality="formData.nationality"
        :is-pep="formData.isPep"
      />

      <ReviewShareholding :shareholding="formData.shareholding" />

      <ReviewDocumentList :documents="formData.documents" />
    </div>

    <div class="form-actions">
      <BaseButton variant="outline" @click="$emit('back')">
        {{ t('common.back') }}
      </BaseButton>
      <BaseButton variant="primary" @click="$emit('submit')">
        {{ t('partner.registration.review.submit') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.review-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .form-actions {
    justify-content: flex-end;
  }
}
</style>
