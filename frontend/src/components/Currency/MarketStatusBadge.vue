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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #6c757d;
  border-radius: 50%;
}

.status-indicator.active {
  background: #10b981;
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
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>
