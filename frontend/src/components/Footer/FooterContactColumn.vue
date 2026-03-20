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
      <a :href="`mailto:${email}`" class="footer-link-item user-select-text">{{ email }}</a>
    </p>
    <p class="small mb-0 user-select-none">
      {{ phoneLabel }}:
      <a :href="`tel:${phone}`" class="footer-link-item user-select-text">{{ phone }}</a>
    </p>
  </div>
</template>

<style scoped>
/* footer-link-item styles live in base.css as a global utility */
</style>
