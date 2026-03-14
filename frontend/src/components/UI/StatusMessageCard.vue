<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppBrandLogo from '@/components/App/AppBrandLogo.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

export interface StatusAction {
  label: string
  route: string
  variant?: 'primary' | 'secondary'
}

export interface StatusLink {
  text: string
  linkText: string
  route: string
}

const props = withDefaults(
  defineProps<{
    icon: string
    iconColor?: string
    iconBgColor?: string
    iconBorderColor?: string
    title: string
    message: string
    primaryAction: StatusAction
    links?: StatusLink[]
    variant?: 'success' | 'warning' | 'error' | 'info'
  }>(),
  {
    iconColor: 'var(--color-primary-teal)',
    variant: 'success',
  }
)

const iconWrapperStyle = computed(() => {
  const colors = {
    success: {
      bg: 'linear-gradient(135deg, rgba(28, 156, 140, 0.1), rgba(33, 184, 166, 0.1))',
      border: 'var(--color-primary-teal)',
      shadow: 'rgba(28, 156, 140, 0.4)',
    },
    warning: {
      bg: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.15))',
      border: 'var(--bs-warning)',
      shadow: 'rgba(255, 193, 7, 0.4)',
    },
    error: {
      bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.15))',
      border: 'var(--color-error)',
      shadow: 'rgba(249, 115, 22, 0.4)',
    },
    info: {
      bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.15))',
      border: '#3b82f6',
      shadow: 'rgba(59, 130, 246, 0.4)',
    },
  }

  const variantColors = colors[props.variant]

  return {
    background: props.iconBgColor || variantColors.bg,
    borderColor: props.iconBorderColor || variantColors.border,
    '--shadow-color': variantColors.shadow,
  }
})
</script>

<template>
  <main class="d-flex align-items-center justify-content-center py-5 status-page">
    <div class="standard-container">
      <div class="card border-0 shadow-lg mx-auto rounded-3" style="max-width: 600px;">
        <div class="card-body p-4 p-sm-5 text-center">
          <!-- Brand Logo -->
          <div class="mb-4 pb-3 border-bottom d-flex justify-content-center">
            <AppBrandLogo />
          </div>

          <!-- Icon -->
          <div class="my-4">
            <div 
              class="d-inline-flex align-items-center justify-content-center rounded-circle icon-wrapper mb-3"
              :style="iconWrapperStyle"
            >
              <BaseLucideIcon 
                :name="icon as any" 
                :size="64" 
                :stroke_width="2"
                :color="iconColor" 
              />
            </div>
          </div>

          <!-- Content -->
          <div class="mb-4">
            <h1 class="h3 fw-bold mb-3">{{ title }}</h1>
            <p class="text-muted mb-0">{{ message }}</p>
          </div>

          <!-- Primary Action -->
          <div class="mb-4">
            <RouterLink 
              :to="{ name: primaryAction.route }" 
              class="btn btn-lg w-100 fw-semibold rounded-3 action-button"
              :class="primaryAction.variant === 'secondary' ? 'btn-outline-secondary' : 'btn-primary'"
            >
              {{ primaryAction.label }}
            </RouterLink>
          </div>

          <!-- Additional Links -->
          <div v-if="links && links.length > 0" class="pt-3 border-top">
            <p 
              v-for="(link, index) in links" 
              :key="index"
              class="small text-muted"
              :class="{ 'mb-2': index < links.length - 1, 'mb-0': index === links.length - 1 }"
            >
              {{ link.text }} 
              <RouterLink 
                :to="{ name: link.route }" 
                class="text-decoration-none fw-semibold link-primary"
              >
                {{ link.linkText }}
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.status-page {
  background: var(--color-surface);
  min-height: calc(100vh - 80px);
}

.icon-wrapper {
  width: 140px;
  height: 140px;
  border-width: 3px;
  border-style: solid;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--shadow-color);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px transparent;
  }
}

.action-button.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  border: none;
  box-shadow: var(--shadow-button-primary);
  transition: all 0.2s ease;
}

.action-button.btn-primary:hover {
  box-shadow: var(--shadow-button-primary-active);
  transform: translateY(-2px);
}

.action-button.btn-primary:active {
  transform: translateY(0);
}

.link-primary {
  color: var(--color-primary-teal);
}

.link-primary:hover {
  color: var(--color-accent-teal-1);
  text-decoration: underline !important;
}

@media (min-width: 576px) {
  .icon-wrapper {
    width: 160px;
    height: 160px;
  }
}
</style>
