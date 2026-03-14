# Pricing Feature - DDD/SOLID Architecture

## Overview

The pricing feature follows **Domain-Driven Design (DDD)** principles and **SOLID** principles for clean, maintainable, and testable code.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│  (Vue Components & Composables)                         │
│  - AccountSetupCost.vue                                 │
│  - useAccountSetupCost.ts                               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  (Use Cases & Services)                                 │
│  - AccountSetupPriceService.ts                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│  (Business Logic & Entities)                            │
│  - Currency.ts (Entity)                                 │
│  - AccountSetupPrice.ts (Entity)                        │
│  - ICurrencyRateProvider.ts (Interface)                 │
└─────────────────────────────────────────────────────────┘
                 ▲
                 │
┌─────────────────────────────────────────────────────────┐
│                Infrastructure Layer                      │
│  (External Services & APIs)                             │
│  - CoinGeckoCurrencyRateProvider.ts                     │
└─────────────────────────────────────────────────────────┘
```

---

## SOLID Principles Applied

### 1. Single Responsibility Principle (SRP)

Each class has ONE reason to change:

- **Currency**: Represents a currency and its exchange rate
- **AccountSetupPrice**: Calculates pricing with fees
- **CoinGeckoCurrencyRateProvider**: Fetches rates from CoinGecko API
- **AccountSetupPriceService**: Orchestrates the pricing flow
- **useAccountSetupCost**: Manages UI state and updates

### 2. Open/Closed Principle (OCP)

Classes are open for extension, closed for modification:

- **ICurrencyRateProvider** interface allows adding new providers (Alpha Vantage, Yahoo Finance) without modifying existing code
- **AccountSetupPrice** can be extended with new fee structures without changing core logic

### 3. Liskov Substitution Principle (LSP)

Any implementation of `ICurrencyRateProvider` can be substituted:

```typescript
// Can swap providers without breaking code
const provider = new CoinGeckoCurrencyRateProvider()
// OR
const provider = new AlphaVantageProvider()
// OR
const provider = new YahooFinanceProvider()

const service = new AccountSetupPriceService(provider)
```

### 4. Interface Segregation Principle (ISP)

Interfaces are focused and minimal:

- **ICurrencyRateProvider** has only one method: `fetchRates()`
- No client is forced to depend on methods it doesn't use

### 5. Dependency Inversion Principle (DIP)

High-level modules depend on abstractions, not concretions:

- **AccountSetupPriceService** depends on `ICurrencyRateProvider` interface, not concrete implementation
- Allows easy testing with mock providers
- Enables swapping providers at runtime

---

## Domain-Driven Design (DDD)

### Domain Layer

#### Entities

**Currency.ts**
```typescript
export class Currency {
  constructor(
    public readonly code: CurrencyCode,
    public readonly rateToBRL: number,
    public readonly lastUpdated: Date
  )
  
  convertToBRL(amount: number): number
}
```

- Encapsulates currency business logic
- Validates exchange rates (must be positive)
- Provides conversion method
- Immutable (readonly properties)

**AccountSetupPrice.ts**
```typescript
export class AccountSetupPrice {
  calculateFromCurrencies(currencies: Currency[]): {
    finalPriceBRL: number
    selectedCurrency: CurrencyCode
    breakdown: PriceBreakdown
  }
}
```

- Encapsulates pricing business rules
- Selects most favorable rate
- Applies spread and IOF fees
- Rounds up to 2 decimals
- Returns detailed breakdown

#### Value Objects

**CurrencyCode** (Enum)
```typescript
export enum CurrencyCode {
  USD = 'USD',
  BTC = 'BTC',
  ETH = 'ETH',
}
```

**FeeStructure** (Interface)
```typescript
export interface FeeStructure {
  spreadPercentage: number
  iofPercentage: number
}
```

#### Interfaces

**ICurrencyRateProvider.ts**
```typescript
export interface ICurrencyRateProvider {
  fetchRates(): Promise<Currency[]>
}
```

- Defines contract for rate providers
- Enables Dependency Inversion
- Allows multiple implementations

---

### Application Layer

**AccountSetupPriceService.ts**

- Orchestrates domain logic
- Coordinates between domain and infrastructure
- Provides application-specific operations
- Formats output for presentation layer

**Responsibilities:**
1. Fetch rates from provider
2. Calculate price using domain entity
3. Format result for UI
4. Handle errors gracefully

---

### Infrastructure Layer

**CoinGeckoCurrencyRateProvider.ts**

- Implements `ICurrencyRateProvider` interface
- Handles HTTP requests to CoinGecko API
- Parses API responses
- Provides fallback rates
- Manages API-specific details

**Key Features:**
- Error handling with fallbacks
- Response parsing and validation
- API URL and parameter management
- No business logic (pure infrastructure)

---

### Presentation Layer

**useAccountSetupCost.ts** (Composable)

- Manages UI state (loading, error, data)
- Handles auto-refresh (every 5 seconds)
- Lifecycle management (mount/unmount)
- Dependency injection (creates service with provider)

**AccountSetupCost.vue** (Component)

- Pure presentation logic
- Displays formatted data
- Handles loading and error states
- Responsive design
- No business logic

---

## Benefits of This Architecture

### 1. Testability

Each layer can be tested independently:

```typescript
// Test domain logic without API
const currency = new Currency(CurrencyCode.USD, 5.0)
const price = new AccountSetupPrice()
const result = price.calculateFromCurrencies([currency])

// Test service with mock provider
class MockProvider implements ICurrencyRateProvider {
  async fetchRates() {
    return [new Currency(CurrencyCode.USD, 5.0)]
  }
}
const service = new AccountSetupPriceService(new MockProvider())
```

### 2. Maintainability

- Clear separation of concerns
- Each class has single responsibility
- Easy to locate and fix bugs
- Changes are isolated to specific layers

### 3. Extensibility

Add new providers without changing existing code:

```typescript
// Add new provider
export class AlphaVantageProvider implements ICurrencyRateProvider {
  async fetchRates(): Promise<Currency[]> {
    // Alpha Vantage specific implementation
  }
}

// Use it
const provider = new AlphaVantageProvider()
const service = new AccountSetupPriceService(provider)
```

### 4. Flexibility

- Swap implementations at runtime
- Configure different fee structures
- Support multiple currencies easily
- Change APIs without affecting business logic

### 5. Reusability

Domain entities can be reused across features:

- `Currency` can be used for other currency conversions
- `AccountSetupPrice` logic is independent of UI
- `ICurrencyRateProvider` can serve multiple features

---

## File Structure

```
frontend/src/
├── domain/
│   └── pricing/
│       ├── entities/
│       │   ├── Currency.ts                    # Domain Entity
│       │   └── AccountSetupPrice.ts           # Domain Entity
│       └── interfaces/
│           └── ICurrencyRateProvider.ts       # Domain Interface
│
├── infrastructure/
│   └── pricing/
│       └── CoinGeckoCurrencyRateProvider.ts   # Infrastructure
│
├── application/
│   └── pricing/
│       └── AccountSetupPriceService.ts        # Application Service
│
├── composables/
│   └── useAccountSetupCost.ts                 # Presentation Logic
│
└── components/
    └── AccountSetupCost.vue                   # UI Component
```

---

## Design Patterns Used

### 1. Repository Pattern
`ICurrencyRateProvider` acts as a repository for currency rates

### 2. Service Pattern
`AccountSetupPriceService` orchestrates business operations

### 3. Dependency Injection
Services receive dependencies through constructor

### 4. Strategy Pattern
Different rate providers can be swapped (CoinGecko, Alpha Vantage, etc.)

### 5. Factory Pattern
Composable creates service instances with proper dependencies

---

## Testing Strategy

### Unit Tests

**Domain Layer:**
```typescript
describe('Currency', () => {
  it('should convert amount to BRL', () => {
    const currency = new Currency(CurrencyCode.USD, 5.0)
    expect(currency.convertToBRL(100)).toBe(500)
  })
  
  it('should throw error for negative rate', () => {
    expect(() => new Currency(CurrencyCode.USD, -1))
      .toThrow('Exchange rate must be positive')
  })
})

describe('AccountSetupPrice', () => {
  it('should select most favorable rate', () => {
    const currencies = [
      new Currency(CurrencyCode.USD, 5.0),   // 500 BRL
      new Currency(CurrencyCode.BTC, 350000), // 535.5 BRL
    ]
    const price = new AccountSetupPrice()
    const result = price.calculateFromCurrencies(currencies)
    expect(result.selectedCurrency).toBe(CurrencyCode.USD)
  })
  
  it('should apply spread and IOF correctly', () => {
    const currency = new Currency(CurrencyCode.USD, 5.0)
    const price = new AccountSetupPrice()
    const result = price.calculateFromCurrencies([currency])
    // 500 * 1.01 * 1.035 = 522.675 → 522.68
    expect(result.finalPriceBRL).toBe(522.68)
  })
})
```

**Infrastructure Layer:**
```typescript
describe('CoinGeckoCurrencyRateProvider', () => {
  it('should fetch rates from API', async () => {
    const provider = new CoinGeckoCurrencyRateProvider()
    const rates = await provider.fetchRates()
    expect(rates.length).toBeGreaterThan(0)
    expect(rates[0]).toBeInstanceOf(Currency)
  })
  
  it('should return fallback rates on error', async () => {
    // Mock fetch to throw error
    global.fetch = jest.fn(() => Promise.reject('API Error'))
    const provider = new CoinGeckoCurrencyRateProvider()
    const rates = await provider.fetchRates()
    expect(rates.length).toBe(3) // USD, BTC, ETH
  })
})
```

**Application Layer:**
```typescript
describe('AccountSetupPriceService', () => {
  it('should calculate current price', async () => {
    const mockProvider: ICurrencyRateProvider = {
      fetchRates: async () => [
        new Currency(CurrencyCode.USD, 5.0)
      ]
    }
    const service = new AccountSetupPriceService(mockProvider)
    const result = await service.getCurrentPrice()
    expect(result.priceBRL).toBe(522.68)
  })
})
```

---

## Comparison: Before vs After

### Before (Procedural)
```typescript
// services/cryptoPriceService.ts
export async function fetchCryptoPrices() { ... }
export function calculateAccountSetupCost(prices) { ... }
export function formatBRL(value) { ... }
```

**Problems:**
- ❌ No separation of concerns
- ❌ Hard to test (tightly coupled to API)
- ❌ Can't swap providers
- ❌ Business logic mixed with infrastructure
- ❌ No domain model

### After (DDD/SOLID)
```typescript
// Domain
class Currency { ... }
class AccountSetupPrice { ... }
interface ICurrencyRateProvider { ... }

// Infrastructure
class CoinGeckoCurrencyRateProvider implements ICurrencyRateProvider { ... }

// Application
class AccountSetupPriceService { ... }
```

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Easy to test (dependency injection)
- ✅ Can swap providers easily
- ✅ Business logic isolated in domain
- ✅ Rich domain model

---

## Conclusion

This architecture provides:

1. **Clean Code**: Each class has a single, well-defined purpose
2. **Testability**: All layers can be tested independently
3. **Flexibility**: Easy to add new providers or change business rules
4. **Maintainability**: Changes are isolated and predictable
5. **Scalability**: Architecture supports growth and new features

The pricing feature is now production-ready with enterprise-grade architecture! 🚀
