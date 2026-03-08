# Companies List Feature

## Overview
Created a new view to display all registered companies in a responsive card grid layout.

## Backend Changes

### API Endpoint
- **Added**: `GET /api/company` - Returns all companies
- **Location**: `backend/src/Api/Controllers/CompanyController.cs`

### Service Layer
- **Added**: `GetAllAsync()` method to `ICompanyService` interface
- **Implemented**: Method in `CompanyService` to fetch all companies from repository
- **Location**: `backend/src/Application/Services/CompanyService.cs`

## Frontend Implementation

### Domain Layer
- **Added**: `CompanyListItem` interface in `frontend/src/domain/company/interfaces/companyInterface.ts`
  - Contains: id, cnpj, companyName, fullName, cryptoCurrencies, email, partnerCount, createdAt
- **Updated**: `CompanyGateway` port to include `getAll()` method

### Infrastructure Layer
- **Updated**: `HttpCompanyGateway` with:
  - `getAll()` method to call backend API
  - `mapToCompanyListItem()` mapper function

### Application Layer
- **Created**: `frontend/src/application/company/companyUseCases.ts`
  - `getAllCompanies()` - Fetches all companies
  - `getCompanyById()` - Fetches single company by ID
  - `getCompanyByCnpj()` - Fetches single company by CNPJ

### Presentation Layer

#### View Component
- **Created**: `frontend/src/views/CompaniesListView.vue`
  - Displays companies in a responsive grid (2 columns on desktop, 1 on mobile)
  - Shows loading, error, and empty states
  - Handles company card clicks (prepared for future routing)

#### Card Component
- **Created**: `frontend/src/components/Company/CompanyCard.vue`
  - Displays company information:
    - Company name and partner count (header)
    - Full name, CNPJ, email
    - Cryptocurrency badges
    - Creation date (relative format)
  - Hover effects and click interaction
  - Fully responsive design
  - CNPJ formatting (12.345.678/0001-90)
  - Crypto abbreviations (Bitcoin → BTC)

### Routing
- **Added**: `/companies` route in `frontend/src/router/index.ts`
- **Updated**: Navigation config to include "Companies" link

## Features

### Card Display
- 2 cards per row on desktop/tablet
- 1 card per row on mobile
- Responsive gap spacing
- Hover effects with elevation and border color change

### Data Formatting
- **CNPJ**: Formatted with dots, slash, and dash
- **Cryptocurrencies**: Displayed as badges with abbreviations
- **Date**: Relative format (today, yesterday, X days ago, etc.)
- **Partner Count**: Badge showing number of partners

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for grid layout
- Touch-optimized card interactions
- Proper spacing using CSS variables

## Future Enhancements (TODO)

1. **Company Details View**: Create detailed view when clicking a company card
2. **Partner Count**: Backend should calculate and return actual partner count
3. **Filtering**: Add search and filter capabilities
4. **Sorting**: Allow sorting by name, date, partner count
5. **Pagination**: Implement pagination for large datasets
6. **Loading Skeleton**: Add skeleton loaders instead of simple text

## Technical Notes

- Uses DDD architecture with clear separation of concerns
- Follows SOLID principles
- Type-safe with TypeScript interfaces
- Reusable components
- Consistent with existing codebase patterns
- No external dependencies added

## Testing

Backend tests are in progress in `backend/tests/` directory.
Frontend components have no diagnostics errors.
