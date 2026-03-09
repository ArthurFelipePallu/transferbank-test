# Enhanced Error Handling with Backend-Driven Messages

## Overview
Simplified axios interceptors to always display error messages from the backend, ensuring consistency and making the frontend a pure presentation layer for errors.

## Philosophy

**Backend is the Source of Truth**: All error messages are defined in the backend. The frontend simply displays whatever message the backend provides through the `extractErrorMessage` function.

## Implementation

### Frontend Interceptor (Simplified)

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const ui = await getUiStore()
    
    if (!error.response) {
      ui.showError('Network error. Please check your connection.')
      return Promise.reject(error)
    }

    const errorMessage = extractErrorMessage(error)
    
    // Handle special cases that need actions (not messages)
    if (error.response.status === 401 && errorCode !== 'Unauthorized') {
      // Session expired - clear auth and redirect
      storageService.remove(STORAGE_KEYS.AUTH_TOKEN)
      storageService.remove(STORAGE_KEYS.AUTH_USER)
      router.push({ name: 'login' })
    }
    
    if (error.response.status === 409 && errorCode === 'CompanyAlreadyExists') {
      router.push({ name: 'account-exists' })
    }
    
    // Always show backend message
    ui.showError(errorMessage)
    return Promise.reject(error)
  }
)
```

### Backend Error Messages

All controllers return user-friendly error messages:

#### Validation Errors (400)
```csharp
if (!ModelState.IsValid)
{
    var errors = ModelState.Values
        .SelectMany(v => v.Errors)
        .Select(e => e.ErrorMessage)
        .ToList();
    
    return BadRequest(new ErrorResponseDto(
        message: string.Join("; ", errors),
        errorCode: "ValidationError",
        statusCode: 400
    ));
}
```

#### Authentication Errors (401)
```csharp
return Unauthorized(new ErrorResponseDto(
    message: "Invalid email or password",
    errorCode: "Unauthorized",
    statusCode: 401
));
```

#### Not Found Errors (404)
```csharp
return NotFound(new ErrorResponseDto(
    message: "Company not found. Please check the company ID.",
    errorCode: "NotFound",
    statusCode: 404
));
```

#### Conflict Errors (409)
```csharp
return Conflict(new ErrorResponseDto(
    message: "Company with this CNPJ or Email already exists",
    errorCode: "CompanyAlreadyExists",
    statusCode: 409
));
```

#### Server Errors (500)
```csharp
return StatusCode(500, new ErrorResponseDto(
    message: "An error occurred during registration. Please try again.",
    errorCode: "InternalError",
    statusCode: 500
));
```

## Benefits

1. **Single Source of Truth**: All error messages defined in backend
2. **Consistency**: Same message format across all endpoints
3. **Maintainability**: Change messages in one place (backend)
4. **Localization Ready**: Backend can return localized messages
5. **Simpler Frontend**: No hardcoded error messages
6. **Better Testing**: Test error messages in backend unit tests

## Error Message Guidelines

### User-Friendly
- Clear and actionable
- Avoid technical jargon
- Suggest next steps when possible

### Examples

**Good Messages:**
- "Invalid email or password"
- "Company not found. Please check the company ID."
- "An error occurred during registration. Please try again."

**Bad Messages:**
- "Unauthorized"
- "Not found"
- "Error"

## Frontend Responsibilities

The frontend only handles:
1. **Display**: Show the backend message in a toast
2. **Navigation**: Redirect for specific error codes (401, 409)
3. **Session Management**: Clear auth data on session expiration
4. **Network Errors**: Handle cases where backend is unreachable

## Backend Responsibilities

The backend handles:
1. **Message Content**: Define all error messages
2. **Error Codes**: Provide semantic error codes
3. **Validation**: Validate input and return specific errors
4. **Consistency**: Use ErrorResponseDto for all errors

## Testing

### Backend Tests
Test that controllers return correct error messages:

```csharp
[Fact]
public async Task Register_WithInvalidEmail_ReturnsValidationError()
{
    var result = await controller.Register(new RegisterCompanyRequest 
    { 
        Email = "invalid" 
    });
    
    var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
    var error = Assert.IsType<ErrorResponseDto>(badRequest.Value);
    Assert.Contains("Invalid email format", error.Message);
}
```

### Frontend Tests
Test that errors are displayed:

```typescript
it('displays backend error message', async () => {
  mockApi.register.mockRejectedValue({
    response: {
      status: 400,
      data: { message: 'CNPJ is required' }
    }
  })
  
  await submitForm()
  
  expect(toast.error).toHaveBeenCalledWith('CNPJ is required')
})
```

## Files Modified

### Frontend
- `frontend/src/api/axiosInstance.ts` - Simplified to always use backend messages

### Backend
- `backend/src/Api/Controllers/CompanyController.cs` - Enhanced error messages
- `backend/src/Api/Controllers/PartnerController.cs` - Enhanced error messages
- `backend/src/Api/Controllers/AuthController.cs` - Enhanced error messages

## Migration from Old Approach

### Before (Frontend-Defined Messages)
```typescript
case 400:
  ui.showError('Invalid request. Please check your input.')
  break
case 404:
  ui.showError('The requested resource was not found.')
  break
```

### After (Backend-Defined Messages)
```typescript
// Just show whatever the backend sends
ui.showError(extractErrorMessage(error))
```

## Future Enhancements

1. **Localization**: Backend returns messages in user's language
2. **Error Details**: Include field-level errors for forms
3. **Error Tracking**: Log errors to monitoring service
4. **Retry Suggestions**: Backend suggests if retry might help
5. **Help Links**: Include links to documentation for specific errors
