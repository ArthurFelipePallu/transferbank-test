<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import { RouteName } from '@/domain/navigation/types/RouteNames'

const { t } = useTranslation()
</script>

<template>
  <div class="d-flex flex-wrap gap-2" role="list">
    <RouterLink
      :to="{ name: RouteName.CookiePolicy }"
      class="link-secondary text-decoration-underline-hover small"
      role="listitem"
      style="font-size: 0.75rem"
    >
      {{ t('cookies.cookiePolicy') }}
    </RouterLink>
    <span class="text-muted" aria-hidden="true" style="font-size: 0.75rem">·</span>
    <RouterLink
      :to="{ name: RouteName.PrivacyPolicy }"
      class="link-secondary text-decoration-underline-hover small"
      role="listitem"
      style="font-size: 0.75rem"
    >
      {{ t('cookies.privacyPolicy') }}
    </RouterLink>
    <span class="text-muted" aria-hidden="true" style="font-size: 0.75rem">·</span>
    <RouterLink
      :to="{ name: RouteName.Accessibility }"
      class="link-secondary text-decoration-underline-hover small"
      role="listitem"
      style="font-size: 0.75rem"
    >
      {{ t('cookies.accessibility') }}
    </RouterLink>
  </div>
</template>
