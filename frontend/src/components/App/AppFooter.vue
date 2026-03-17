<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import AppBrandLogo from './AppBrandLogo.vue'
import FooterLinkColumn from '@/components/Footer/FooterLinkColumn.vue'
import FooterContactColumn from '@/components/Footer/FooterContactColumn.vue'
import FooterBottomBar from '@/components/Footer/FooterBottomBar.vue'
import { footerLinkGroups, footerContact } from '@/config/footerConfig'

const { t } = useTranslation()
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

        <!-- Link columns (Services, Support, …) -->
        <div
          v-for="group in footerLinkGroups"
          :key="group.titleKey"
          class="col-6 col-sm-6 col-lg-3"
        >
          <FooterLinkColumn :title="t(group.titleKey)" :links="group.links">
            <template #default="{ link }">
              {{ t(link.labelKey) }}
            </template>
          </FooterLinkColumn>
        </div>

        <!-- Contact -->
        <div class="col-12 col-sm-6 col-lg-3">
          <FooterContactColumn
            :title="t('footer.contact')"
            :email-label="t('footer.email')"
            :phone-label="t('footer.phone')"
            :email="footerContact.email"
            :phone="footerContact.phone"
          />
        </div>

      </div>

      <FooterBottomBar
        company-name="SafeBank"
        :rights-label="t('footer.allRightsReserved')"
      />
    </div>
  </footer>
</template>

<style scoped>
.footer-bg {
  background: var(--color-bg-section-darker);
  color: var(--color-text-footer);
}

.footer-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 767px) {
  .footer-bg {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
}

@media (min-width: 1024px) {
  .footer-container {
    max-width: 80%;
    padding: 0 1.5rem;
  }
}

@media (min-width: 1920px) {
  .footer-container {
    max-width: 1536px;
  }
}
</style>
