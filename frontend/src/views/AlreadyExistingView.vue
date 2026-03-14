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
    text: 'Forgot your password?',
    linkText: 'Reset it here',
    route: 'recover-password',
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
    icon="TriangleAlert"
    icon-color="var(--bs-warning)"
    variant="warning"
    title="Account Already Exists"
    message="An account with the provided information already exists in our system. If this is your account, please log in to access it. If you believe this is an error, please contact our support team."
    :primary-action="primaryAction"
    :links="links"
  />
</template>
