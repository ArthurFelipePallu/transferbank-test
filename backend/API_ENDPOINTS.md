# API Endpoints Documentation

## Authentication Endpoints

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "companyId": "guid",
  "email": "string",
  "companyName": "string",
  "token": "string"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid credentials
- 500 Internal Server Error

---

## Company Endpoints

### POST /api/company/register
Register a new company.

**Request Body:**
```json
{
  "cnpj": "string",
  "companyName": "string",
  "fullName": "string",
  "cryptoCurrencies": ["Bitcoin", "Ethereum"],
  "phone": "string",
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "id": "guid",
  "cnpj": "string",
  "companyName": "string",
  "fullName": "string",
  "cryptoCurrencies": ["Bitcoin", "Ethereum"],
  "phone": "string",
  "email": "string",
  "createdAt": "datetime"
}
```

**Error Responses:**
- 400 Bad Request: Invalid data
- 409 Conflict: Company already exists
- 500 Internal Server Error

### GET /api/company/{id}
Get company by ID.

**Response (200 OK):**
```json
{
  "id": "guid",
  "cnpj": "string",
  "companyName": "string",
  "fullName": "string",
  "cryptoCurrencies": ["Bitcoin"],
  "phone": "string",
  "email": "string",
  "createdAt": "datetime"
}
```

**Error Responses:**
- 404 Not Found: Company not found
- 500 Internal Server Error

### GET /api/company/cnpj/{cnpj}
Get company by CNPJ.

**Response:** Same as GET by ID

### GET /api/company/exists?cnpj={cnpj}&email={email}
Check if company exists by CNPJ or email.

**Response (200 OK):**
```json
{
  "exists": true
}
```

---

## Partner Endpoints

### POST /api/partner/register
Register a new partner for a company.

**Request Body:**
```json
{
  "companyId": "guid",
  "fullName": "string",
  "cpf": "string",
  "address": {
    "street": "string",
    "number": "string",
    "complement": "string (optional)",
    "neighborhood": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "nationality": "string",
  "shareholding": 50.5,
  "isPep": false,
  "documents": [
    {
      "name": "string",
      "size": 1024,
      "type": "string"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "guid",
  "companyId": "guid",
  "fullName": "string",
  "cpf": "string",
  "address": {
    "street": "string",
    "number": "string",
    "complement": "string",
    "neighborhood": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "nationality": "string",
  "shareholding": 50.5,
  "isPep": false,
  "documents": [
    {
      "id": "guid",
      "name": "string",
      "size": 1024,
      "type": "string",
      "uploadedAt": "datetime"
    }
  ],
  "createdAt": "datetime"
}
```

**Error Responses:**
- 400 Bad Request: Invalid data or shareholding exceeds 100%
- 500 Internal Server Error

### GET /api/partner/{id}
Get partner by ID.

**Response:** Same as POST response

**Error Responses:**
- 404 Not Found: Partner not found
- 500 Internal Server Error

### GET /api/partner/company/{companyId}
Get all partners for a company.

**Response (200 OK):**
```json
[
  {
    "id": "guid",
    "companyId": "guid",
    "fullName": "string",
    ...
  }
]
```

### GET /api/partner/company/{companyId}/shareholding
Get total shareholding for a company.

**Response (200 OK):**
```json
{
  "companyId": "guid",
  "totalShareholding": 75.5,
  "remaining": 24.5
}
```

---

## Currency Endpoints

### GET /api/currency/most-valuable-currency
Get the most valuable cryptocurrency.

**Response (200 OK):**
```json
{
  "currency": {
    "value": "Bitcoin",
    "alias": "BTC"
  }
}
```

### GET /api/currency/all-crypto-currencies
Get all available cryptocurrencies.

**Response (200 OK):**
```json
[
  {
    "value": "Bitcoin",
    "alias": "BTC"
  },
  {
    "value": "Ethereum",
    "alias": "ETH"
  },
  ...
]
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "errorCode": "ErrorCode",
  "statusCode": 400
}
```

## Architecture

The backend follows DDD (Domain-Driven Design) and SOLID principles:

- **Domain Layer**: Entities, Value Objects, Interfaces, DTOs
- **Application Layer**: Services implementing business logic
- **Infrastructure Layer**: Repository implementations (in-memory)
- **API Layer**: Controllers handling HTTP requests

### Dependency Injection

All services and repositories are registered in `Program.cs`:
- Repositories: Singleton (in-memory storage)
- Services: Scoped (per request)

### Password Security

Passwords are hashed using BCrypt before storage.
