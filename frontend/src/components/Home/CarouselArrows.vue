<script setup lang="ts">
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import { useTranslation } from '@/composables/i18n/useTranslation'

const emit = defineEmits<{ prev: []; next: [] }>()
const { t } = useTranslation()
</script>

<template>
  <button
    class="carousel-arrow carousel-arrow--prev"
    type="button"
    :aria-label="t('common.back')"
    @click="emit('prev')"
  >
    <BaseLucideIcon name="ChevronLeft" :size="22" />
  </button>
  <button
    class="carousel-arrow carousel-arrow--next"
    type="button"
    :aria-label="t('common.next')"
    @click="emit('next')"
  >
    <BaseLucideIcon name="ChevronRight" :size="22" />
  </button>
</template>

<style scoped>
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-black-alpha-30);
  color: var(--color-white);
  border: 1px solid var(--color-white-alpha-20);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: unset;
  padding: 0;
  transition: background 0.2s ease;
}

.carousel-arrow:hover { background: var(--color-black-alpha-50); }
.carousel-arrow--prev { left: var(--spacing-md); }
.carousel-arrow--next { right: var(--spacing-md); }
</style>
