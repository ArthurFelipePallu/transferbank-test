<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'
import ColoredContainer from '@/components/Layout/ColoredContainer.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import DividerText from '@/components/UI/DividerText.vue'
import SocialLoginButton from '@/components/Auth/SocialLoginButton.vue'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import { Apple } from 'lucide-vue-next'
import { authPageLinks } from '@/config/navigation'

const { t } = useTranslation()
</script>

<template>
  <div class="card border-0 shadow-lg">
    <div class="card-body p-4 p-sm-5">
      <!-- Header -->
      <header class="text-center mb-4">
        <div class="d-flex justify-content-center mb-3">
          <ColoredContainer :background-color="'var(--color-accent-teal-1)'" :padding="'1rem'">
            <BaseLucideIcon name="Lock" :size="24" :stroke_width="2.5" color="var(--color-white)" />
          </ColoredContainer>
        </div>
        <h1 class="h3 fw-bold mb-2">{{ t('auth.welcomeBack') }}</h1>
        <p class="text-muted mb-0">{{ t('auth.signInToContinue') }}</p>
      </header>

      <LoginForm class="mb-4" />

      <DividerText :text="t('auth.orContinueWith')" class="my-4" />

      <div class="social-buttons mb-4">
        <div class="row g-3">
          <div class="col-12 col-sm-6">
            <SocialLoginButton label="Google" @click="$router.push({ name: authPageLinks.socialLoginFallback })">
              <template #icon><GoogleIcon /></template>
            </SocialLoginButton>
          </div>
          <div class="col-12 col-sm-6">
            <SocialLoginButton label="Apple" @click="$router.push({ name: authPageLinks.socialLoginFallback })">
              <template #icon><Apple :size="18" /></template>
            </SocialLoginButton>
          </div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-muted mb-0">
          {{ t('auth.noAccount') }}
          <RouterLink class="text-decoration-none fw-semibold signup-link" :to="{ name: authPageLinks.signUp }">
            {{ t('auth.signUp') }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 1rem;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.signup-link {
  color: var(--color-primary-teal);
  transition: color 0.2s ease;
}

.signup-link:hover {
  color: var(--color-accent-teal-1);
}

.social-buttons {
  width: 100%;
}

/* Mobile adjustments */
@media (max-width: 575px) {
  .card-body {
    padding: 1.5rem !important;
  }
}
</style>
