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
        <RouterLink :to="{ name: link.name }" class="text-decoration-none footer-link">
          <slot :link="link">{{ link.name }}</slot>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.footer-link {
  color: var(--color-input-border);
  font-size: 0.875rem;
  transition: color 0.2s ease;
  display: inline-block;
  padding: 0.25rem 0;
}

.footer-link:hover {
  color: var(--bs-white);
  text-decoration: underline !important;
}

.footer-link:focus-visible {
  outline: 2px solid var(--color-primary-teal);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

@media (max-width: 767px) {
  .footer-link {
    min-height: 36px;
    line-height: 36px;
    padding: 0;
  }
}

@media (min-width: 768px) {
  .footer-link {
    min-height: auto;
    line-height: 1.5;
    padding: 0.125rem 0;
  }
}
</style>
