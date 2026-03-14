# Transfer Bank Project

A modern banking application with cryptocurrency integration, built with Vue 3 and .NET.

## Account Setup Cost Calculation

The account setup cost is displayed in Brazilian Reais (BRL) and is calculated from one of three base costs:
- $100 USD
- 0.00153 BTC
- 0.521 ETH

The system automatically selects the most favorable rate (lowest cost) and applies the following fees:

### Formula

The final cost in BRL is calculated using the following formula:

```
Cost_BRL = Base_Cost × Exchange_Rate × (1 + Spread) × (1 + IOF)
```

Where:
- **Base_Cost**: $100 USD, 0.00153 BTC, or 0.521 ETH (whichever is most favorable)
- **Exchange_Rate**: Current exchange rate to BRL
- **Spread**: 1% (0.01)
- **IOF**: 3.5% (0.035) - Brazilian tax on financial transactions

### LaTeX Notation

$$
\text{Cost}_{\text{BRL}} = \text{Base}_{\text{Cost}} \times \text{Exchange}_{\text{Rate}} \times (1 + 0.01) \times (1 + 0.035)
$$

Or expanded:

$$
\text{Cost}_{\text{BRL}} = \text{Base}_{\text{Cost}} \times \text{Exchange}_{\text{Rate}} \times 1.01 \times 1.035
$$

### Example Calculation

If the current rates are:
- 1 USD = 5.00 BRL
- 1 BTC = 350,000 BRL
- 1 ETH = 12,000 BRL

Then:
- Cost from USD: $100 × 5.00 = R$ 500.00
- Cost from BTC: 0.00153 × 350,000 = R$ 535.50
- Cost from ETH: 0.521 × 12,000 = R$ 6,252.00

The system selects USD (R$ 500.00) as the most favorable rate.

Applying fees:
1. Apply 1% spread: R$ 500.00 × 1.01 = R$ 505.00
2. Apply 3.5% IOF: R$ 505.00 × 1.035 = R$ 522.675
3. Round up to 2 decimals: R$ 522.68

### Real-Time Updates

The cost is updated every 5 seconds using real-time cryptocurrency prices from the CoinGecko API.

## Features

- Real-time cryptocurrency price tracking
- Automatic currency conversion with spread and IOF
- Mobile-first responsive design
- Bootstrap 5 integration
- International phone input with country flags
- CNPJ validation and lookup
- Multi-step onboarding process

## Technology Stack

### Frontend
- Vue 3 with TypeScript
- Bootstrap 5
- Vee-Validate for form validation
- Pinia for state management
- Vue Router for navigation

### Backend
- .NET 9
- Entity Framework Core
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 9 SDK
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd transfer-bank-project
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
dotnet restore
```

4. Run the development servers

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend/src/Api
dotnet run
```

## Project Structure

```
transfer-bank-project/
├── frontend/               # Vue 3 frontend application
│   ├── src/
│   │   ├── assets/        # Styles and static assets
│   │   ├── components/    # Vue components
│   │   ├── composables/   # Vue composables
│   │   ├── domain/        # Domain models and schemas
│   │   ├── services/      # API services
│   │   ├── stores/        # Pinia stores
│   │   └── views/         # Page views
│   └── package.json
├── backend/               # .NET backend application
│   ├── src/
│   │   ├── Api/          # API controllers
│   │   ├── Application/  # Business logic
│   │   └── Domain/       # Domain entities
│   └── Backend.sln
└── README.md
```

## License

[Your License Here]
