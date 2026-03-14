<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import type { TranslationKey } from '@/infrastructure/i18n/translations/en/index'
import AppBrandLogo from './AppBrandLogo.vue'

const { t } = useTranslation()
const year = new Date().getFullYear()

const servicesLinks: { name: string; labelKey: TranslationKey }[] = [
  { name: 'accounts',     labelKey: 'navigation.accounts' },
  { name: 'transfers',    labelKey: 'navigation.transfers' },
  { name: 'loans',        labelKey: 'navigation.loans' },
  { name: 'investments',  labelKey: 'navigation.investments' },
]

const supportLinks: { name: string; labelKey: TranslationKey }[] = [
  { name: 'help-center',  labelKey: 'navigation.helpCenter' },
  { name: 'security',     labelKey: 'navigation.security' },
  { name: 'report-fraud', labelKey: 'footer.reportFraud' },
  { name: 'contact-us',   labelKey: 'navigation.contactUs' },
]

const contactInformation = {
  email: 'support@mediteranian.com',
  phone: '+1 234 567 890',
}
</script>

<template>
  <footer class="py-4 py-md-5 footer-bg">
    <div class="footer-container">
      <div class="row g-4 g-md-5">
        <!-- Brand -->
        <div class="col-12 col-sm-6 col-lg-3">
          <AppBrandLogo />
          <p class="mt-3 small text-muted user-select-none">{{ t('footer.tagline') }}</p>
        </div>

        <!-- Services -->
        <div class="col-6 col-sm-6 col-lg-3">
          <h4 class="h6 fw-semibold mb-3 user-select-none">{{ t('footer.services') }}</h4>
          <ul class="list-unstyled footer-links">
            <li v-for="service in servicesLinks" :key="service.name" class="mb-2">
              <RouterLink :to="{ name: service.name }" class="text-decoration-none footer-link">
                {{ t(service.labelKey) }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="col-6 col-sm-6 col-lg-3">
          <h4 class="h6 fw-semibold mb-3 user-select-none">{{ t('footer.support') }}</h4>
          <ul class="list-unstyled footer-links">
            <li v-for="support in supportLinks" :key="support.name" class="mb-2">
              <RouterLink :to="{ name: support.name }" class="text-decoration-none footer-link">
                {{ t(support.labelKey) }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="col-12 col-sm-6 col-lg-3">
          <h4 class="h6 fw-semibold mb-3 user-select-none">{{ t('footer.contact') }}</h4>
          <p class="small mb-2 user-select-none">
            {{ t('footer.email') }}: 
            <a :href="`mailto:${contactInformation.email}`" class="footer-link user-select-text">
              {{ contactInformation.email }}
            </a>
          </p>
          <p class="small mb-0 user-select-none">
            {{ t('footer.phone') }}: 
            <a :href="`tel:${contactInformation.phone}`" class="footer-link user-select-text">
              {{ contactInformation.phone }}
            </a>
          </p>
        </div>
      </div>

      <div class="border-top border-primary mt-4 pt-3 text-center">
        <p class="small mb-0 user-select-none">© {{ year }} SafeBank. {{ t('footer.allRightsReserved') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-bg {
    background: var(--color-bg-section-darker);
    color: var(--color-text-footer);
}

.footer-container {
    /* Mobile: full width with padding */
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
}

.footer-links {
    /* Touch-friendly spacing on mobile */
    margin-bottom: 0;
}

.footer-link {
    color: var(--color-input-border);
    font-size: 0.875rem;
    transition: color 0.2s ease;
    /* Touch-friendly target on mobile */
    display: inline-block;
    padding: 0.25rem 0;
}

.footer-link:hover {
    color: var(--bs-white);
    text-decoration: underline !important;
}

.footer-link:focus-visible {
    outline: 2px solid var(--color-primary-teal);
    outline-offset: 2px;
    border-radius: 0.25rem;
}

/* Reduce vertical spacing on mobile */
@media (max-width: 767px) {
    .footer-bg {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
    }
    
    .footer-link {
        min-height: 36px;
        line-height: 36px;
        padding: 0;
    }
}

/* Tablet and up: normal spacing */
@media (min-width: 768px) {
    .footer-link {
        min-height: auto;
        line-height: 1.5;
        padding: 0.125rem 0;
    }
}

/* Desktop: constrain to 80% like header */
@media (min-width: 1024px) {
    .footer-container {
        max-width: 80%;
        padding: 0 1.5rem;
    }
}

/* Ensure content doesn't go to extremes on very large screens */
@media (min-width: 1920px) {
    .footer-container {
        max-width: 1536px; /* 80% of 1920px */
    }
}
</style>
