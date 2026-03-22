<script setup lang="ts">
import ColoredContainer from '@/components/Layout/ColoredContainer.vue'
import LoginCard from '@/components/Auth/LoginCard.vue'
import CurrencyInfoPanel from '@/components/Currency/CurrencyInfoPanel.vue'

const CONTAINER_BG = 'var(--color-bg-section-dark)'
const CONTAINER_PADDING = '1.25rem'
</script>

<template>
  <main class="login-page min-vh-100 d-flex align-items-center justify-content-center py-4">

    <!-- Mobile: bare card, full-width, no dark container, no currency panel -->
    <div class="d-lg-none w-100 px-3">
      <LoginCard />
    </div>

    <!-- Desktop: dark container with card + currency panel side by side -->
    <div class="d-none d-lg-flex justify-content-center w-100 px-4">
      <ColoredContainer :background-color="CONTAINER_BG" :padding="CONTAINER_PADDING">
        <div class="desktop-layout">
          <div class="desktop-layout__form">
            <LoginCard />
          </div>
          <div class="desktop-layout__panel">
            <CurrencyInfoPanel />
          </div>
        </div>
      </ColoredContainer>
    </div>

  </main>
</template>

<style scoped>
.login-page {
  background: var(--color-surface);
}

.desktop-layout {
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
  max-width: 1400px;
  margin: 0 auto;
}

.desktop-layout__form {
  flex: 0 1 680px;
}

.desktop-layout__panel {
  flex: 1 1 auto;
  max-width: 550px;
}
</style>
