# Price Change Tracking - DDD/SOLID Architecture

## Overview

The price change tracking feature follows **Domain-Driven Design (DDD)** and **SOLID** principles with proper separation of concerns.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│  - AccountSetupCost.vue (UI Component)                  │
│  - useAccountSetupCost.ts (Composable)                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  - AccountSetupPriceService.ts                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│  Entities:                                              │
│  - Currency.ts                                          │
│  - AccountSetupPrice.ts                                 │
│  - PriceChange.ts (NEW)                                 │
│                                                         │
│  Domain Services:                                       │
│  - PriceTracker.ts (NEW)                                │
│                                                         │
│  Interfaces:                                            │
│  - ICurrencyRateProvider.ts                             │
└─────────────────────────────────────────────────────────┘
                 ▲
                 │
┌─────────────────────────────────────────────────────────┐
│                Infrastructure Layer                      │
│  - CoinGeckoCurrencyRateProvider.ts                     │
└─────────────────────────────────────────────────────────┘
```

---

## New Domain Components

### 1. PriceChange Entity

**Location**: `frontend/src/domain/pricing/entities/PriceChange.ts`

**Responsibility**: Represents the change between two prices

**Key Features:**
- Immutable entity with readonly properties
- Encapsulates price change calculation logic
- Validates input (non-negative prices, non-zero previous)
- Defines minimum change threshold (1 cent)
- Provides formatting methods

**Methods:**
```typescript
static calculate(currentPrice: number, previousPrice: number): PriceChange
hasSignificantChange(): boolean
formatPercentage(decimals: number = 2): string
```

**Properties:**
```typescript
direction: PriceDirection (UP, DOWN, NEUTRAL)
percentageChange: number
absoluteChange: number
```

---

### 2. PriceTracker Domain Service

**Location**: `frontend/src/domain/pricing/services/PriceTracker.ts`

**Responsibility**: Tracks price history and calculates changes

**Key Features:**
- Maintains state (previous price, last change)
- Orchestrates PriceChange entity
- Provides reset and initialization checks
- Persists last change until next update

**Methods:**
```typescript
update(currentPrice: number): PriceChange | null
getLastChange(): PriceChange | null
reset(): void
isInitialized(): boolean
```

---

## SOLID Principles Applied

### 1. Single Responsibility Principle (SRP) ✅

Each class has ONE responsibility:

- **PriceChange**: Represents and calculates price change
- **PriceTracker**: Tracks price history
- **useAccountSetupCost**: Manages UI state and updates
- **AccountSetupCost.vue**: Displays price information

### 2. Open/Closed Principle (OCP) ✅

- **PriceChange** can be extended with new calculation methods without modifying existing code
- **PriceTracker** can be extended with new tracking strategies

### 3. Liskov Substitution Principle (LSP) ✅

- **PriceChange** is a value object that can be substituted anywhere
- **PriceTracker** follows consistent interface

### 4. Interface Segregation Principle (ISP) ✅

- **PriceChange** provides focused methods (calculate, format, check)
- **PriceTracker** provides minimal interface (update, get, reset)

### 5. Dependency Inversion Principle (DIP) ✅

- **useAccountSetupCost** depends on domain services, not implementation details
- **PriceTracker** depends on PriceChange entity abstraction

---

## Separation of Concerns

### Domain Layer (Business Logic)

**PriceChange Entity:**
- ✅ Validates prices
- ✅ Calculates percentage change
- ✅ Determines direction (up/down/neutral)
- ✅ Defines threshold (1 cent)
- ✅ Formats output

**PriceTracker Service:**
- ✅ Maintains price history
- ✅ Orchestrates change calculation
- ✅ Persists last change
- ✅ Provides state management

### Presentation Layer (UI Logic)

**useAccountSetupCost Composable:**
- ✅ Creates domain services
- ✅ Manages Vue reactivity
- ✅ Handles auto-refresh
- ✅ Provides formatted data to UI

**AccountSetupCost Component:**
- ✅ Displays price information
- ✅ Shows change indicator
- ✅ Handles user interactions
- ✅ No business logic

---

## Benefits of This Architecture

### 1. Testability

Each layer can be tested independently:

```typescript
// Test PriceChange entity
describe('PriceChange', () => {
  it('should calculate percentage change correctly', () => {
    const change = PriceChange.calculate(105, 100)
    expect(change.percentageChange).toBe(5)
    expect(change.direction).toBe(PriceDirection.UP)
  })
  
  it('should throw error for negative prices', () => {
    expect(() => PriceChange.calculate(-1, 100))
      .toThrow('Prices must be non-negative')
  })
})

// Test PriceTracker service
describe('PriceTracker', () => {
  it('should return null on first update', () => {
    const tracker = new PriceTracker()
    const change = tracker.update(100)
    expect(change).toBeNull()
  })
  
  it('should calculate change on second update', () => {
    const tracker = new PriceTracker()
    tracker.update(100)
    const change = tracker.update(105)
    expect(change?.direction).toBe(PriceDirection.UP)
  })
  
  it('should persist last change', () => {
    const tracker = new PriceTracker()
    tracker.update(100)
    tracker.update(105)
    expect(tracker.getLastChange()).not.toBeNull()
  })
})
```

### 2. Maintainability

- Clear separation of concerns
- Each class has single responsibility
- Easy to locate and fix bugs
- Changes are isolated to specific layers

### 3. Extensibility

Add new features without changing existing code:

```typescript
// Add new calculation method to PriceChange
class PriceChange {
  calculateVolatility(): number {
    // New feature
  }
}

// Add new tracking strategy to PriceTracker
class PriceTracker {
  trackMovingAverage(window: number): number {
    // New feature
  }
}
```

### 4. Reusability

Domain entities can be reused across features:

- **PriceChange** can be used for any price comparison
- **PriceTracker** can track any numeric value over time
- Both are independent of UI framework

---

## File Structure

```
frontend/src/
├── domain/
│   └── pricing/
│       ├── entities/
│       │   ├── Currency.ts
│       │   ├── AccountSetupPrice.ts
│       │   └── PriceChange.ts              # NEW
│       ├── services/
│       │   └── PriceTracker.ts             # NEW
│       └── interfaces/
│           └── ICurrencyRateProvider.ts
│
├── infrastructure/
│   └── pricing/
│       └── CoinGeckoCurrencyRateProvider.ts
│
├── application/
│   └── pricing/
│       └── AccountSetupPriceService.ts
│
├── composables/
│   └── useAccountSetupCost.ts              # UPDATED
│
└── components/
    └── AccountSetupCost.vue                # UPDATED
```

---

## Design Patterns Used

### 1. Value Object Pattern
**PriceChange** is an immutable value object

### 2. Domain Service Pattern
**PriceTracker** is a stateful domain service

### 3. Factory Pattern
**PriceChange.calculate()** is a static factory method

### 4. Strategy Pattern
Different price tracking strategies can be implemented

---

## Comparison: Before vs After

### Before (Mixed Concerns)
```typescript
// Composable had business logic
const updateCost = async () => {
  // ... fetch price ...
  
  // Business logic in presentation layer ❌
  const absoluteChange = current - previous
  const percentageChange = (absoluteChange / previous) * 100
  
  let direction = 'neutral'
  if (absoluteChange > 0.01) {
    direction = 'up'
  }
  // ...
}
```

**Problems:**
- ❌ Business logic in presentation layer
- ❌ Hard to test
- ❌ Not reusable
- ❌ Violates SRP

### After (Proper Separation)
```typescript
// Domain Entity
class PriceChange {
  static calculate(current, previous) {
    // Business logic in domain layer ✅
  }
}

// Domain Service
class PriceTracker {
  update(price) {
    return PriceChange.calculate(price, this.previousPrice)
  }
}

// Composable (Presentation)
const updateCost = async () => {
  const newPrice = await priceService.getCurrentPrice()
  priceTracker.update(newPrice.priceBRL) // Delegate to domain ✅
}
```

**Benefits:**
- ✅ Business logic in domain layer
- ✅ Easy to test
- ✅ Reusable across features
- ✅ Follows SRP

---

## Usage Example

```typescript
// In composable
const priceTracker = new PriceTracker()

// First update
priceTracker.update(522.68) // Returns null (no previous price)

// Second update
const change = priceTracker.update(524.15)
// Returns: PriceChange {
//   direction: PriceDirection.UP,
//   percentageChange: 0.28,
//   absoluteChange: 1.47
// }

// Get last change (persists)
const lastChange = priceTracker.getLastChange()
console.log(lastChange.formatPercentage()) // "0.28"
console.log(lastChange.hasSignificantChange()) // true
```

---

## Current Implementation Status

✅ **DDD/SOLID Principles**: Fully implemented and verified
✅ **Separation of Concerns**: Domain, Application, Infrastructure, and Presentation layers properly separated
✅ **Price Change Tracking**: Compares consecutive prices (not baseline)
✅ **Change Persistence**: Last change persists until next update
✅ **Update Interval**: 5 seconds (configurable)

### Timing Behavior

1. **T=0s**: Initial price fetch, no change indicator (no previous price)
2. **T=5s**: Second price fetch, first change indicator appears
3. **T=10s+**: Subsequent updates show change from previous price

This is the correct behavior - the first update establishes a baseline, and changes are calculated from the second update onwards.

## Conclusion

The price change tracking feature follows proper DDD/SOLID principles:

1. **Domain Logic**: Isolated in PriceChange entity and PriceTracker service
2. **Testability**: Each component can be tested independently
3. **Reusability**: Domain components can be used across features
4. **Maintainability**: Clear separation of concerns
5. **Extensibility**: Easy to add new features without modifying existing code

The architecture is enterprise-grade and production-ready! 🚀
