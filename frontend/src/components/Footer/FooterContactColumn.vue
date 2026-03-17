<script setup lang="ts">
defineProps<{
  title: string
  emailLabel: string
  phoneLabel: string
  email: string
  phone: string
}>()
</script>

<template>
  <div>
    <h4 class="h6 fw-semibold mb-3 user-select-none">{{ title }}</h4>
    <p class="small mb-2 user-select-none">
      {{ emailLabel }}:
      <a :href="`mailto:${email}`" class="footer-link user-select-text">{{ email }}</a>
    </p>
    <p class="small mb-0 user-select-none">
      {{ phoneLabel }}:
      <a :href="`tel:${phone}`" class="footer-link user-select-text">{{ phone }}</a>
    </p>
  </div>
</template>

<style scoped>
.footer-link {
  color: var(--color-input-border);
  font-size: 0.875rem;
  transition: color 0.2s ease;
  display: inline-block;
  padding: 0.125rem 0;
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
</style>
