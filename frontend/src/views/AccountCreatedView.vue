<script setup lang="ts">
import StatusMessageCard from '@/components/UI/StatusMessageCard.vue'
import type { StatusAction, StatusLink } from '@/components/UI/StatusMessageCard.vue'

const primaryAction: StatusAction = {
  label: 'Go to Login',
  route: 'login',
  variant: 'primary',
}

const links: StatusLink[] = [
  {
    text: 'Need help?',
    linkText: 'Contact Support',
    route: 'contact-us',
  },
]
</script>

<template>
  <StatusMessageCard
    icon="CheckCircle"
    icon-color="var(--color-primary-teal)"
    variant="success"
    title="Account Successfully Created!"
    message="Congratulations! Your account has been created successfully. You can now log in to access your account and start using our services."
    :primary-action="primaryAction"
    :links="links"
  />
</template>
