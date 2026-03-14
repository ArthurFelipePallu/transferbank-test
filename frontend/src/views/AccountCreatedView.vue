<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import StatusMessageCard from '@/components/UI/StatusMessageCard.vue'
import type { StatusAction, StatusLink } from '@/components/UI/StatusMessageCard.vue'

const { t } = useTranslation()

const primaryAction: StatusAction = {
  label: t('status.accountCreated.action'),
  route: 'login',
  variant: 'primary',
}

const links: StatusLink[] = [
  { text: t('status.needHelp'), linkText: t('status.contactSupport'), route: 'contact-us' },
]
</script>

<template>
  <StatusMessageCard
    icon="CheckCircle"
    icon-color="var(--color-primary-teal)"
    variant="success"
    :title="t('status.accountCreated.title')"
    :message="t('status.accountCreated.message')"
    :primary-action="primaryAction"
    :links="links"
  />
</template>
