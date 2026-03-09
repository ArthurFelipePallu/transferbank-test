# Company Status Validation Feature

## Overview
Added validation to check company status from CNPJ.ws API. Only active companies can be registered. Inactive, suspended, or cancelled companies trigger errors with toast notifications and prevent form submission.

## Architecture (DDD/SOLID)

### Domain Layer
**CompanyInfo.ts** - Enhanced entity with status fields
- Added `situacaoCadastral` and `situacaoCadastralDescricao` fields
- Created `CompanyStatus` enum with status codes (Active, Suspended, Inactive, Cancelled)
- Added `isCompanyActive()` function to validate status
- Added `getStatusDescription()` function for human-readable status

**CompanyStatusError.ts** - Custom domain error
- Extends Error with status, statusDescription, and companyName
- Provides clear error messages for inactive companies

### Application Layer
**lookupCnpjUseCase.ts** - Enhanced with status validation
- Validates company status after lookup
- Throws `CompanyStatusError` if company is not active
- Returns company info only if status is active

### Infrastructure Layer
**HttpCnpjGateway.ts** - Updated mapping
- Maps `situacao_cadastral` from API response to domain entity
- Preserves all status information from CNPJ.ws API

### Presentation Layer
**useCnpjLookup.ts** - Enhanced composable
- Added `statusError` ref to expose status errors
- Handles `CompanyStatusError` separately from generic errors
- Provides clear error messages to UI

**OnboardingForm.vue** - UI integration
- Shows status error alert below CNPJ field
- Displays toast notification when inactive company detected
- Disables submit button when status error exists
- Resets error when CNPJ changes
- Prevents form submission if company is inactive

## Status Codes (CNPJ.ws API)
- `01` - Nula (Null) - ❌ Cannot register - Registration is null
- `02` - Ativa (Active) - ✅ Can register
- `03` - Suspensa (Suspended) - ❌ Cannot register - Suspended by tax authorities
- `04` - Inapta (Inactive) - ❌ Cannot register - Pending tax/registration issues
- `08` - Baixada (Cancelled) - ❌ Cannot register - Officially closed

## User Experience
1. User enters CNPJ with 14 digits
2. System automatically looks up company info
3. If company is inactive:
   - Toast notification appears with detailed error message
   - Red alert box shows below CNPJ field with full explanation
   - Submit button is disabled
   - Error message explains the specific status issue
4. If company is active:
   - Form auto-fills with company data
   - User can proceed with registration

## Error Messages
Now includes detailed, user-friendly messages with explanations:

**For Suspended (03):**
- "Company '[Name]' is Suspensa (Suspended). This company has been suspended by the tax authorities and cannot operate until the suspension is lifted."

**For Inactive (04):**
- "Company '[Name]' is Inapta (Inactive). This company is inactive due to pending tax or registration issues. It must be regularized before operating."

**For Cancelled (08):**
- "Company '[Name]' is Baixada (Cancelled). This company has been officially closed/cancelled and can no longer operate."

**For Null (01):**
- "Company '[Name]' is Nula (Null). This company registration is null and cannot be used for business operations."

**For Unknown Status:**
- "Company '[Name]' is Unknown (Code: XX). This company status does not allow registration at this time."

## Files Modified
- `frontend/src/domain/cnpj/entities/CompanyInfo.ts`
- `frontend/src/domain/cnpj/errors/CompanyStatusError.ts` (new)
- `frontend/src/application/cnpj/lookupCnpjUseCase.ts`
- `frontend/src/infrastructure/cnpj/HttpCnpjGateway.ts`
- `frontend/src/composables/useCnpjLookup.ts`
- `frontend/src/components/Form/OnboardingForm.vue`

## Testing
All files type-check successfully with zero errors.
