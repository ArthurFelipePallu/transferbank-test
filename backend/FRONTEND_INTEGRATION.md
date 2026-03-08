# Frontend Integration Guide

## Base URL
```
http://localhost:5000/api
```

## CORS Configuration
The API is configured to accept requests from `http://localhost:5173` (Vite default port).

## Authentication Flow

1. **Company Registration** → `POST /api/company/register`
2. **Login** → `POST /api/auth/login` (returns token)
3. **Use token** for authenticated requests (store in Pinia auth store)

## Integration Examples

### 1. Company Registration (Onboarding)

```typescript
// In your onboarding store
async submitOnboarding(data: OnboardingFormData) {
  const response = await fetch('http://localhost:5000/api/company/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cnpj: data.cnpj,
      companyName: data.companyName,
      fullName: data.fullName,
      cryptoCurrencies: data.selectedCryptos, // Array of enum values
      phone: data.phone,
      email: data.email,
      password: data.password
    })
  });

  if (response.status === 409) {
    // Company already exists - redirect to /account-exists
    throw new Error('Company already exists');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json(); // Returns CompanyResponse
}
```

### 2. Login

```typescript
// In your auth store
async login(email: string, password: string) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (response.status === 401) {
    throw new Error('Invalid credentials');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  // Store: data.token, data.companyId, data.companyName
  return data;
}
```

### 3. Partner Registration

```typescript
// In your partner store
async registerPartner(data: PartnerFormData) {
  const response = await fetch('http://localhost:5000/api/partner/register', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // Add auth token if needed: 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      companyId: this.companyId, // From auth store
      fullName: data.fullName,
      cpf: data.cpf,
      address: {
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
        country: data.address.country
      },
      nationality: data.nationality,
      shareholding: data.shareholding,
      isPep: data.isPep,
      documents: data.documents.map(doc => ({
        name: doc.name,
        size: doc.size,
        type: doc.type
      }))
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
```

### 4. Get Remaining Shareholding

```typescript
// Before adding a new partner, check remaining shareholding
async getRemainingShareholding(companyId: string) {
  const response = await fetch(
    `http://localhost:5000/api/partner/company/${companyId}/shareholding`
  );

  if (!response.ok) {
    throw new Error('Failed to get shareholding');
  }

  const data = await response.json();
  return data.remaining; // Returns number (0-100)
}
```

### 5. Load Cryptocurrencies

```typescript
// In your onboarding store or component
async loadCryptocurrencies() {
  const response = await fetch('http://localhost:5000/api/currency/all-crypto-currencies');
  
  if (!response.ok) {
    throw new Error('Failed to load cryptocurrencies');
  }

  const cryptos = await response.json();
  // Returns: [{ value: "Bitcoin", alias: "BTC" }, ...]
  return cryptos;
}
```

## Error Handling

All errors follow this format:
```typescript
interface ErrorResponse {
  message: string;
  errorCode: string;
  statusCode: number;
}
```

Handle errors consistently:
```typescript
try {
  await someApiCall();
} catch (error) {
  if (error instanceof Response) {
    const errorData = await error.json();
    // Show errorData.message to user
  }
}
```

## Enum Values

### CryptoCurrencyEnum
Use these exact string values when sending to the API:
- `"Bitcoin"`
- `"Ethereum"`
- `"Tether"`
- `"USD_Coin"`
- `"BinanceCoin"`
- `"XRP"`
- `"Cardano"`
- `"Solana"`
- `"Dogecoin"`

## Running the Backend

```bash
cd backend
dotnet restore
dotnet run --project src/Api
```

The API will be available at `http://localhost:5000` (or check console output for the actual port).

## Testing with Swagger

Navigate to `http://localhost:5000/swagger` to test endpoints interactively.
