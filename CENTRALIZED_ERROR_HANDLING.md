# Centralized Error Handling

## Overview
Implemented centralized HTTP error handling in the axios interceptor following DDD and SOLID principles. All 409 (Conflict) errors now automatically redirect to the already-exists page.

## Architecture

### Axios Response Interceptor
**File**: `frontend/src/api/axiosInstance.ts`

The response interceptor handles all HTTP errors in a centralized location, following the Single Responsibility Principle.

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    switch (status) {
      case 401: // Unauthorized
        console.log('Unauthorized')
        break
      case 403: // Forbidden
        console.log('Forbidden')
        break
      case 409: // Conflict - Resource already exists
        console.log('Resource already exists')
        router.push({ name: 'account-exists' })
        break
      default:
        console.log('Server error')
    }

    return Promise.reject(error)
  }
)
```

## Benefits

### 1. DRY Principle (Don't Repeat Yourself)
**Before**: Error handling duplicated in multiple places
- OnboardingView: 15 lines of duplicate error checking
- OnboardingStore: Additional error checking
- Potential for inconsistency across views

**After**: Single source of truth
- One place to handle 409 errors
- Consistent behavior across the entire application
- Easy to maintain and update

### 2. Single Responsibility Principle
- **Axios Interceptor**: Handles HTTP-level concerns (status codes, redirects)
- **Stores**: Handle business logic only
- **Views**: Handle UI concerns only

### 3. Separation of Concerns
```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Views - UI logic only)                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Stores - Business logic only)         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  (Axios - HTTP concerns & error codes)  │
└─────────────────────────────────────────┘
```

### 4. Maintainability
- **Single Point of Change**: Update error handling in one place
- **Consistency**: All 409 errors handled the same way
- **Extensibility**: Easy to add handling for other status codes

## Code Comparison

### Before (Duplicated)

**OnboardingView.vue**:
```typescript
catch (error) {
  const errorMessage = error instanceof Error ? error.message : ''
  if (errorMessage.includes('DUPLICATE_COMPANY') ||
      errorMessage.includes('already exists') || 
      errorMessage.includes('duplicate') ||
      errorMessage.includes('409')) {
    router.push({ name: 'account-exists' })
  } else {
    uiStore.showError('An unexpected error occurred.')
  }
}
```

**OnboardingStore.ts**:
```typescript
catch (err) {
  error.value = err instanceof Error ? err.message : 'Onboarding failed'
  
  if (error.value?.includes('already exists')) {
    throw new Error('DUPLICATE_COMPANY')
  }
  
  return false
}
```

### After (Centralized)

**axiosInstance.ts**:
```typescript
case 409:
  console.log('Resource already exists')
  router.push({ name: 'account-exists' })
  break
```

**OnboardingView.vue**:
```typescript
catch (error) {
  console.error('Onboarding error:', error)
  // 409 errors are handled by axios interceptor
  uiStore.showError('An unexpected error occurred. Please try again.')
}
```

**OnboardingStore.ts**:
```typescript
catch (err) {
  error.value = err instanceof Error ? err.message : 'Onboarding failed'
  return false
}
```

## Error Flow

### Registration Flow with 409 Error

```
User submits form
       ↓
OnboardingView.onSubmit()
       ↓
OnboardingStore.submitOnboarding()
       ↓
registerCompany use case
       ↓
httpCompanyGateway.register()
       ↓
axios.post() → Backend returns 409
       ↓
Axios Response Interceptor catches 409
       ↓
Automatically redirects to /account-exists
       ↓
Error propagates back to view
       ↓
View shows generic error message (optional)
```

## Extensibility

### Adding New Error Handlers

Easy to add handling for other status codes:

```typescript
switch (status) {
  case 401:
    // Redirect to login
    router.push({ name: 'login' })
    break
  case 403:
    // Show permission denied message
    uiStore.showError('You do not have permission')
    break
  case 404:
    // Redirect to not found page
    router.push({ name: 'not-found' })
    break
  case 409:
    // Redirect to already exists page
    router.push({ name: 'account-exists' })
    break
  case 422:
    // Show validation errors
    uiStore.showError('Validation failed')
    break
  case 500:
    // Show server error
    uiStore.showError('Server error occurred')
    break
}
```

### Adding Error Logging

```typescript
case 409:
  console.log('Resource already exists')
  // Add analytics tracking
  analytics.track('duplicate_registration_attempt', {
    endpoint: error.config?.url,
    timestamp: new Date().toISOString()
  })
  router.push({ name: 'account-exists' })
  break
```

## Testing Considerations

### Easy to Test
```typescript
describe('Axios Interceptor', () => {
  it('should redirect to account-exists on 409', async () => {
    const mockRouter = { push: vi.fn() }
    
    // Mock 409 response
    const error = {
      response: { status: 409 }
    }
    
    // Trigger interceptor
    await interceptor.onRejected(error)
    
    expect(mockRouter.push).toHaveBeenCalledWith({ 
      name: 'account-exists' 
    })
  })
})
```

## Files Modified

1. **frontend/src/api/axiosInstance.ts**
   - Added 409 case to response interceptor
   - Imported router for navigation

2. **frontend/src/views/OnboardingView.vue**
   - Removed duplicate 409 error checking
   - Simplified error handling
   - Reduced code by ~15 lines

3. **frontend/src/stores/useOnboardingStore.ts**
   - Removed DUPLICATE_COMPANY error throwing
   - Simplified error handling
   - Store focuses on business logic only

## Summary

This refactoring demonstrates:
- ✅ **DRY**: Eliminated code duplication
- ✅ **SRP**: Each layer has single responsibility
- ✅ **Separation of Concerns**: HTTP errors handled at infrastructure layer
- ✅ **Maintainability**: Single point of change
- ✅ **Consistency**: All 409 errors handled uniformly
- ✅ **Extensibility**: Easy to add new error handlers
- ✅ **Testability**: Centralized logic is easier to test

The application now has robust, maintainable, and consistent error handling across all HTTP requests.
