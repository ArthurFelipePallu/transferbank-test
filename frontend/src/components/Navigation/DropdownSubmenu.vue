<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import type { MenuItem } from '@/domain/navigation/types/MenuItem'

defineProps<{
  items: MenuItem[]
  isVisible: boolean
}>()

const emit = defineEmits<{
  itemClick: [route: string]
}>()

const { t } = useTranslation()
</script>

<template>
  <Transition name="submenu">
    <div v-if="isVisible" class="submenu">
      <button 
        v-for="item in items" 
        :key="item.route"
        class="submenu-item" 
        @click="item.route && emit('itemClick', item.route)"
      >
        {{ t(item.label as any) }}
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.submenu {
  position: absolute;
  right: 100%;
  top: 0;
  min-width: 160px;
  margin-right: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submenu-item {
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.875rem;
  color: var(--color-white);
  text-align: left;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Submenu Transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.15s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
