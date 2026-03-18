<script setup lang="ts">
/**
 * DocumentsRequiredInfo - shows the standard list of required partner documents.
 * Extracted from PartnerAddForm and DocumentsStep to avoid duplication.
 */
import AlertCard from '@/components/UI/AlertCard.vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
</script>

<template>
  <AlertCard variant="info">
    <p class="fw-semibold mb-1 small">{{ t('partner.registration.documents.requiredTitle') }}</p>
    <ul class="mb-0 ps-3 small">
      <li>{{ t('partner.registration.documents.idCard') }}</li>
      <li>{{ t('partner.registration.documents.driversLicense') }}</li>
      <li>{{ t('partner.registration.documents.proofOfAddress') }}</li>
    </ul>
  </AlertCard>
</template>
