<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppBrandLogo from '@/components/App/AppBrandLogo.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
</script>

<template>
  <main class="success-page">
    <div class="success-container">
      <div class="success-card">
        <div class="brand-section">
          <AppBrandLogo />
        </div>

        <div class="icon-section">
          <div class="icon-wrapper">
            <BaseLucideIcon 
              name="CheckCircle" 
              :size="64" 
              :stroke_width="2"
              color="var(--color-primary-teal)" 
            />
          </div>
        </div>

        <div class="content-section">
          <h1 class="success-title">Account Successfully Created!</h1>
          <p class="success-message">
            Congratulations! Your account has been created successfully. 
            You can now log in to access your account and start using our services.
          </p>
        </div>

        <div class="action-section">
          <RouterLink :to="{ name: 'login' }" class="login-button">
            Go to Login
          </RouterLink>
        </div>

        <div class="info-section">
          <p class="info-text">
            Need help? <RouterLink :to="{ name: 'contact-us' }" class="info-link">Contact Support</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.success-page {
  min-height: 100vh;
  background: var(--color-surface);
  padding: var(--spacing-page);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.success-card {
  background: var(--color-white);
  border-radius: 1rem;
  padding: var(--spacing-card);
  border: 1px solid var(--color-surface-border);
  box-shadow: var(--shadow-card-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.brand-section {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-surface-border);
  width: 100%;
  display: flex;
  justify-content: center;
}

.icon-section {
  margin: 0.5rem 0;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(28, 156, 140, 0.1), rgba(33, 184, 166, 0.1));
  border: 3px solid var(--color-primary-teal);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(28, 156, 140, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(28, 156, 140, 0);
  }
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 500px;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
  line-height: 1.3;
}

.success-message {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.action-section {
  width: 100%;
  margin-top: 0.5rem;
}

.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--color-primary-teal), var(--color-accent-teal-1));
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: var(--shadow-button-primary);
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.login-button:hover {
  box-shadow: var(--shadow-button-primary-active);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

.info-section {
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-surface-border);
  width: 100%;
}

.info-text {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0;
}

.info-link {
  color: var(--color-primary-teal);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.info-link:hover {
  color: var(--color-accent-teal-1);
  text-decoration: underline;
}

@media (min-width: 640px) {
  .success-card {
    padding: 2.5rem 3rem;
    border-radius: 1.25rem;
    gap: 2rem;
  }

  .icon-wrapper {
    width: 140px;
    height: 140px;
  }

  .success-title {
    font-size: 1.75rem;
  }

  .success-message {
    font-size: 1rem;
  }

  .login-button {
    font-size: 1.05rem;
    padding: 1.1rem 2.5rem;
  }

  .info-text {
    font-size: 0.9rem;
  }
}

@media (min-width: 1024px) {
  .success-title {
    font-size: 2rem;
  }

  .icon-wrapper {
    width: 160px;
    height: 160px;
  }
}
</style>
