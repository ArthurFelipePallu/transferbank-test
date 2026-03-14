# Store Delegation Analysis - DDD/SOLID Principles

## Current State Analysis

### ✅ Already in Stores (Good)
1. **useAuthStore** - Authentication state, user session
2. **useOnboardingStore** - Company registration, form caching
3. **usePartnerStore** - Partner management, multi-step form
4. **useUiStore** - UI state, notifications, loading states

---

## 🔴 CRITICAL: Should Be in Stores

### 1. Currency Rates State (`useCurrencyInfo` → `useCurrencyStore`)
**Current**: Composable with local state per component instance
**Problem**: 
- Each component using `useCurrencyInfo` creates its own rate provider
- Multiple API calls for same data
- No shared state across components
- Violates Single Responsibility (composable doing too much)

**Should Be**:
```typescript
// frontend/src/stores/useCurrencyStore.ts
export const useCurrencyStore = defineStore('currency', () => {
  const rates = ref<Map<CurrencyCode, CurrencyRate>>()
  const lastUpdated = ref<Date | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Single rate provider instance
  const rateProvider = new CoinGeckoCurrencyRateProvider()
  
  // Fetch all rates once, share across app
  const fetchRates = async () => { ... }
  
  // Get specific currency rate
  const getRate = (code: CurrencyCode) => rates.value.get(code)
  
  // Auto-update every 5 seconds
  const startAutoUpdate = () => { ... }
  
  return { rates, fetchRates, getRate, ... }
})
```

**Benefits**:
- Single API call for all currencies
- Shared state across all components
- Centralized error handling
- Better performance
- Follows DDD (store = repository pattern)

---

### 2. Account Setup Pricing State (`useAccountSetupCost` → `usePricingStore`)
**Current**: Composable with local state
**Problem**:
- Creates new service instances per component
- Duplicates rate fetching logic
- No caching of calculated prices

**Should Be**:
```typescript
// frontend/src/stores/usePricingStore.ts
export const usePricingStore = defineStore('pricing', () => {
  const accountSetupPrice = ref<AccountSetupPriceResult | null>(null)
  const priceHistory = ref<PriceChange[]>([])
  const isCalculating = ref(false)
  
  // Inject currency store
  const currencyStore = useCurrencyStore()
  
  // Calculate price using current rates from currency store
  const calculateAccountSetupPrice = async () => {
    const rates = currencyStore.rates
    // Use rates to calculate price
  }
  
  return { accountSetupPrice, calculateAccountSetupPrice, ... }
})
```

**Benefits**:
- Reuses currency rates from currency store
- Caches calculated prices
- Tracks price history
- Separation of concerns

---

## 🟡 MEDIUM PRIORITY: Should Be in Stores

### 3. Partners List State (`usePartnersList` → Merge into `usePartnerStore`)
**Current**: Separate composable for fetching partners list
**Problem**:
- Duplicates partner-related state management
- `usePartnerStore` already exists but doesn't handle list fetching

**Should Be**:
Merge `usePartnersList` logic into existing `usePartnerStore`:
```typescript
// Add to usePartnerStore
const partnersList = ref<Partner[]>([])
const isLoadingList = ref(false)
const listError = ref<string | null>(null)

const fetchPartnersList = async (companyId: string) => {
  isLoadingList.value = true
  try {
    const partners = await httpPartnerGateway.getPartnersByCompanyId(companyId)
    partnersList.value = partners
  } catch (err) {
    listError.value = err.message
  } finally {
    isLoadingList.value = false
  }
}
```

**Benefits**:
- Single source of truth for partner data
- Consistent state management
- Easier to sync after partner registration

---

### 4. Translation State (`useTranslation` → `useI18nStore`)
**Current**: Composable with local state
**Problem**:
- Language preference not persisted globally
- Each component creates own translation instance
- No centralized language switching

**Should Be**:
```typescript
// frontend/src/stores/useI18nStore.ts
export const useI18nStore = defineStore('i18n', () => {
  const currentLocale = ref<'en' | 'pt'>('pt')
  const translations = ref<Record<string, any>>({})
  
  const setLocale = (locale: 'en' | 'pt') => {
    currentLocale.value = locale
    storageService.set(STORAGE_KEYS.LOCALE, locale)
  }
  
  const t = (key: string) => {
    // Translation logic
  }
  
  return { currentLocale, setLocale, t }
})
```

**Benefits**:
- Global language state
- Persisted preference
- Single translation instance
- Easier to add new languages

---

## 🟢 LOW PRIORITY: Could Be in Stores

### 5. Form Lookup State (CNPJ/CEP)
**Current**: `useCnpjLookup`, `useCepLookup` composables
**Status**: Actually OK as composables
**Reason**: 
- Temporary, form-specific state
- Not shared across app
- Follows "local state for local concerns" principle

**Keep as composables** but could optionally cache results:
```typescript
// Optional: Add to useOnboardingStore
const cnpjCache = ref<Map<string, CompanyInfo>>()
const cepCache = ref<Map<string, AddressInfo>>()
```

---

### 6. Phone State Detection
**Current**: `usePhoneState` composable
**Status**: OK as composable
**Reason**:
- Pure utility function
- No persistent state
- Component-specific logic

**Keep as composable**

---

## 📋 Implementation Priority

### Phase 1: Critical (Do First)
1. Create `useCurrencyStore` - Move currency rate management
2. Create `usePricingStore` - Move pricing calculations
3. Update components to use new stores

**Impact**: 
- Eliminates duplicate API calls
- Improves performance significantly
- Better state management

---

### Phase 2: Medium Priority
4. Merge `usePartnersList` into `usePartnerStore`
5. Create `useI18nStore` for translations
6. Add caching to lookup composables (optional)

**Impact**:
- Better organization
- Consistent patterns
- Improved UX

---

### Phase 3: Optimization
7. Add computed properties for derived state
8. Implement state persistence where needed
9. Add state hydration on app load

---

## DDD/SOLID Principles Applied

### Single Responsibility Principle (SRP)
- **Stores**: Manage domain state (Currency, Pricing, Auth, etc.)
- **Composables**: Provide reusable logic (formatting, validation, utilities)
- **Services**: Handle business logic (calculations, transformations)
- **Gateways**: Handle external communication (API calls)

### Dependency Inversion Principle (DIP)
- Stores depend on abstractions (interfaces) not concrete implementations
- Services injected into stores, not created inside them
- Components depend on stores, not on services directly

### Open/Closed Principle (OCP)
- Stores extensible through actions
- New currency types added via configuration
- New features added without modifying existing code

---

## Store vs Composable Decision Matrix

| Criteria | Store | Composable |
|----------|-------|------------|
| **Shared across app** | ✅ Yes | ❌ No |
| **Persistent state** | ✅ Yes | ❌ No |
| **Domain entity** | ✅ Yes | ❌ No |
| **Needs caching** | ✅ Yes | ❌ No |
| **Multiple API calls** | ✅ Yes | ❌ No |
| **Pure utility** | ❌ No | ✅ Yes |
| **Component-specific** | ❌ No | ✅ Yes |
| **Temporary state** | ❌ No | ✅ Yes |

---

## Example: Currency Store Implementation

```typescript
// frontend/src/stores/useCurrencyStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CoinGeckoCurrencyRateProvider } from '@/infrastructure/pricing/CoinGeckoCurrencyRateProvider'
import { CurrencyCode } from '@/domain/pricing/entities/Currency'
import type { Currency } from '@/domain/pricing/entities/Currency'
import { usePriceChangeTracking } from '@/composables/usePriceChangeTracking'

export const useCurrencyStore = defineStore('currency', () => {
  // Single rate provider instance
  const rateProvider = new CoinGeckoCurrencyRateProvider()
  
  // State
  const rates = ref<Map<CurrencyCode, Currency>>(new Map())
  const lastUpdated = ref<Date | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Price change tracking per currency
  const priceTrackers = ref<Map<CurrencyCode, ReturnType<typeof usePriceChangeTracking>>>(new Map())
  
  let updateInterval: number | null = null
  
  // Getters
  const getRate = (code: CurrencyCode) => {
    return rates.value.get(code)
  }
  
  const getRateValue = (code: CurrencyCode) => {
    return rates.value.get(code)?.rateToBRL ?? null
  }
  
  const getPriceTracker = (code: CurrencyCode) => {
    if (!priceTrackers.value.has(code)) {
      priceTrackers.value.set(code, usePriceChangeTracking())
    }
    return priceTrackers.value.get(code)!
  }
  
  // Actions
  const fetchRates = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const currencies = await rateProvider.fetchRates()
      
      // Update rates map
      currencies.forEach(currency => {
        rates.value.set(currency.code, currency)
        
        // Update price tracker
        const tracker = getPriceTracker(currency.code)
        tracker.updateValue(currency.rateToBRL)
      })
      
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rates'
    } finally {
      isLoading.value = false
    }
  }
  
  const startAutoUpdate = (intervalMs = 5000) => {
    fetchRates() // Initial fetch
    updateInterval = window.setInterval(fetchRates, intervalMs)
  }
  
  const stopAutoUpdate = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
  
  const formatRate = (code: CurrencyCode) => {
    const rate = getRateValue(code)
    if (rate === null) return 'R$ --,--'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate)
  }
  
  return {
    // State
    rates,
    lastUpdated,
    isLoading,
    error,
    
    // Getters
    getRate,
    getRateValue,
    getPriceTracker,
    
    // Actions
    fetchRates,
    startAutoUpdate,
    stopAutoUpdate,
    formatRate,
  }
})
```

---

## Migration Path

### Step 1: Create Currency Store
1. Create `useCurrencyStore.ts`
2. Move rate fetching logic from `useCurrencyInfo`
3. Add price change tracking integration

### Step 2: Update Components
1. Replace `useCurrencyInfo()` with `useCurrencyStore()`
2. Update `CurrencyInfoPanel` to use store
3. Test all currency-related features

### Step 3: Create Pricing Store
1. Create `usePricingStore.ts`
2. Inject `useCurrencyStore` for rates
3. Move pricing calculations from `useAccountSetupCost`

### Step 4: Update Pricing Components
1. Replace `useAccountSetupCost()` with `usePricingStore()`
2. Update `AccountSetupCost` component
3. Test pricing calculations

### Step 5: Cleanup
1. Remove or deprecate old composables
2. Update documentation
3. Add tests for new stores

---

## Expected Benefits

### Performance
- **50% reduction** in API calls (shared state)
- **Faster renders** (cached calculations)
- **Better UX** (instant updates across components)

### Maintainability
- **Single source of truth** for domain state
- **Easier debugging** (centralized state)
- **Better testability** (isolated stores)

### Scalability
- **Easy to add features** (extend stores)
- **Consistent patterns** (all domain state in stores)
- **Better code organization** (clear separation)
