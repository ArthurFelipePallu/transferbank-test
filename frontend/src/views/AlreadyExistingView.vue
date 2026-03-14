<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import StatusMessageCard from '@/components/UI/StatusMessageCard.vue'
import type { StatusAction, StatusLink } from '@/components/UI/StatusMessageCard.vue'

const { t } = useTranslation()

const primaryAction: StatusAction = {
  label: t('status.accountExists.action'),
  route: 'login',
  variant: 'primary',
}

const links: StatusLink[] = [
  { text: t('status.accountExists.forgotPassword'), linkText: t('status.accountExists.resetHere'), route: 'recover-password' },
  { text: t('status.needHelp'), linkText: t('status.contactSupport'), route: 'contact-us' },
]
</script>

<template>
  <StatusMessageCard
    icon="TriangleAlert"
    icon-color="var(--bs-warning)"
    variant="warning"
    :title="t('status.accountExists.title')"
    :message="t('status.accountExists.message')"
    :primary-action="primaryAction"
    :links="links"
  />
</template>
