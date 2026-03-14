<script setup lang="ts">
defineProps<{
  message?: string
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="text-center py-5">
    <div 
      class="spinner-border mb-3" 
      :class="{
        'spinner-border-sm': size === 'sm',
        'spinner-border-lg': size === 'lg'
      }"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <p v-if="message" class="text-muted small">{{ message }}</p>
  </div>
</template>

<style scoped>
.spinner-border {
  color: currentColor;
}

.spinner-border-lg {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

.text-muted {
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>
