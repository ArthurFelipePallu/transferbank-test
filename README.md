# Mediteranian Bank

A full-stack corporate banking platform for opening and managing business accounts, with crypto-native support, AI-powered document validation, and real-time currency rates.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [AI Document Analysis Pipeline](#ai-document-analysis-pipeline)
- [Currency Rate Formulas](#currency-rate-formulas)
- [Account Setup Cost Formula](#account-setup-cost-formula)
- [External APIs](#external-apis)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)

---

## Overview

Mediteranian Bank is a corporate account opening platform targeting businesses that operate in both traditional finance and the crypto economy. Companies can register, upload their social contract for AI validation, manage partners with KYC controls, and monitor live currency and crypto rates — all from a single interface.

---

## Features

### Onboarding Flow
A multi-step guided registration process for companies:

1. **CNPJ Validation** — Brazilian company tax ID is validated locally using the official digit-verification algorithm before any API call is made.
2. **Company Data** — Legal name, trading name, address (with automatic CEP lookup via ViaCEP), and business type.
3. **Partner Management** — Add, edit, and remove company partners with full KYC fields: CPF/RG, nationality, shareholding percentage, and PEP (Politically Exposed Person) declaration.
4. **Social Contract Upload** — PDF upload with preview. The document is sent through an OCR + AI analysis pipeline to verify authenticity.
5. **Password & Review** — Secure password creation and a full review step before final submission.

### Dashboard
Post-login view showing company info, quick actions, and partner list.

### Live Currency Rates
Real-time rates for USD, EUR, GBP, JPY, BTC, and ETH against BRL, updated every 10 seconds. Displayed in the login sidebar on desktop and as a dedicated section on mobile.

### Account Setup Cost
The account opening fee is calculated dynamically from live exchange rates, applying spread and IOF, and displayed in BRL with a price-change indicator.

### Internationalisation
Full EN / PT-BR support via a custom `useTranslation` composable backed by a typed translation tree.

---

## Architecture

The project follows **DDD (Domain-Driven Design)** and **SOLID** principles across both frontend and backend.

```
.
├── frontend/          # Vue 3 SPA (Vite)
│   ├── src/
│   │   ├── domain/        # Entities, value objects, ports, domain errors
│   │   ├── application/   # Use cases, services, orchestration
│   │   ├── infrastructure/# API gateways, i18n, external providers
│   │   ├── stores/        # Pinia state (Repository pattern)
│   │   ├── composables/   # Reusable Vue composition logic
│   │   ├── components/    # UI components
│   │   └── views/         # Route-level pages
│
└── backend/           # ASP.NET Core 9 Web API
    └── src/
        ├── Domain/        # Models, value objects
        ├── Application/   # Interfaces, services, mappers
        ├── Infrastructure/# EF Core, OCR, OpenAI, external HTTP
        └── Api/           # Controllers, middleware, DI wiring
```

---

## Tech Stack

### Frontend

| Category | Library / Tool | Version |
|---|---|---|
| Framework | Vue 3 (Composition API) | ^3.5 |
| Build | Vite | ^7.3 |
| Language | TypeScript | ~5.9 |
| State | Pinia | ^3.0 |
| Routing | Vue Router | ^5.0 |
| Forms & Validation | VeeValidate + Yup + Zod | ^4.15 / ^1.7 / ^4.3 |
| UI Framework | Bootstrap 5 | ^5.3 |
| Icons | Lucide Vue Next | ^0.577 |
| HTTP Client | Axios + axios-retry | ^1.13 |
| i18n | Custom composable (typed) | — |
| Testing | Vitest + Vue Test Utils | ^4.0 |
| Linting | ESLint + oxlint + Prettier | — |
| API codegen | swagger-typescript-api | ^13.2 |

### Backend

| Category | Library / Tool | Version |
|---|---|---|
| Runtime | .NET 9 / ASP.NET Core | 9.0 |
| ORM | Entity Framework Core + SQLite | 9.0 |
| Password hashing | BCrypt.Net-Next | 4.0.3 |
| API docs | Swashbuckle (Swagger) | 10.1.4 |
| HTTP factory | Microsoft.Extensions.Http | 9.0 |
| Containerisation | Docker | — |

---

## AI Document Analysis Pipeline

When a user uploads a social contract PDF, it goes through a two-stage pipeline:

```
PDF Upload → OCR (OCR.space API) → Text Extraction → OpenAI GPT Analysis → Structured Result
```

### Stage 1 — OCR (Text Extraction)
The PDF is sent to the **OCR.space** API. The raw text is extracted and passed to the next stage.

### Stage 2 — AI Analysis (OpenAI GPT)
The extracted text is sent to **OpenAI Chat Completions** (`gpt-4o-mini` by default) with a structured system prompt that instructs the model to evaluate five weighted criteria:

| Criterion | Weight |
|---|---|
| Company Identification | 0.20 |
| Partner Data | 0.25 |
| Signatures | 0.25 |
| Required Clauses | 0.15 |
| Document Integrity | 0.15 |

The model returns a JSON object with per-criterion scores (0.0–1.0), a `confidenceIndex`, and an `isValid` flag. The backend enforces a minimum confidence threshold of **0.70** server-side, regardless of what the model returns.

The confidence index formula is described in the [Currency Rate Formulas](#currency-rate-formulas) section below.

---

## Currency Rate Formulas

### Confidence Index (AI Document Validation)

$$
C = \sum_{i=1}^{n} s_i \cdot w_i
$$

Where:
- $C$ = confidence index $\in [0, 1]$
- $s_i$ = score for criterion $i$, $s_i \in [0, 1]$
- $w_i$ = weight for criterion $i$

Expanded with the five criteria:

$$
C = (s_{\text{company}} \times 0.20) + (s_{\text{partners}} \times 0.25) + (s_{\text{signatures}} \times 0.25) + (s_{\text{clauses}} \times 0.15) + (s_{\text{integrity}} \times 0.15)
$$

The document is considered valid when:

$$
C \geq 0.70
$$

### Currency Conversion to BRL

For any foreign currency with exchange rate $r$ (units of BRL per 1 unit of foreign currency):

$$
P_{\text{BRL}} = Q \times r
$$

Where:
- $Q$ = quantity in the foreign currency
- $r$ = live exchange rate (BRL per unit)
- $P_{\text{BRL}}$ = equivalent value in Brazilian Reais

---

## Account Setup Cost Formula

The account opening fee is denominated in a reference foreign currency (the one yielding the lowest BRL cost across all supported currencies) and converted to BRL with spread and IOF applied.

### Step 1 — Base Cost in BRL

$$
B_{\text{BRL}} = Q_{\text{base}} \times r
$$

Where $Q_{\text{base}}$ is the fixed base cost in the reference currency (e.g. USD 100, EUR 100, BTC 0.00153) and $r$ is the live rate.

### Step 2 — Apply Spread (1%)

$$
P_{\text{spread}} = B_{\text{BRL}} \times (1 + s), \quad s = 0.01
$$

### Step 3 — Apply IOF (3.5%)

$$
P_{\text{IOF}} = P_{\text{spread}} \times (1 + \tau), \quad \tau = 0.035
$$

### Step 4 — Round Up to Cent

$$
P_{\text{final}} = \left\lceil P_{\text{IOF}} \times 100 \right\rceil \div 100
$$

### Combined Formula

$$
P_{\text{final}} = \left\lceil Q_{\text{base}} \times r \times (1 + s) \times (1 + \tau) \times 100 \right\rceil \div 100
$$

The system evaluates this for every supported currency and selects the one that minimises $P_{\text{final}}$ for the user.

---

## External APIs

| API | Purpose | Docs |
|---|---|---|
| [CoinGecko](https://www.coingecko.com/en/api) | Live BTC / ETH rates in BRL | Free tier, ~30 req/min |
| [ExchangeRate-API](https://www.exchangerate-api.com) | Live USD / EUR / GBP / JPY rates | Free tier, hourly updates |
| [OCR.space](https://ocr.space/ocrapi) | PDF text extraction | Free tier available |
| [OpenAI](https://platform.openai.com/docs) | Social contract AI analysis | Paid, GPT-4o-mini |
| [ViaCEP](https://viacep.com.br) | Brazilian postal code lookup | Free, no key required |

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=https://your-backend-url
```

### Backend (Cloud Run / `appsettings.json`)

```env
OcrSpace__ApiKey=your_ocr_space_key
OpenAi__ApiKey=your_openai_key
OpenAi__Model=gpt-4o-mini
OpenAi__MaxTokens=1000
```

> Real API keys must never be committed. Set them via Cloud Run environment variables or your secrets manager.

---

## Running Locally

### Frontend

```bash
cd frontend
yarn install
yarn dev
```

### Backend

```bash
cd backend
dotnet run --project src/Api
```

The API will be available at `http://localhost:5287` with Swagger at `/swagger`.

---

## Deployment

| Layer | Platform |
|---|---|
| Frontend | [Netlify](https://netlify.com) — auto-deploys on push to `main` |
| Backend | [Google Cloud Run](https://cloud.google.com/run) — containerised via Docker |
| Database | SQLite (embedded in the container, suitable for demo/staging) |

### Deploy backend to Cloud Run

```bash
gcloud run deploy transferbank-api \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated
```

### Update a secret on Cloud Run

```bash
gcloud run services update transferbank-api \
  --region us-central1 \
  --update-env-vars "OpenAi__ApiKey=sk-your-new-key"
```
