# DDD/SOLID Scroll Management Refactoring

## Overview
Complete refactoring of scroll management following Domain-Driven Design and SOLID principles. The solution provides proper layer separation, dependency inversion, and testability.

## Architecture Layers

### 1. Domain Layer (Core Business Logic)
**File**: `frontend/src/domain/scroll/interfaces/IScrollService.ts`

Defines the contract for scroll operations - pure interfaces with no implementation details.

```typescript
export interface ScrollPosition {
  x: number
  y: number
}

export interface ScrollToOptions {
  top?: number
  left?: number
  behavior?: ScrollBehavior
}

export interface IScrollService {
  scrollTo(options: ScrollToOptions): void
  getPosition(): ScrollPosition
  isScrolled(): boolean
}
```

**Why this matters**:
- ✅ **Dependency Inversion**: High-level modules depend on abstractions
- ✅ **Technology Agnostic**: No browser-specific code
- ✅ **Testable**: Easy to mock for testing
- ✅ **Flexible**: Can swap implementations without changing business logic

### 2. Infrastructure Layer (Technical Implementation)
**File**: `frontend/src/infrastructure/scroll/BrowserScrollService.ts`

Concrete implementation using browser APIs.

```typescript
export class BrowserScrollService implements IScrollService {
  scrollTo(options: ScrollToOptions): void {
    window.scrollTo({
      top: options.top ?? 0,
      left: options.left ?? 0,
      behavior: options.behavior ?? 'smooth',
    })
  }

  getPosition(): ScrollPosition {
    return {
      x: window.scrollX,
      y: window.scrollY,
    }
  }

  isScrolled(): boolean {
    return window.scrollY > 0
  }
}

export const browserScrollService = new BrowserScrollService()
```

**Why this matters**:
- ✅ **Single Responsibility**: Only handles browser scroll operations
- ✅ **Encapsulation**: Hides browser API details
- ✅ **Singleton Pattern**: Single instance across app
- ✅ **Swappable**: Can create different implementations (e.g., MockScrollService for tests)

### 3. Application Layer (Use Cases)
**File**: `frontend/src/application/scroll/scrollUseCases.ts`

Business logic and orchestration of scroll operations.

```typescript
export function scrollToTop(
  scrollService: IScrollService,
  options: ScrollToOptions = {}
): void {
  scrollService.scrollTo({
    top: 0,
    left: 0,
    ...options,
  })
}

export function scrollToPosition(
  scrollService: IScrollService,
  top: number,
  left: number = 0,
  behavior: ScrollBehavior = 'smooth'
): void {
  scrollService.scrollTo({ top, left, behavior })
}

export function checkIfScrolled(scrollService: IScrollService): boolean {
  return scrollService.isScrolled()
}

export function getCurrentScrollPosition(scrollService: IScrollService) {
  return scrollService.getPosition()
}
```

**Why this matters**:
- ✅ **Pure Functions**: No side effects, easy to test
- ✅ **Dependency Injection**: Services passed as parameters
- ✅ **Business Logic**: Encapsulates scroll-related business rules
- ✅ **Reusable**: Can be used from anywhere in the app

### 4. Presentation Layer (Vue Composable)
**File**: `frontend/src/composables/useScrollToTop.ts`

Vue-specific wrapper that provides reactive scroll utilities.

```typescript
export function useScrollToTop(
  scrollService: IScrollService = browserScrollService
) {
  const scrollToTop = (options: ScrollToOptions = {}) => {
    scrollToTopUseCase(scrollService, options)
  }

  const scrollToElement = (element, options) => {
    // DOM query logic
    scrollToPosition(scrollService, top, left, behavior)
  }

  const isScrolled = () => checkIfScrolled(scrollService)
  const getScrollPosition = () => getCurrentScrollPosition(scrollService)

  return {
    scrollToTop,
    scrollToElement,
    isScrolled,
    getScrollPosition,
  }
}
```

**Why this matters**:
- ✅ **Framework Adapter**: Adapts use cases to Vue
- ✅ **Default Injection**: Provides default service but allows override
- ✅ **Testable**: Can inject mock service for testing
- ✅ **Clean API**: Simple interface for components

## SOLID Principles Applied

### 1. Single Responsibility Principle (SRP)
Each class/function has one reason to change:

- **IScrollService**: Defines scroll contract
- **BrowserScrollService**: Implements browser scrolling
- **scrollUseCases**: Contains business logic
- **useScrollToTop**: Adapts to Vue framework
- **Router**: Handles navigation and scroll behavior

### 2. Open/Closed Principle (OCP)
Open for extension, closed for modification:

```typescript
// Easy to add new implementations without changing existing code
class SmoothScrollService implements IScrollService {
  scrollTo(options: ScrollToOptions): void {
    // Custom smooth scroll implementation
  }
  // ...
}

// Easy to add new use cases
export function scrollToBottom(scrollService: IScrollService) {
  const position = scrollService.getPosition()
  scrollService.scrollTo({ top: document.body.scrollHeight })
}
```

### 3. Liskov Substitution Principle (LSP)
Any IScrollService implementation can be substituted:

```typescript
// Production
const service = new BrowserScrollService()

// Testing
const service = new MockScrollService()

// Custom implementation
const service = new AnimatedScrollService()

// All work the same way
scrollToTop(service)
```

### 4. Interface Segregation Principle (ISP)
Clean, focused interface with only necessary methods:

```typescript
// Clients only depend on what they need
interface IScrollService {
  scrollTo(options: ScrollToOptions): void  // Core functionality
  getPosition(): ScrollPosition              // Query state
  isScrolled(): boolean                      // Simple check
}

// No forced dependencies on unused methods
```

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

```typescript
// ❌ Before: Direct dependency on window
function scrollToTop() {
  window.scrollTo({ top: 0 })
}

// ✅ After: Depends on abstraction
function scrollToTop(scrollService: IScrollService) {
  scrollService.scrollTo({ top: 0 })
}
```

## Dependency Flow

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Vue Components & Composables)         │
│  - useScrollToTop composable            │
│  - PartnerRegistrationView              │
└─────────────────┬───────────────────────┘
                  │ depends on
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Use Cases - Business Logic)           │
│  - scrollToTop()                        │
│  - scrollToPosition()                   │
└─────────────────┬───────────────────────┘
                  │ depends on
                  ↓
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│  (Interfaces - Contracts)               │
│  - IScrollService interface             │
└─────────────────┬───────────────────────┘
                  │ implemented by
                  ↓
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  (Technical Implementation)             │
│  - BrowserScrollService                 │
└─────────────────────────────────────────┘
```

## Testing Benefits

### Easy to Mock
```typescript
// Mock implementation for testing
class MockScrollService implements IScrollService {
  scrollCalls: ScrollToOptions[] = []
  
  scrollTo(options: ScrollToOptions): void {
    this.scrollCalls.push(options)
  }
  
  getPosition(): ScrollPosition {
    return { x: 0, y: 0 }
  }
  
  isScrolled(): boolean {
    return false
  }
}

// Test use case
describe('scrollToTop', () => {
  it('should scroll to top', () => {
    const mockService = new MockScrollService()
    
    scrollToTop(mockService)
    
    expect(mockService.scrollCalls).toEqual([
      { top: 0, left: 0 }
    ])
  })
})
```

### Test Without Browser
```typescript
// No need for jsdom or browser environment
describe('scrollUseCases', () => {
  it('should call service with correct options', () => {
    const mockService = new MockScrollService()
    
    scrollToPosition(mockService, 100, 0, 'smooth')
    
    expect(mockService.scrollCalls[0]).toEqual({
      top: 100,
      left: 0,
      behavior: 'smooth'
    })
  })
})
```

## Extensibility Examples

### Custom Scroll Implementation
```typescript
// Animated scroll with easing
class AnimatedScrollService implements IScrollService {
  scrollTo(options: ScrollToOptions): void {
    // Custom animation logic
    this.animateScroll(options.top ?? 0)
  }
  
  private animateScroll(target: number) {
    // Easing function implementation
  }
  
  // ... other methods
}
```

### Scroll with Analytics
```typescript
class AnalyticsScrollService implements IScrollService {
  constructor(
    private baseService: IScrollService,
    private analytics: IAnalytics
  ) {}
  
  scrollTo(options: ScrollToOptions): void {
    this.analytics.track('scroll', options)
    this.baseService.scrollTo(options)
  }
  
  // ... delegate other methods
}
```

### Scroll with Debouncing
```typescript
class DebouncedScrollService implements IScrollService {
  private debounceTimer: number | null = null
  
  constructor(
    private baseService: IScrollService,
    private delay: number = 100
  ) {}
  
  scrollTo(options: ScrollToOptions): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    this.debounceTimer = setTimeout(() => {
      this.baseService.scrollTo(options)
    }, this.delay)
  }
  
  // ... other methods
}
```

## Usage Examples

### In Components
```typescript
// Default usage
const { scrollToTop } = useScrollToTop()
scrollToTop()

// With custom service (for testing)
const mockService = new MockScrollService()
const { scrollToTop } = useScrollToTop(mockService)
scrollToTop()
```

### In Router
```typescript
import { browserScrollService } from '@/infrastructure/scroll/BrowserScrollService'

scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    browserScrollService.scrollTo({
      ...savedPosition,
      behavior: 'smooth',
    })
    return savedPosition
  }
  
  browserScrollService.scrollTo({ top: 0, behavior: 'smooth' })
  return { top: 0 }
}
```

### Direct Use Case Call
```typescript
import { scrollToTop } from '@/application/scroll/scrollUseCases'
import { browserScrollService } from '@/infrastructure/scroll/BrowserScrollService'

// In any TypeScript file
scrollToTop(browserScrollService, { behavior: 'auto' })
```

## Files Structure

```
frontend/src/
├── domain/
│   └── scroll/
│       └── interfaces/
│           └── IScrollService.ts          # Interface definition
├── infrastructure/
│   └── scroll/
│       └── BrowserScrollService.ts        # Browser implementation
├── application/
│   └── scroll/
│       └── scrollUseCases.ts              # Business logic
├── composables/
│   └── useScrollToTop.ts                  # Vue adapter
└── router/
    └── index.ts                           # Uses scroll service
```

## Comparison: Before vs After

### Before (Violations)
```typescript
// ❌ Direct window dependency
// ❌ Hard to test
// ❌ Tightly coupled
// ❌ No abstraction

export function useScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return { scrollToTop }
}
```

### After (SOLID)
```typescript
// ✅ Depends on abstraction
// ✅ Easy to test
// ✅ Loosely coupled
// ✅ Proper layers

export function useScrollToTop(
  scrollService: IScrollService = browserScrollService
) {
  const scrollToTop = (options = {}) => {
    scrollToTopUseCase(scrollService, options)
  }
  
  return { scrollToTop }
}
```

## Summary

This refactoring demonstrates:
- ✅ **DDD**: Clear layer separation (Domain, Application, Infrastructure, Presentation)
- ✅ **SOLID**: All 5 principles properly applied
- ✅ **Testability**: Easy to mock and test without browser
- ✅ **Maintainability**: Changes isolated to specific layers
- ✅ **Extensibility**: Easy to add new implementations
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Reusability**: Can be used anywhere in the app
- ✅ **Clean Architecture**: Dependencies point inward

The scroll management system is now a robust, maintainable, and extensible solution that serves as a model for other features in the application.
