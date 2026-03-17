<script setup lang="ts">
import { computed } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import type { IconName } from '@/utils/LucideIconMap'

interface Props {
  currentValue: number | null
  previousValue: number | null
  size?: 'sm' | 'md' | 'lg'
  decimals?: number
  minimumChangeThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  decimals: 2,
  minimumChangeThreshold: 0.01
})

const sizeMap = {
  sm: 12,
  md: 14,
  lg: 16,
}

const iconSize = sizeMap[props.size]

// Calculate percentage change
const percentageChange = computed(() => {
  if (props.currentValue === null || props.previousValue === null) {
    return null
  }
  
  if (props.previousValue === 0) {
    return null
  }
  
  const absoluteChange = Math.abs(props.currentValue - props.previousValue)
  return (absoluteChange / props.previousValue) * 100
})

// Determine direction
const direction = computed(() => {
  if (props.currentValue === null || props.previousValue === null) {
    return 'neutral'
  }
  
  const difference = props.currentValue - props.previousValue
  
  if (difference > props.minimumChangeThreshold) {
    return 'up'
  } else if (difference < -props.minimumChangeThreshold) {
    return 'down'
  }
  
  return 'neutral'
})

// Get icon name based on direction
const iconName = computed<IconName>(() => {
  if (direction.value === 'up') return 'TrendingUp'
  if (direction.value === 'down') return 'TrendingDown'
  return 'Minus'
})

// Check if should display
const shouldDisplay = computed(() => {
  return props.currentValue !== null && props.previousValue !== null && percentageChange.value !== null
})

// Format percentage
const formattedPercentage = computed(() => {
  if (percentageChange.value === null) return '0.00'
  return percentageChange.value.toFixed(props.decimals)
})
</script>

<template>
  <span
    v-if="shouldDisplay"
    class="badge d-inline-flex align-items-center gap-1 fw-semibold"
    :class="[
      `badge-${direction}`,
      `badge-${size}`
    ]"
  >
    <BaseLucideIcon :name="iconName" :size="iconSize" />
    <span class="text-nowrap">{{ formattedPercentage }}%</span>
  </span>
</template>

<style scoped>
/* Size variants using Bootstrap spacing scale */
.badge-sm {
  font-size: 0.6875rem;
  padding: 0.2rem 0.4rem;
}

.badge-md {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.badge-lg {
  font-size: 0.875rem;
  padding: 0.3rem 0.6rem;
}

/* Color variants using semantic colors */
.badge-up {
  color: var(--color-success);
  background-color: var(--color-success-alpha-10);
}

.badge-down {
  color: var(--color-danger);
  background-color: var(--color-danger-alpha-15);
}

.badge-neutral {
  color: var(--color-neutral);
  background-color: var(--color-neutral-alpha-10);
}

/* Animation - only on mount, not on every render */
.badge {
  border-radius: 0.375rem;
}
</style>
