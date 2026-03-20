<script setup lang="ts">
import type { FooterLink } from '@/config/footerConfig'

defineProps<{
  title: string
  links: FooterLink[]
}>()
</script>

<template>
  <div>
    <h4 class="h6 fw-semibold mb-3 user-select-none">{{ title }}</h4>
    <ul class="list-unstyled mb-0">
      <li v-for="link in links" :key="link.name" class="mb-2">
        <RouterLink :to="{ name: link.name }" class="text-decoration-none footer-link-item">
          <slot :link="link">{{ link.name }}</slot>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* footer-link-item styles live in base.css as a global utility */
</style>
