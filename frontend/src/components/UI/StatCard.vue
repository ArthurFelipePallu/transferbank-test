<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    variant?: 'gradient' | 'light'
    highlight?: boolean
  }>(),
  {
    variant: 'gradient',
    highlight: false,
  }
)
</script>

<template>
  <div class="card h-100" :class="[`stat-card--${variant}`, { 'stat-card--highlight': highlight }]">
    <div class="card-body">
      <p class="stat-label">{{ label }}</p>
      <h3 class="stat-value">{{ value }}</h3>
    </div>
  </div>
</template>

<style scoped>
.stat-card--gradient {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  border: none;
}

.stat-card--light {
  background: var(--color-chip-bg);
  border: 1px solid var(--color-chip-border);
}

.stat-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
}

.stat-card--gradient .stat-label {
  opacity: 0.75;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-card--highlight .stat-value {
  color: var(--color-warning);
}

@media (max-width: 639px) {
  .stat-value {
    font-size: 1.75rem;
  }
}
</style>
