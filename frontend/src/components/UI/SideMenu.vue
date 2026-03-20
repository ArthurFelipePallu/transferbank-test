<script setup lang="ts">
/**
 * SideMenu — generic modal-style side panel.
 *
 * Usage:
 *   <SideMenu v-model="isOpen" title="My Panel">
 *     <p>Content here</p>
 *   </SideMenu>
 *
 * - Teleports to <body> — escapes any stacking context
 * - Slides in from the right
 * - Backdrop closes on click
 * - ESC key and scroll-lock handled by useSideMenu composable
 */
import { watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useSideMenu } from '@/composables/ui/useSideMenu'
import { useTranslation } from '@/composables/i18n/useTranslation'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useTranslation()
const { isOpen, open, close } = useSideMenu(props.modelValue)

watch(() => props.modelValue, (val) => { val ? open() : close() })
watch(isOpen, (val) => { emit('update:modelValue', val) })
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="sm-overlay">
      <div
        v-if="isOpen"
        class="side-menu-overlay"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="sm-slide">
      <aside
        v-if="isOpen"
        class="side-menu-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="side-menu-header">
          <span v-if="title" class="side-menu-title">{{ title }}</span>
          <slot name="header" />
          <button class="side-menu-close" @click="close" :aria-label="t('common.close')">
            <X :size="20" />
          </button>
        </div>

        <div class="side-menu-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="side-menu-footer">
          <slot name="footer" />
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.side-menu-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-black-alpha-50);
  backdrop-filter: blur(2px);
  z-index: var(--z-modal-backdrop);
}

.side-menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 240px;
  max-width: 85vw;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--color-primary-bg-start), var(--color-primary-bg-end));
  box-shadow: -4px 0 32px var(--color-black-alpha-30);
  z-index: var(--z-mobile-menu);
  overflow: hidden;
}

.side-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-white-alpha-15);
  flex-shrink: 0;
}

.side-menu-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-white);
  flex: 1;
}

.side-menu-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-white);
  cursor: pointer;
  transition: background-color 0.15s ease;
  min-height: unset;
}

.side-menu-close:hover  { background: var(--color-white-alpha-12); }
.side-menu-close:active { background: var(--color-white-alpha-20); }

.side-menu-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xs);
}

.side-menu-footer {
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--color-white-alpha-15);
  flex-shrink: 0;
}

/* Transitions */
.sm-overlay-enter-active, .sm-overlay-leave-active { transition: opacity 0.3s ease; }
.sm-overlay-enter-from,  .sm-overlay-leave-to      { opacity: 0; }

.sm-slide-enter-active, .sm-slide-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.sm-slide-enter-from,   .sm-slide-leave-to     { transform: translateX(100%); }
</style>
