# Account Setup Cost - Architecture Visual Guide

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
│                         (Vue Framework)                              │
│                                                                      │
│  ┌──────────────────────────┐    ┌──────────────────────────────┐  │
│  │  AccountSetupCost.vue    │    │  useAccountSetupCost.ts      │  │
│  │  ─────────────────────   │    │  ────────────────────────    │  │
│  │  • Display price         │◄───┤  • Manage Vue state          │  │
│  │  • Show change indicator │    │  • Handle lifecycle          │  │
│  │  • Render tooltip        │    │  • Auto-refresh (5s)         │  │
│  │  • Responsive design     │    │  • Dependency injection      │  │
│  └──────────────────────────┘    └──────────────────────────────┘  │
│                                            │                         │
└────────────────────────────────────────────┼─────────────────────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                              │
│                      (Use Case Orchestration)                        │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         AccountSetupPriceService.ts                          │  │
│  │         ───────────────────────────────                      │  │
│  │  • Fetch rates from provider                                 │  │
│  │  • Calculate price using domain logic                        │  │
│  │  • Format result for presentation                            │  │
│  │  • Handle errors gracefully                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                                 │
│                      (Business Logic)                                │
│                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │   Currency.ts       │  │ AccountSetupPrice.ts│                  │
│  │   ─────────────     │  │ ────────────────────│                  │
│  │   • Code (USD/BTC)  │  │ • Calculate fees    │                  │
│  │   • Rate to BRL     │  │ • Select best rate  │                  │
│  │   • Convert amount  │  │ • Apply 1% spread   │                  │
│  │   • Validate rate   │  │ • Apply 3.5% IOF    │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐                  │
│  │   PriceChange.ts    │  │  PriceTracker.ts    │                  │
│  │   ────────────────  │  │  ───────────────    │                  │
│  │   • Direction       │  │  • Track history    │                  │
│  │   • Percentage      │  │  • Calculate change │                  │
│  │   • Calculate       │  │  • Persist state    │                  │
│  │   • Format          │  │  • Reset tracker    │                  │
│  └─────────────────────┘  └─────────────────────┘                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         ICurrencyRateProvider.ts (Interface)                 │  │
│  │         ────────────────────────────────────                 │  │
│  │         • fetchRates(): Promise<Currency[]>                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ▲                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               │ implements
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                       INFRASTRUCTURE LAYER                           │
│                      (External Services)                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │      CoinGeckoCurrencyRateProvider.ts                        │  │
│  │      ─────────────────────────────────────                   │  │
│  │  • HTTP requests to CoinGecko API                            │  │
│  │  • Parse API responses                                       │  │
│  │  • Provide fallback rates                                    │  │
│  │  • Handle API errors                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌─────────────┐
│   User      │
│   Loads     │
│   Page      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  1. useAccountSetupCost (Composable)                        │
│     • Creates services (Dependency Injection)               │
│     • Starts auto-refresh timer (5 seconds)                 │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. AccountSetupPriceService.getCurrentPrice()              │
│     • Orchestrates the pricing flow                         │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. CoinGeckoCurrencyRateProvider.fetchRates()              │
│     • Fetches USD, BTC, ETH rates from API                  │
│     • Returns Currency[] entities                           │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. AccountSetupPrice.calculateFromCurrencies()             │
│     • Converts $100 USD, 0.00153 BTC, 0.521 ETH to BRL      │
│     • Selects most favorable rate                           │
│     • Applies 1% spread                                     │
│     • Applies 3.5% IOF                                      │
│     • Rounds up to 2 decimals                               │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. PriceTracker.update()                                   │
│     • Compares with previous price                          │
│     • Calculates percentage change                          │
│     • Determines direction (up/down/neutral)                │
│     • Persists change until next update                     │
└──────┬──────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  6. AccountSetupCost.vue (Component)                        │
│     • Displays formatted price (R$ 522,68)                  │
│     • Shows change indicator (↗ 0.28%)                      │
│     • Renders info tooltip                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Price Change Tracking Flow

```
┌─────────────────────────────────────────────────────────────┐
│  T = 0 seconds (Page Load)                                  │
├─────────────────────────────────────────────────────────────┤
│  1. Fetch price from API                                    │
│     → Price: R$ 522,68                                      │
│                                                             │
│  2. PriceTracker.update(522.68)                             │
│     → previousPrice = null                                  │
│     → return null (no previous price)                       │
│                                                             │
│  3. Display:                                                │
│     ┌─────────────────────────────────────────┐            │
│     │ Account Setup Cost: R$ 522,68           │            │
│     │ (no change indicator)                   │            │
│     └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 5 seconds (First Update)                               │
├─────────────────────────────────────────────────────────────┤
│  1. Fetch price from API                                    │
│     → Price: R$ 524,15                                      │
│                                                             │
│  2. PriceTracker.update(524.15)                             │
│     → previousPrice = 522.68                                │
│     → calculate: 524.15 vs 522.68                           │
│     → change = +1.47 BRL (+0.28%)                           │
│     → direction = UP                                        │
│     → return PriceChange(UP, 0.28, 1.47)                    │
│                                                             │
│  3. Display:                                                │
│     ┌─────────────────────────────────────────┐            │
│     │ Account Setup Cost: R$ 524,15           │            │
│     │ ↗ 0.28%                                 │            │
│     └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 10 seconds (Second Update)                             │
├─────────────────────────────────────────────────────────────┤
│  1. Fetch price from API                                    │
│     → Price: R$ 523,50                                      │
│                                                             │
│  2. PriceTracker.update(523.50)                             │
│     → previousPrice = 524.15 (from last update)             │
│     → calculate: 523.50 vs 524.15 (consecutive!)            │
│     → change = -0.65 BRL (-0.12%)                           │
│     → direction = DOWN                                      │
│     → return PriceChange(DOWN, 0.12, 0.65)                  │
│                                                             │
│  3. Display:                                                │
│     ┌─────────────────────────────────────────┐            │
│     │ Account Setup Cost: R$ 523,50           │            │
│     │ ↘ 0.12%                                 │            │
│     └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  T = 15 seconds (Third Update)                              │
├─────────────────────────────────────────────────────────────┤
│  1. Fetch price from API                                    │
│     → Price: R$ 525,00                                      │
│                                                             │
│  2. PriceTracker.update(525.00)                             │
│     → previousPrice = 523.50 (from last update)             │
│     → calculate: 525.00 vs 523.50 (consecutive!)            │
│     → change = +1.50 BRL (+0.29%)                           │
│     → direction = UP                                        │
│     → return PriceChange(UP, 0.29, 1.50)                    │
│                                                             │
│  3. Display:                                                │
│     ┌─────────────────────────────────────────┐            │
│     │ Account Setup Cost: R$ 525,00           │            │
│     │ ↗ 0.29%                                 │            │
│     └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## SOLID Principles Applied

```
┌─────────────────────────────────────────────────────────────┐
│  S - Single Responsibility Principle                        │
├─────────────────────────────────────────────────────────────┤
│  ✅ Currency: Represents currency with exchange rate        │
│  ✅ AccountSetupPrice: Calculates pricing with fees         │
│  ✅ PriceChange: Represents price change                    │
│  ✅ PriceTracker: Tracks price history                      │
│  ✅ CoinGeckoCurrencyRateProvider: Fetches rates from API   │
│  ✅ AccountSetupPriceService: Orchestrates pricing flow     │
│  ✅ useAccountSetupCost: Manages UI state                   │
│  ✅ AccountSetupCost.vue: Displays price information        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  O - Open/Closed Principle                                  │
├─────────────────────────────────────────────────────────────┤
│  ✅ Can add new rate providers without modifying code       │
│     • CoinGeckoCurrencyRateProvider                         │
│     • AlphaVantageProvider (future)                         │
│     • YahooFinanceProvider (future)                         │
│                                                             │
│  ✅ Can extend fee structures without modifying code        │
│     • AccountSetupPrice (base)                              │
│     • CustomAccountSetupPrice (extended)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  L - Liskov Substitution Principle                          │
├─────────────────────────────────────────────────────────────┤
│  ✅ Any ICurrencyRateProvider implementation works          │
│                                                             │
│     const provider1 = new CoinGeckoCurrencyRateProvider()   │
│     const provider2 = new AlphaVantageProvider()            │
│                                                             │
│     // Both work identically                                │
│     const service1 = new AccountSetupPriceService(provider1)│
│     const service2 = new AccountSetupPriceService(provider2)│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  I - Interface Segregation Principle                        │
├─────────────────────────────────────────────────────────────┤
│  ✅ ICurrencyRateProvider: Single method (fetchRates)       │
│  ✅ PriceChange: Focused methods (calculate, format, check) │
│  ✅ PriceTracker: Minimal interface (update, get, reset)    │
│                                                             │
│  No client is forced to depend on methods it doesn't use    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  D - Dependency Inversion Principle                         │
├─────────────────────────────────────────────────────────────┤
│  ✅ AccountSetupPriceService depends on interface           │
│                                                             │
│     class AccountSetupPriceService {                        │
│       constructor(                                          │
│         private readonly currencyRateProvider:              │
│           ICurrencyRateProvider  ← Interface (abstraction)  │
│       ) {}                                                  │
│     }                                                       │
│                                                             │
│  ✅ High-level modules depend on abstractions               │
│  ✅ Low-level modules implement abstractions                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    OnboardingForm.vue                        │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Company Info Section                                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Cryptocurrency Selector                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Contact Info Section                                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Address Section                                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Password Section                                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Account Setup Cost Component                   │ │ │
│  │  │  ─────────────────────────────────              │ │ │
│  │  │  Account Setup Cost: R$ 524,15  ↗ 0.28%  ⓘ    │ │ │
│  │  │                                                 │ │ │
│  │  │  • Updates every 5 seconds                      │ │ │
│  │  │  • Shows price change indicator                 │ │ │
│  │  │  • Info tooltip on hover                        │ │ │
│  │  │  • Responsive design                            │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  [Create Account] Button                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
frontend/src/
│
├── domain/
│   └── pricing/
│       ├── entities/
│       │   ├── Currency.ts              ← Domain Entity
│       │   ├── AccountSetupPrice.ts     ← Domain Entity
│       │   └── PriceChange.ts           ← Domain Entity
│       │
│       ├── services/
│       │   └── PriceTracker.ts          ← Domain Service
│       │
│       └── interfaces/
│           └── ICurrencyRateProvider.ts ← Domain Interface
│
├── infrastructure/
│   └── pricing/
│       └── CoinGeckoCurrencyRateProvider.ts ← Infrastructure
│
├── application/
│   └── pricing/
│       └── AccountSetupPriceService.ts  ← Application Service
│
├── composables/
│   └── useAccountSetupCost.ts           ← Presentation Logic
│
└── components/
    ├── AccountSetupCost.vue             ← UI Component
    └── Form/
        └── OnboardingForm.vue           ← Form Integration
```

---

## Summary

✅ **Clean Architecture**: Proper layer separation  
✅ **DDD**: Rich domain model with entities and services  
✅ **SOLID**: All five principles correctly applied  
✅ **Testable**: Each layer independently testable  
✅ **Maintainable**: Clear separation of concerns  
✅ **Extensible**: Easy to add new features  

**Status**: Production Ready 🚀
