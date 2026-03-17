<script setup lang="ts">
defineProps<{
  companyName: string
  rightsLabel: string
}>()

const year = new Date().getFullYear()
</script>

<template>
  <div class="border-top border-primary mt-4 pt-3 text-center">
    <p class="small mb-0 user-select-none">
      © {{ year }} {{ companyName }}. {{ rightsLabel }}
    </p>
  </div>
</template>
