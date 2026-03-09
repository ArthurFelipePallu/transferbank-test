# Partners List Feature

## Overview
Added an expandable partners list card to the dashboard that displays all registered partners for a company, sorted by shareholding percentage in descending order.

## Architecture (DDD/SOLID)

### Domain Layer
- **Entity**: `PartnerSummary` - Simplified partner representation for display
- **Value Object**: `PartnersCollection` - Collection with computed properties
- **Domain Services**: 
  - `sortPartnersByShareholding()` - Sorts partners by shares (descending)
  - `calculateTotalShareholding()` - Computes total allocated shares
- **Port**: `IPartnerListGateway` - Interface for fetching partner data

### Application Layer
- **Use Case**: `fetchPartnersCollection()` - Orchestrates partner fetching and sorting

### Infrastructure Layer
- **Gateway**: `HttpPartnerListGateway` - HTTP implementation using backend API
- **Endpoint**: `GET /api/Partner/company/{companyId}` - Fetches partners by company

### Presentation Layer
- **Composable**: `usePartnersList()` - Manages partners list state
- **Components**:
  - `PartnersListCard.vue` - Main expandable card with header and list
  - `PartnerListItem.vue` - Individual partner display (name, CPF, shares)

## Features

### Partners List Card
- Displays total partner count and allocated shareholding percentage
- Click to expand/collapse partner list
- Smooth expand/collapse animation
- Loading state support

### Partner Display
- Shows partners sorted by shareholding (highest first)
- Each item displays:
  - Full name
  - CPF (formatted with mask: 000.000.000-00)
  - Shareholding percentage (2 decimal places)
- Hover effect with border color change and slide animation

### Shareholding Summary
- Total Allocated: Sum of all partner shares (teal color)
- Remaining: Available shares (warning color, turns teal when 100%)
- Displayed at bottom of expanded list

## Component Structure

```
DashboardView
└── PartnersListCard
    ├── Header (always visible)
    │   ├── Icon (Users)
    │   ├── Title & Subtitle
    │   └── Expand Arrow
    └── Expandable Content
        ├── PartnerListItem (multiple)
        │   ├── Partner Info (name, CPF)
        │   └── Shares Display
        └── Shareholding Summary
            ├── Total Allocated
            └── Remaining
```

## Data Flow

1. Dashboard mounts → Checks authentication
2. If authenticated → Calls `loadPartners(companyId)`
3. Composable → Calls use case → Gateway → Backend API
4. Backend returns partners array
5. Use case sorts by shareholding (descending)
6. Use case calculates totals
7. Returns `PartnersCollection` to view
8. View renders `PartnersListCard` with data

## Styling

### Mobile-First Design
- Stacked layout on mobile
- Responsive font sizes
- Touch-friendly tap targets

### Visual Design
- Gradient icon background (teal)
- Soft borders with hover effects
- Smooth transitions and animations
- Consistent spacing and typography

### Color Scheme
- Primary: Teal gradient for icons and active states
- Text: Dark for names, muted for secondary info
- Borders: Light gray, teal on hover
- Background: Soft white/gray

## Integration Points

### Dashboard View
- Loads partners on mount if authenticated
- Displays card between company info and quick actions
- Passes collection and loading state to card

### Backend API
- Uses existing endpoint: `GET /api/Partner/company/{companyId}`
- Returns array of `PartnerResponse` objects
- Maps to `PartnerSummary` domain entities

## Future Enhancements

1. Real-time updates when partner is registered
2. Click partner to view/edit details
3. Delete partner functionality
4. Export partners list to CSV/PDF
5. Search/filter partners
6. Pagination for large partner lists
7. Partner status indicators (active/inactive)

## Files Created

### Domain Layer
- `frontend/src/domain/partner/entities/PartnerSummary.ts`
- `frontend/src/domain/partner/ports/IPartnerListGateway.ts`

### Application Layer
- `frontend/src/application/partner/partnerListUseCases.ts`

### Infrastructure Layer
- `frontend/src/infrastructure/partner/HttpPartnerListGateway.ts`

### Presentation Layer
- `frontend/src/composables/usePartnersList.ts`
- `frontend/src/components/Partner/PartnersListCard.vue`
- `frontend/src/components/Partner/PartnerListItem.vue`

### Updated Files
- `frontend/src/views/DashboardView.vue` - Added partners list integration

## Testing Considerations

1. Empty state (no partners)
2. Single partner
3. Multiple partners (sorting verification)
4. 100% shareholding (complete state)
5. Partial shareholding (remaining calculation)
6. Loading state
7. Error handling
8. Expand/collapse functionality
9. Responsive behavior
10. CPF formatting

## SOLID Principles Applied

- **Single Responsibility**: Each component/class has one clear purpose
- **Open/Closed**: Gateway interface allows different implementations
- **Liskov Substitution**: Any `IPartnerListGateway` implementation works
- **Interface Segregation**: Focused interface with single method
- **Dependency Inversion**: Depends on abstractions (interfaces), not concrete implementations
