<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCurrencyStore } from '@/stores/useCurrencyStore'
import { CurrencyDisplayService } from '@/application/currency/CurrencyDisplayService'
import { useTranslation } from '@/composables/i18n/useTranslation'
import CurrencyRateCard from '@/components/Currency/CurrencyRateCard.vue'
import MarketStatusBadge from '@/components/Currency/MarketStatusBadge.vue'
import BaseLucideIcon from '@/components/BaseLucideIcon.vue'

const currencyStore  = useCurrencyStore()
const currencyDisplays = CurrencyDisplayService.getDisplayCurrencies()
const { t } = useTranslation()

onMounted(()   => currencyStore.startAutoUpdate())
onUnmounted(() => currencyStore.stopAutoUpdate())
</script>

<template>
  <!-- Only visible on mobile — desktop already shows this in the login page sidebar -->
  <section
    class="d-lg-none landing-rates"
    aria-labelledby="landing-rates-title"
  >
    <!-- Divider strip — teal-tinted light strip matching the lighter landing sections -->
    <div class="landing-rates__divider" />

    <!-- Dark gradient panel — same background as CurrencyInfoPanel -->
    <div class="landing-rates__panel section-spacing">
      <div class="standard-container px-3">

        <!-- Section header -->
        <div class="d-flex align-items-center gap-2 mb-4">
          <BaseLucideIcon name="TrendingUp" :size="22" color="var(--color-white)" />
          <div>
            <h2 id="landing-rates-title" class="h5 fw-bold mb-0 text-white">
              {{ t('landing.rates.title') }}
            </h2>
            <p class="small mb-0" style="color: var(--color-white-alpha-60)">
              {{ t('landing.rates.subtitle') }}
            </p>
          </div>
        </div>

        <!-- Rate cards -->
        <div class="d-flex flex-column gap-3">
          <CurrencyRateCard
            v-for="display in currencyDisplays"
            :key="display.code"
            :icon-name="display.iconName"
            :symbol="display.symbol"
            :currency-code="display.code"
            :currency-name="display.name"
            :current-rate="currencyStore.formatRate(display.code)"
            :current-value="currencyStore.getDisplayValues(display.code).currentValue"
            :previous-value="currencyStore.getDisplayValues(display.code).previousValue"
          />
        </div>

        <!-- Market status -->
        <div class="mt-3">
          <MarketStatusBadge
            :is-active="true"
            :status-text="t('currency.marketActive')"
            :description="t('currency.realTimeDataSource')"
          />
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Teal-tinted light strip — matches the lighter sections (LandingFeatures bg-white with teal accent) */
.landing-rates__divider {
  height: 2.5rem;
  background: linear-gradient(
    180deg,
    var(--color-teal-alpha-5) 0%,
    var(--color-accent-teal-alpha-5) 100%
  );
  border-top: 1px solid var(--color-teal-alpha-10);
  border-bottom: 1px solid var(--color-teal-alpha-10);
}

/* Dark gradient panel — identical to CurrencyInfoPanel background */
.landing-rates__panel {
  background: linear-gradient(
    135deg,
    var(--color-primary-bg-start) 0%,
    var(--color-primary-bg-mid)   50%,
    var(--color-primary-bg-end)   100%
  );
  color: var(--color-white);
}
</style>
