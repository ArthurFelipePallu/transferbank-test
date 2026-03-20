<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section class="card mb-4 text-white welcome-card">
    <div class="card-body d-flex align-items-center justify-content-between gap-3 p-3 p-md-4">
      <div class="min-w-0 flex-grow-1">
        <h1 class="h3 h2-md fw-bold mb-1 mb-md-2 text-truncate">{{ title }}</h1>
        <p class="mb-0 opacity-90 text-truncate">{{ subtitle }}</p>
      </div>
      <div class="welcome-icon flex-shrink-0 avatar-circle avatar-circle--ghost avatar-circle--xl">
        <BaseLucideIcon name="User" class="welcome-icon__svg" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
}

.welcome-icon__svg {
  width: 1.5rem;
  height: 1.5rem;
}

@media (min-width: 576px) {
  .welcome-icon {
    width: 4rem;
    height: 4rem;
  }

  .welcome-icon__svg {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
