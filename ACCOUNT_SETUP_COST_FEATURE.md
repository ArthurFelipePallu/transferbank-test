# Account Setup Cost Feature

## Overview

Real-time cryptocurrency price integration that displays the account setup cost in Brazilian Reais (BRL) on the onboarding screen. The cost is calculated from multiple currency sources and automatically updates every 5 seconds.

## Implementation

### Components

#### 1. Domain Layer

**Currency.ts** - Domain entity representing a currency with exchange rate
**AccountSetupPrice.ts** - Domain entity for pricing calculations
**PriceChange.ts** - Domain entity representing price change
**PriceTracker.ts** - Domain service for tracking price history
**ICurrencyRateProvider.ts** - Domain interface for rate providers

#### 2. Infrastructure Layer

**CoinGeckoCurrencyRateProvider.ts** - Implements rate fetching from CoinGecko API

**API Used:** CoinGecko API (free, no authentication required)
- Endpoint: `https://api.coingecko.com/api/v3/simple/price`
- Currencies: USD, BTC, ETH → BRL

#### 3. Application Layer

**AccountSetupPriceService.ts** - Orchestrates pricing flow

**Features:**
- Fetch rates from provider
- Calculate price using domain logic
- Format result for presentation
- Handle errors gracefully

#### 4. Presentation Layer

**useAccountSetupCost.ts** - Vue composable for managing price updates and state

**Features:**
- Automatic updates every 5 seconds
- Loading and error states
- Lifecycle management (start/stop on mount/unmount)
- Price change tracking
- Formatted cost display

**AccountSetupCost.vue** - Display component showing the current account setup cost

**UI Elements:**
- Cost amount in BRL (large, prominent)
- Price change indicator (via PriceChangeIndicator component)
- Info tooltip with details (via InfoTooltip component)
- Loading and error states
- Responsive design

**PriceChangeIndicator.vue** - Reusable component for displaying price changes

**Features:**
- Direction indicators (↗/↘/—)
- Color-coded backgrounds (green/red/gray)
- Three size variants (sm, md, lg)
- Always visible when priceChange has a value
- Animated entrance

**InfoTooltip.vue** - Reusable component for info tooltips

**Features:**
- Four position options (top, bottom, left, right)
- Slot-based content (fully customizable)
- Hover and focus interactions
- Accessible (keyboard navigation, ARIA labels)
- Responsive design

### Pricing Logic

#### Base Costs
- **USD**: $100
- **BTC**: 0.00153 BTC
- **ETH**: 0.521 ETH

#### Fee Structure
1. **Spread**: 1% (0.01)
2. **IOF**: 3.5% (0.035) - Brazilian tax on financial transactions

#### Calculation Formula

```
Cost_BRL = Base_Cost × Exchange_Rate × (1 + Spread) × (1 + IOF)
```

**LaTeX Notation:**
```latex
\text{Cost}_{\text{BRL}} = \text{Base}_{\text{Cost}} \times \text{Exchange}_{\text{Rate}} \times 1.01 \times 1.035
```

#### Selection Logic
The system automatically selects the most favorable rate (lowest cost) among USD, BTC, and ETH.

#### Rounding
Final cost is rounded UP to 2 decimal places using `Math.ceil()`.

### Example Calculation

**Given rates:**
- 1 USD = 5.00 BRL
- 1 BTC = 350,000 BRL
- 1 ETH = 12,000 BRL

**Step 1: Calculate base costs**
- USD: $100 × 5.00 = R$ 500.00
- BTC: 0.00153 × 350,000 = R$ 535.50
- ETH: 0.521 × 12,000 = R$ 6,252.00

**Step 2: Select most favorable (USD)**
Base cost = R$ 500.00

**Step 3: Apply spread (1%)**
R$ 500.00 × 1.01 = R$ 505.00

**Step 4: Apply IOF (3.5%)**
R$ 505.00 × 1.035 = R$ 522.675

**Step 5: Round up to 2 decimals**
Final cost = R$ 522.68

## Integration

### OnboardingView
The `AccountSetupCost` component is integrated at the top of the onboarding form, immediately after the header and before the form fields.

```vue
<template>
  <main class="onboarding-page">
    <div class="card">
      <header>
        <h1>Business Onboarding</h1>
      </header>
      
      <!-- Account Setup Cost Display -->
      <AccountSetupCost />
      
      <OnboardingForm @submit="onSubmit" />
    </div>
  </main>
</template>
```

## Features

### Real-Time Updates
- Fetches prices every 5 seconds
- Smooth fade-in animation on update
- Displays last update timestamp

### Error Handling
- Fallback prices if API fails
- Error message display
- Graceful degradation

### Responsive Design
- Mobile-first approach
- Scales from 360px to 1920px+
- Touch-friendly on mobile
- Larger display on desktop

### Accessibility
- Semantic HTML
- ARIA labels for loading states
- High contrast colors
- Readable font sizes

## API Details

### CoinGecko API
**Endpoint:**
```
GET https://api.coingecko.com/api/v3/simple/price
```

**Parameters:**
- `ids`: bitcoin,ethereum,usd
- `vs_currencies`: brl

**Response:**
```json
{
  "bitcoin": {
    "brl": 350000
  },
  "ethereum": {
    "brl": 12000
  },
  "usd": {
    "brl": 5.0
  }
}
```

**Rate Limits:**
- Free tier: 10-50 calls/minute
- No authentication required
- Reliable and stable

### Fallback Prices
If API fails, the system uses approximate fallback values:
- 1 USD = 5.00 BRL
- 1 BTC = 350,000 BRL
- 1 ETH = 12,000 BRL

## Styling

### Color Scheme
- Background: Light teal gradient (rgba(28, 156, 140, 0.05))
- Border: Teal with transparency
- Amount: Primary teal color
- Icon: Gradient teal background

### Typography
- Amount: 2rem mobile → 2.5rem desktop
- Title: 1rem mobile → 1.125rem desktop
- Details: 0.75rem mobile → 0.8125rem desktop

### Spacing
- Padding: 1.25rem mobile → 1.75rem desktop
- Margin bottom: 1.5rem
- Internal gaps: 0.5rem - 1rem

## Testing

### Manual Testing
1. Open onboarding page
2. Verify cost displays correctly
3. Wait 5 seconds and verify update
4. Check different screen sizes
5. Test with network throttling
6. Test with API failure (block domain)

### Test Scenarios
- ✅ Initial load shows loading state
- ✅ Cost displays after fetch
- ✅ Updates every 5 seconds
- ✅ Shows correct currency source
- ✅ Displays fees information
- ✅ Handles API errors gracefully
- ✅ Responsive on all devices
- ✅ Cleanup on component unmount

## Future Enhancements

### Potential Improvements
1. Add more currency options (EUR, GBP, etc.)
2. Allow user to select preferred currency
3. Show price history chart
4. Add price change indicators (↑↓)
5. Cache prices for offline support
6. Add WebSocket for real-time updates
7. Show exchange rate trends
8. Add currency conversion calculator

### Performance Optimizations
1. Implement request debouncing
2. Add response caching
3. Use WebSocket instead of polling
4. Lazy load component
5. Optimize re-renders

## Documentation

### README.md
Complete formula documentation with LaTeX notation has been added to the project README.

### Code Comments
All functions include JSDoc comments explaining:
- Purpose
- Parameters
- Return values
- Examples

## Compliance

### Brazilian Regulations
- IOF (Imposto sobre Operações Financeiras): 3.5%
- Applied to international financial transactions
- Correctly calculated and displayed

### Transparency
- All fees clearly displayed
- Source currency shown
- Update frequency indicated
- No hidden costs

## Conclusion

The Account Setup Cost feature provides users with transparent, real-time pricing information for account setup. It automatically selects the most favorable rate, applies all required fees, and updates continuously to reflect current market conditions.

**Key Benefits:**
- ✅ Real-time pricing
- ✅ Transparent fee structure
- ✅ Automatic currency selection
- ✅ Mobile-first design
- ✅ Error handling
- ✅ Accessibility compliant
