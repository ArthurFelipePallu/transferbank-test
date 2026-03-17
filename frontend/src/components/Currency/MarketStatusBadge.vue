<script setup lang="ts">
defineProps<{
  isActive?: boolean
  statusText?: string
  description?: string
}>()
</script>

<template>
  <div class="market-status mt-4 p-3 rounded">
    <div class="d-flex align-items-center gap-2">
      <div class="status-indicator" :class="{ active: isActive !== false }"></div>
      <span class="small fw-semibold">{{ statusText || 'Market Active' }}</span>
    </div>
    <p class="text-muted small mb-0 mt-2">
      {{ description || 'Real-time data from CoinGecko API' }}
    </p>
  </div>
</template>

<style scoped>
.market-status {
  background: var(--color-white-alpha-5);
  border: 1px solid var(--color-white-alpha-10);
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: var(--color-neutral);
  border-radius: 50%;
}

.status-indicator.active {
  background: var(--color-success);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.text-muted {
  color: var(--color-white-alpha-70) !important;
}
</style>
