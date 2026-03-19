<script setup lang="ts">
import { useTranslation } from '@/composables/i18n/useTranslation'
import StatusMessageCard from '@/components/UI/StatusMessageCard.vue'
import type { StatusAction, StatusLink } from '@/components/UI/StatusMessageCard.vue'

const { t } = useTranslation()

const primaryAction: StatusAction = {
  label: t('status.partnerRegistered.action'),
  route: 'partner-registration',
  variant: 'primary',
}

const links: StatusLink[] = [
  { text: t('status.partnerRegistered.allRegistered'), linkText: t('status.partnerRegistered.goToDashboard'), route: 'dashboard' },
  { text: t('status.needHelp'), linkText: t('status.contactSupport'), route: 'contact-us' },
]
</script>

<template>
  <StatusMessageCard
    icon="UserCheck"
    icon-color="var(--color-primary-teal)"
    variant="success"
    :title="t('status.partnerRegistered.title')"
    :message="t('status.partnerRegistered.message')"
    :primary-action="primaryAction"
    :links="links"
  />
</template>
