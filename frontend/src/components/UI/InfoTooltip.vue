<script setup lang="ts">
import { ref } from 'vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

interface Props {
  iconSize?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 16,
  position: 'top',
  ariaLabel: 'Information'
})

const showTooltip = ref(false)
</script>

<template>
  <div class="position-relative d-inline-flex">
    <button
      type="button"
      class="btn btn-sm btn-outline-primary rounded-circle p-0 info-button"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
      :aria-label="ariaLabel"
    >
      <BaseLucideIcon name="Info" :size="iconSize" />
    </button>
    
    <Transition name="tooltip-fade">
      <div v-if="showTooltip" class="position-absolute info-tooltip" :class="`info-tooltip--${position}`">
        <div class="tooltip-content bg-white rounded shadow">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.info-button {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: var(--color-teal-alpha-30);
  color: var(--color-primary-teal);
  transition: all 0.2s ease;
}

.info-button:hover,
.info-button:focus {
  background-color: var(--color-teal-alpha-10);
  border-color: var(--color-primary-teal);
  color: var(--color-primary-teal);
}

.info-tooltip {
  z-index: 1000;
  min-width: 250px;
  max-width: 300px;
}

/* Position: Top (default) */
.info-tooltip--top {
  bottom: calc(100% + 8px);
  right: 0;
}

.info-tooltip--top .tooltip-content::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 12px;
  width: 12px;
  height: 12px;
  background: var(--bs-white);
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px var(--color-black-alpha-10);
}

/* Position: Bottom */
.info-tooltip--bottom {
  top: calc(100% + 8px);
  right: 0;
}

.info-tooltip--bottom .tooltip-content::after {
  content: '';
  position: absolute;
  top: -6px;
  right: 12px;
  width: 12px;
  height: 12px;
  background: var(--bs-white);
  transform: rotate(45deg);
  box-shadow: -2px -2px 4px var(--color-black-alpha-10);
}

/* Position: Left */
.info-tooltip--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.info-tooltip--left .tooltip-content::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: var(--bs-white);
  box-shadow: 2px -2px 4px var(--color-black-alpha-10);
}

/* Position: Right */
.info-tooltip--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.info-tooltip--right .tooltip-content::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: var(--bs-white);
  box-shadow: -2px 2px 4px var(--color-black-alpha-10);
}

.tooltip-content {
  padding: 0.875rem;
  box-shadow: 0 4px 12px var(--color-black-alpha-15);
}

/* Tooltip transition */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .info-tooltip {
    min-width: 240px;
  }
  
  .info-tooltip--top,
  .info-tooltip--bottom {
    right: auto;
    left: 0;
  }
  
  .info-tooltip--top .tooltip-content::after,
  .info-tooltip--bottom .tooltip-content::after {
    right: auto;
    left: 12px;
  }
}
</style>
