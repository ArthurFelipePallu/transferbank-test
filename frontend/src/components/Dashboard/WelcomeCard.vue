<script setup lang="ts">
import { User } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section class="card mb-4 text-white welcome-card">
    <div class="card-body d-flex justify-content-between align-items-center p-4">
      <div class="flex-grow-1">
        <h1 class="h2 fw-bold mb-2">{{ title }}</h1>
        <p class="mb-0 fs-5 opacity-90">{{ subtitle }}</p>
      </div>
      <div class="d-none d-sm-flex welcome-icon">
        <User :size="48" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
}

.welcome-icon {
  width: 4rem;
  height: 4rem;
  background: var(--color-white-alpha-20);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
</style>
