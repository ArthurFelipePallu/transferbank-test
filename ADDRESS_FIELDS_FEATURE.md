# Address Fields with CEP Lookup Feature

## Overview
Added address fields to the onboarding form with automatic CEP lookup using ViaCEP API. When a user enters a CEP, the system automatically fills in street, neighborhood, city, and state information.

## Architecture (DDD/SOLID)

### Domain Layer
**Address.ts** - Address entity
- Defines `Address` interface with all address fields
- Defines `ViaCepResponse` interface for API mapping

**ICepGateway.ts** - CEP gateway port
- Interface for CEP lookup operations
- Follows Dependency Inversion Principle

### Infrastructure Layer
**HttpCepGateway.ts** - ViaCEP implementation
- Concrete implementation using ViaCEP API (`https://viacep.com.br/ws/{cep}/json/`)
- Handles API errors and 404 responses
- Maps API response to domain entity
- Includes console logging for debugging

### Application Layer
**lookupCepUseCase.ts** - CEP lookup business logic
- Validates CEP input
- Delegates to gateway for lookup
- Pure business logic, no infrastructure dependencies

### Presentation Layer
**useCepLookup.ts** - Vue composable
- Manages loading state
- Handles errors
- Exposes lookup function and reset
- Provides reactive state for UI

**OnboardingForm.vue** - Form integration
- Added 7 new address fields: CEP, Street, Number, Complement, Neighborhood, City, State
- Auto-fills address when CEP has 8 digits
- Shows loading indicator while searching
- Caches address data in Pinia store
- Restores cached data on page refresh

**FormInputField.vue** - CEP mask support
- Added `'cep'` mask type
- Formats CEP as user types: `12345-678`

## Data Flow

1. **CNPJ Lookup** → Gets company CEP from CNPJ.ws
2. **CEP Auto-fill** → Fills CEP field with company's CEP
3. **CEP Lookup** → Watches CEP field, triggers when 8 digits entered
4. **ViaCEP API** → Fetches address data
5. **Form Auto-fill** → Fills street, neighborhood, city, state
6. **User Completes** → User adds number and optional complement
7. **Form Cache** → All address data cached in Pinia store

## Form Fields Added

### Onboarding Form
- `cep` (required) - CEP with mask `00000-000`
- `logradouro` (required) - Street name
- `numero` (required) - Street number
- `complemento` (optional) - Apartment, suite, etc.
- `bairro` (required) - Neighborhood
- `cidade` (required) - City
- `uf` (required) - State (2 characters)

## Validation
- CEP: Required, 8 digits
- Street: Required
- Number: Required
- Complement: Optional
- Neighborhood: Required
- City: Required
- State: Required, exactly 2 characters

## User Experience
1. User enters CNPJ → CEP auto-fills from company data
2. User enters/edits CEP → Address auto-fills from ViaCEP
3. Loading indicator shows "Searching..." while fetching
4. User completes number and complement fields
5. All data cached for page refresh recovery

## Files Created
- `frontend/src/domain/address/entities/Address.ts`
- `frontend/src/domain/address/ports/ICepGateway.ts`
- `frontend/src/infrastructure/address/HttpCepGateway.ts`
- `frontend/src/application/address/lookupCepUseCase.ts`
- `frontend/src/composables/useCepLookup.ts`

## Files Modified
- `frontend/src/domain/onboarding/onboarding.schema.ts` - Added address validation
- `frontend/src/components/Form/OnboardingForm.vue` - Added address fields and CEP lookup
- `frontend/src/components/Form/FormInputField.vue` - Added CEP mask support
- `frontend/src/stores/useOnboardingStore.ts` - Added address to cache interface
- `frontend/src/utils/formatters.ts` - Added CEP formatting functions

## Backend Integration
Note: Address fields are currently validated and cached in the frontend only. Backend schema needs to be updated to accept and store address data.

## Testing
All files type-check successfully with zero errors.
