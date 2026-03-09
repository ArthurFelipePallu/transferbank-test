# CNPJ Lookup Feature - Complete DDD/SOLID Implementation

## Overview
Implemented automatic CNPJ lookup using CNPJ.ws API following Domain-Driven Design and SOLID principles. When a user enters a valid CNPJ, the system automatically fetches company information and pre-fills the form.

## Architecture

### Layer Structure
```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  - OnboardingForm.vue (UI)              │
│  - useCnpjLookup (Composable)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Application Layer               │
│  - lookupCnpjUseCase.ts                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│  - ICnpjGateway (Interface)             │
│  - CompanyInfo (Entity)                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  - HttpCnpjGateway (Implementation)     │
└─────────────────────────────────────────┘
```

## 1. Domain Layer

### Entity: CompanyInfo
**File**: `frontend/src/domain/cnpj/entities/CompanyInfo.ts`

Represents company data in the domain model:

```typescript
export interface CompanyInfo {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  telefone?: string
  email?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
}
```

**Why this matters**:
- ✅ **Domain Model**: Represents business concept
- ✅ **Technology Agnostic**: No API-specific fields
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Clear Contract**: Defines what company info means

### Port: ICnpjGateway
**File**: `frontend/src/domain/cnpj/ports/ICnpjGateway.ts`

Defines the contract for CNPJ lookup:

```typescript
export interface ICnpjGateway {
  lookupByCnpj(cnpj: string): Promise<CompanyInfo | null>
}
```

**Why this matters**:
- ✅ **Dependency Inversion**: High-level code depends on abstraction
- ✅ **Testable**: Easy to mock
- ✅ **Flexible**: Can swap implementations
- ✅ **Clean Contract**: Single responsibility

## 2. Infrastructure Layer

### Implementation: HttpCnpjGateway
**File**: `frontend/src/infrastructure/cnpj/HttpCnpjGateway.ts`

Concrete implementation using CNPJ.ws API:

```typescript
export class HttpCnpjGateway implements ICnpjGateway {
  private readonly baseUrl = 'https://publica.cnpj.ws/cnpj'

  async lookupByCnpj(cnpj: string): Promise<CompanyInfo | null> {
    // Sanitize CNPJ
    const sanitizedCnpj = sanitizeCnpj(cnpj)
    
    // Validate
    if (sanitizedCnpj.length !== 14) {
      throw new Error('CNPJ must have 14 digits')
    }

    // Call API
    const response = await axios.get(`${this.baseUrl}/${sanitizedCnpj}`)
    
    // Map to domain model
    return this.mapToCompanyInfo(response.data)
  }

  private mapToCompanyInfo(data: CnpjApiResponse): CompanyInfo {
    // Transform API response to domain entity
  }
}
```

**Why this matters**:
- ✅ **Single Responsibility**: Only handles HTTP communication
- ✅ **Encapsulation**: Hides API details
- ✅ **Error Handling**: Proper error management
- ✅ **Data Mapping**: Transforms API response to domain model

## 3. Application Layer

### Use Case: lookupCompanyByCnpj
**File**: `frontend/src/application/cnpj/lookupCnpjUseCase.ts`

Business logic for CNPJ lookup:

```typescript
export async function lookupCompanyByCnpj(
  gateway: ICnpjGateway,
  cnpj: string
): Promise<CompanyInfo | null> {
  if (!cnpj || cnpj.trim().length === 0) {
    throw new Error('CNPJ is required')
  }

  return await gateway.lookupByCnpj(cnpj)
}
```

**Why this matters**:
- ✅ **Pure Function**: No side effects
- ✅ **Dependency Injection**: Gateway passed as parameter
- ✅ **Business Logic**: Validates input
- ✅ **Testable**: Easy to unit test

## 4. Presentation Layer

### Composable: useCnpjLookup
**File**: `frontend/src/composables/useCnpjLookup.ts`

Vue composable for reactive CNPJ lookup:

```typescript
export function useCnpjLookup(gateway: ICnpjGateway = httpCnpjGateway) {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const companyInfo = ref<CompanyInfo | null>(null)

  const lookup = async (cnpj: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await lookupCompanyByCnpj(gateway, cnpj)
      companyInfo.value = result
      return result
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, companyInfo, lookup, reset }
}
```

**Why this matters**:
- ✅ **Reactive**: Vue reactivity system
- ✅ **Dependency Injection**: Can inject mock gateway
- ✅ **State Management**: Handles loading and error states
- ✅ **Clean API**: Simple interface for components

### Integration: OnboardingForm
**File**: `frontend/src/components/Form/OnboardingForm.vue`

Automatic form filling on CNPJ entry:

```typescript
// Watch CNPJ field
watch(() => values.cnpj, async (newCnpj) => {
  const sanitized = sanitizeCnpj(newCnpj)
  
  // Only lookup if CNPJ has 14 digits and fields are empty
  if (sanitized.length === 14 && !values.companyName && !values.phone) {
    const companyInfo = await lookupCnpj(sanitized)
    
    if (companyInfo) {
      // Auto-fill form
      setFieldValue('companyName', companyInfo.razaoSocial)
      setFieldValue('phone', formatPhone(companyInfo.telefone))
      setFieldValue('email', companyInfo.email)
    }
  }
})
```

**Why this matters**:
- ✅ **User Experience**: Automatic form filling
- ✅ **Smart Logic**: Only fills empty fields
- ✅ **Non-Intrusive**: Doesn't override user input
- ✅ **Visual Feedback**: Loading indicator

## SOLID Principles Applied

### 1. Single Responsibility Principle (SRP)
Each class/function has one reason to change:

- **CompanyInfo**: Represents company data
- **ICnpjGateway**: Defines lookup contract
- **HttpCnpjGateway**: Handles HTTP communication
- **lookupCnpjUseCase**: Contains business logic
- **useCnpjLookup**: Manages Vue reactivity
- **OnboardingForm**: Handles UI and user interaction

### 2. Open/Closed Principle (OCP)
Easy to extend without modifying existing code:

```typescript
// Add caching without changing existing code
class CachedCnpjGateway implements ICnpjGateway {
  constructor(
    private baseGateway: ICnpjGateway,
    private cache: Map<string, CompanyInfo>
  ) {}

  async lookupByCnpj(cnpj: string): Promise<CompanyInfo | null> {
    if (this.cache.has(cnpj)) {
      return this.cache.get(cnpj)!
    }
    
    const result = await this.baseGateway.lookupByCnpj(cnpj)
    if (result) {
      this.cache.set(cnpj, result)
    }
    return result
  }
}
```

### 3. Liskov Substitution Principle (LSP)
Any ICnpjGateway implementation can be substituted:

```typescript
// Production
const gateway = new HttpCnpjGateway()

// Testing
const gateway = new MockCnpjGateway()

// With caching
const gateway = new CachedCnpjGateway(new HttpCnpjGateway(), cache)

// All work the same way
const info = await lookupCompanyByCnpj(gateway, cnpj)
```

### 4. Interface Segregation Principle (ISP)
Clean, focused interface:

```typescript
// Only one method - exactly what clients need
interface ICnpjGateway {
  lookupByCnpj(cnpj: string): Promise<CompanyInfo | null>
}
```

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:

```typescript
// ❌ Before: Direct dependency
async function lookup(cnpj: string) {
  const response = await axios.get(`https://api.com/${cnpj}`)
  return response.data
}

// ✅ After: Depends on abstraction
async function lookup(gateway: ICnpjGateway, cnpj: string) {
  return await gateway.lookupByCnpj(cnpj)
}
```

## User Experience Flow

```
User types CNPJ
       ↓
OnboardingForm watches CNPJ field
       ↓
CNPJ reaches 14 digits
       ↓
Check if form fields are empty
       ↓
Call useCnpjLookup.lookup()
       ↓
Show "Searching..." indicator
       ↓
lookupCnpjUseCase validates input
       ↓
HttpCnpjGateway calls CNPJ.ws API
       ↓
Map API response to CompanyInfo
       ↓
Auto-fill form fields:
  - Company Name (razaoSocial)
  - Phone (formatted)
  - Email
       ↓
Hide loading indicator
       ↓
User can edit or continue
```

## Testing Benefits

### Easy to Mock
```typescript
class MockCnpjGateway implements ICnpjGateway {
  async lookupByCnpj(cnpj: string): Promise<CompanyInfo | null> {
    if (cnpj === '12345678000190') {
      return {
        cnpj: '12345678000190',
        razaoSocial: 'Test Company LTDA',
        telefone: '5511999999999',
        email: 'test@company.com',
      }
    }
    return null
  }
}

// Test use case
describe('lookupCompanyByCnpj', () => {
  it('should return company info', async () => {
    const gateway = new MockCnpjGateway()
    
    const result = await lookupCompanyByCnpj(gateway, '12345678000190')
    
    expect(result?.razaoSocial).toBe('Test Company LTDA')
  })
})
```

### Test Without API
```typescript
describe('useCnpjLookup', () => {
  it('should handle loading state', async () => {
    const mockGateway = new MockCnpjGateway()
    const { isLoading, lookup } = useCnpjLookup(mockGateway)
    
    expect(isLoading.value).toBe(false)
    
    const promise = lookup('12345678000190')
    expect(isLoading.value).toBe(true)
    
    await promise
    expect(isLoading.value).toBe(false)
  })
})
```

## Error Handling

### Network Errors
```typescript
try {
  const info = await lookupCnpj(cnpj)
} catch (error) {
  // Handled by composable
  // error.value contains user-friendly message
}
```

### 404 Not Found
```typescript
// Returns null instead of throwing
const info = await lookupCnpj('00000000000000')
if (!info) {
  // CNPJ not found - don't fill form
}
```

### Invalid CNPJ
```typescript
// Throws error for invalid format
try {
  await lookupCnpj('123') // Too short
} catch (error) {
  // "CNPJ must have 14 digits"
}
```

## Files Created

```
frontend/src/
├── domain/
│   └── cnpj/
│       ├── entities/
│       │   └── CompanyInfo.ts           # Domain entity
│       └── ports/
│           └── ICnpjGateway.ts          # Gateway interface
├── infrastructure/
│   └── cnpj/
│       └── HttpCnpjGateway.ts           # HTTP implementation
├── application/
│   └── cnpj/
│       └── lookupCnpjUseCase.ts         # Business logic
├── composables/
│   └── useCnpjLookup.ts                 # Vue composable
└── components/
    └── Form/
        └── OnboardingForm.vue           # Updated with integration
```

## Summary

This implementation demonstrates:
- ✅ **DDD**: Clear layer separation (Domain, Application, Infrastructure, Presentation)
- ✅ **SOLID**: All 5 principles properly applied
- ✅ **Testability**: Easy to mock and test without API
- ✅ **Maintainability**: Changes isolated to specific layers
- ✅ **Extensibility**: Easy to add caching, retry logic, etc.
- ✅ **Type Safety**: Full TypeScript support
- ✅ **User Experience**: Automatic form filling with visual feedback
- ✅ **Error Handling**: Graceful error management
- ✅ **Clean Architecture**: Dependencies point inward

The CNPJ lookup feature is now a robust, maintainable, and user-friendly solution that follows industry best practices!
