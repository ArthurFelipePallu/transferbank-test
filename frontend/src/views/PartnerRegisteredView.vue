<script setup lang="ts">
import StatusMessageCard from '@/components/UI/StatusMessageCard.vue'
import type { StatusAction, StatusLink } from '@/components/UI/StatusMessageCard.vue'

const primaryAction: StatusAction = {
  label: 'Add Another Partner',
  route: 'partner-registration',
  variant: 'primary',
}

const links: StatusLink[] = [
  {
    text: 'All partners registered?',
    linkText: 'Go to Dashboard',
    route: 'dashboard',
  },
  {
    text: 'Need help?',
    linkText: 'Contact Support',
    route: 'contact-us',
  },
]
</script>

<template>
  <StatusMessageCard
    icon="UserCheck"
    icon-color="var(--color-primary-teal)"
    variant="success"
    title="Partner Successfully Registered!"
    message="The partner has been added to your company. You can now add more partners or proceed to the dashboard if all partners have been registered."
    :primary-action="primaryAction"
    :links="links"
  />
</template>
