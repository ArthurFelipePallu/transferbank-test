<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'

export interface DropdownItem {
  label: string
  route?: string
  icon?: string
  isDanger?: boolean
}

const props = defineProps<{
  item: DropdownItem
  hasSubmenu?: boolean
  isActive?: boolean
}>()

const emit = defineEmits<{
  click: []
  mouseenter: []
  mouseleave: []
}>()

const itemClasses = computed(() => ({
  'dropdown-item': true,
  'dropdown-parent': props.hasSubmenu,
  'dropdown-item-danger': props.item.isDanger,
}))
</script>

<template>
  <button 
    :class="itemClasses"
    @click="emit('click')"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
  >
    <slot name="icon" />
    <ChevronLeft 
      v-if="hasSubmenu" 
      :size="16" 
      class="submenu-arrow" 
    />
    <span class="item-label">{{ item.label }}</span>
    <slot name="submenu" />
  </button>
</template>

<style scoped>
.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: var(--color-white);
  text-align: left;
  position: relative;
}

.dropdown-item:hover {
  background: var(--color-white-alpha-10);
}

.dropdown-parent {
  cursor: default;
}

.dropdown-item-danger {
  color: var(--color-danger-text);
}

.dropdown-item-danger:hover {
  background: var(--color-danger-alpha-15);
}

.item-label {
  flex: 1;
}

.submenu-arrow {
  color: var(--color-white-alpha-60);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.dropdown-parent:hover .submenu-arrow {
  transform: translateX(-2px);
  color: var(--color-white-alpha-90);
}
</style>
