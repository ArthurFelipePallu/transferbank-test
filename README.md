# Mediteranian Bank

Plataforma bancária corporativa full-stack para abertura e gestão de contas empresariais, com suporte nativo a criptomoedas, validação de documentos por inteligência artificial e cotações de câmbio em tempo real.

🌐 **Deploy disponível em:** [mediteranianonboardingdemo.netlify.app](https://mediteranianonboardingdemo.netlify.app)

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pipeline de Análise de Documentos com IA](#pipeline-de-análise-de-documentos-com-ia)
- [Fórmulas de Câmbio](#fórmulas-de-câmbio)
- [Fórmula do Custo de Abertura de Conta](#fórmula-do-custo-de-abertura-de-conta)
- [APIs Externas](#apis-externas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando Localmente](#executando-localmente)
- [Deploy](#deploy)

---

## Visão Geral

O Mediteranian Bank é uma plataforma de abertura de contas corporativas voltada para empresas que operam tanto no sistema financeiro tradicional quanto na economia cripto. As empresas podem se cadastrar, enviar o contrato social para validação por IA, gerenciar sócios com controles de KYC e acompanhar cotações de câmbio e criptomoedas ao vivo — tudo em uma única interface.

---

## Funcionalidades

### Fluxo de Onboarding

Processo de cadastro guiado em múltiplas etapas:

1. **Validação de CNPJ** — O CNPJ é validado localmente pelo algoritmo oficial de verificação de dígitos antes de qualquer chamada à API.
2. **Dados da Empresa** — Razão social, nome fantasia, endereço (com busca automática por CEP via ViaCEP) e tipo societário.
3. **Gestão de Sócios** — Adição, edição e remoção de sócios com campos completos de KYC: CPF/RG, nacionalidade, percentual de participação e declaração de PEP (Pessoa Politicamente Exposta).
4. **Upload do Contrato Social** — Upload de PDF com pré-visualização. O documento é enviado por um pipeline de OCR + análise por IA para verificar sua autenticidade.
5. **Senha e Revisão** — Criação de senha segura e etapa de revisão completa antes do envio final.

### Dashboard

Tela pós-login com informações da empresa, ações rápidas e lista de sócios.

### Cotações em Tempo Real

Cotações ao vivo de USD, EUR, GBP, JPY, BTC e ETH em BRL, atualizadas a cada 10 segundos. Exibidas na barra lateral da tela de login no desktop e em uma seção dedicada no mobile.

### Custo de Abertura de Conta

A taxa de abertura de conta é calculada dinamicamente a partir das cotações de câmbio ao vivo, com aplicação de spread e IOF, e exibida em BRL com indicador de variação de preço.

### Internacionalização

Suporte completo a PT-BR e EN via composable `useTranslation` com árvore de traduções tipada.

---

## Arquitetura

O projeto segue os princípios de **DDD (Domain-Driven Design)** e **SOLID** em ambos frontend e backend.

```
.
├── frontend/          # SPA Vue 3 (Vite)
│   ├── src/
│   │   ├── domain/        # Entidades, objetos de valor, ports, erros de domínio
│   │   ├── application/   # Casos de uso, serviços, orquestração
│   │   ├── infrastructure/# Gateways de API, i18n, provedores externos
│   │   ├── stores/        # Estado Pinia (padrão Repository)
│   │   ├── composables/   # Lógica de composição Vue reutilizável
│   │   ├── components/    # Componentes de UI
│   │   └── views/         # Páginas de rota
│
└── backend/           # ASP.NET Core 9 Web API
    └── src/
        ├── Domain/        # Modelos, objetos de valor
        ├── Application/   # Interfaces, serviços, mappers
        ├── Infrastructure/# EF Core, OCR, OpenAI, HTTP externo
        └── Api/           # Controllers, middleware, injeção de dependência
```

---

## Tecnologias Utilizadas

### Frontend

| Categoria | Biblioteca / Ferramenta | Versão |
|---|---|---|
| Framework | Vue 3 (Composition API) | ^3.5 |
| Build | Vite | ^7.3 |
| Linguagem | TypeScript | ~5.9 |
| Estado | Pinia | ^3.0 |
| Roteamento | Vue Router | ^5.0 |
| Formulários e Validação | VeeValidate + Yup + Zod | ^4.15 / ^1.7 / ^4.3 |
| UI Framework | Bootstrap 5 | ^5.3 |
| Ícones | Lucide Vue Next | ^0.577 |
| Cliente HTTP | Axios + axios-retry | ^1.13 |
| i18n | Composable customizado (tipado) | — |
| Testes | Vitest + Vue Test Utils | ^4.0 |
| Linting | ESLint + oxlint + Prettier | — |
| Geração de API | swagger-typescript-api | ^13.2 |

### Backend

| Categoria | Biblioteca / Ferramenta | Versão |
|---|---|---|
| Runtime | .NET 9 / ASP.NET Core | 9.0 |
| ORM | Entity Framework Core + SQLite | 9.0 |
| Hash de senha | BCrypt.Net-Next | 4.0.3 |
| Documentação de API | Swashbuckle (Swagger) | 10.1.4 |
| HTTP factory | Microsoft.Extensions.Http | 9.0 |
| Containerização | Docker | — |

---

## Pipeline de Análise de Documentos com IA

Quando o usuário faz o upload do contrato social em PDF, o documento passa por um pipeline de duas etapas:

```
Upload do PDF → OCR (API OCR.space) → Extração de Texto → Análise GPT (OpenAI) → Resultado Estruturado
```

### Documento de Teste

Para testar o pipeline de validação no deploy em produção, utilize o contrato social de exemplo incluído neste repositório:

📄 **[Baixar contrato_social_teste.pdf](frontend/contrato_social_teste.pdf)**

Faça o upload deste arquivo na etapa de contrato social durante o onboarding em [mediteranianonboardingdemo.netlify.app](https://mediteranianonboardingdemo.netlify.app) para verificar o funcionamento completo da análise por IA.

### Etapa 1 — OCR (Extração de Texto)

O PDF é enviado para a API **OCR.space**. O texto bruto extraído é repassado para a próxima etapa.

### Etapa 2 — Análise por IA (OpenAI GPT)

O texto extraído é enviado para o **OpenAI Chat Completions** (`gpt-4o-mini` por padrão) com um prompt de sistema estruturado que instrui o modelo a avaliar cinco critérios ponderados:

| Critério | Peso |
|---|---|
| Identificação da Empresa | 0,20 |
| Dados dos Sócios | 0,25 |
| Assinaturas | 0,25 |
| Cláusulas Obrigatórias | 0,15 |
| Integridade do Documento | 0,15 |

O modelo retorna um objeto JSON com pontuações por critério (0,0–1,0), um `confidenceIndex` e um flag `isValid`. O backend aplica um limiar mínimo de confiança de **0,70** no lado do servidor, independentemente do que o modelo retornar.

---

## Fórmulas de Câmbio

### Índice de Confiança (Validação de Documento por IA)

$$
C = \sum_{i=1}^{n} s_i \cdot w_i
$$

Onde:
- $C$ = índice de confiança $\in [0, 1]$
- $s_i$ = pontuação do critério $i$, $s_i \in [0, 1]$
- $w_i$ = peso do critério $i$

Expandido com os cinco critérios:

$$
C = (s_{\text{empresa}} \times 0{,}20) + (s_{\text{sócios}} \times 0{,}25) + (s_{\text{assinaturas}} \times 0{,}25) + (s_{\text{cláusulas}} \times 0{,}15) + (s_{\text{integridade}} \times 0{,}15)
$$

O documento é considerado válido quando:

$$
C \geq 0{,}70
$$

### Conversão de Moeda para BRL

Para qualquer moeda estrangeira com taxa de câmbio $r$ (unidades de BRL por 1 unidade da moeda estrangeira):

$$
P_{\text{BRL}} = Q \times r
$$

Onde:
- $Q$ = quantidade na moeda estrangeira
- $r$ = taxa de câmbio ao vivo (BRL por unidade)
- $P_{\text{BRL}}$ = valor equivalente em Reais

---

## Fórmula do Custo de Abertura de Conta

A taxa de abertura é denominada na moeda de referência que resultar no menor custo em BRL entre todas as moedas suportadas, e convertida para BRL com aplicação de spread e IOF.

### Etapa 1 — Custo Base em BRL

$$
B_{\text{BRL}} = Q_{\text{base}} \times r
$$

Onde $Q_{\text{base}}$ é o custo base fixo na moeda de referência (ex.: USD 100, EUR 100, BTC 0,00153) e $r$ é a cotação ao vivo.

### Etapa 2 — Aplicar Spread (1%)

$$
P_{\text{spread}} = B_{\text{BRL}} \times (1 + s), \quad s = 0{,}01
$$

### Etapa 3 — Aplicar IOF (3,5%)

$$
P_{\text{IOF}} = P_{\text{spread}} \times (1 + \tau), \quad \tau = 0{,}035
$$

### Etapa 4 — Arredondamento para Cima (centavo)

$$
P_{\text{final}} = \left\lceil P_{\text{IOF}} \times 100 \right\rceil \div 100
$$

### Fórmula Combinada

$$
P_{\text{final}} = \left\lceil Q_{\text{base}} \times r \times (1 + s) \times (1 + \tau) \times 100 \right\rceil \div 100
$$

O sistema avalia essa fórmula para cada moeda suportada e seleciona aquela que minimiza $P_{\text{final}}$ para o usuário.

---

## APIs Externas

| API | Finalidade | Documentação |
|---|---|---|
| [CoinGecko](https://www.coingecko.com/en/api) | Cotações ao vivo de BTC / ETH em BRL | Plano gratuito, ~30 req/min |
| [ExchangeRate-API](https://www.exchangerate-api.com) | Cotações ao vivo de USD / EUR / GBP / JPY | Plano gratuito, atualização horária |
| [OCR.space](https://ocr.space/ocrapi) | Extração de texto de PDF | Plano gratuito disponível |
| [OpenAI](https://platform.openai.com/docs) | Análise de contrato social por IA | Pago, GPT-4o-mini |
| [ViaCEP](https://viacep.com.br) | Busca de endereço por CEP | Gratuito, sem chave |

---

## Variáveis de Ambiente

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=https://url-do-seu-backend
```

### Backend (Cloud Run / `appsettings.json`)

```env
OcrSpace__ApiKey=sua_chave_ocr_space
OpenAi__ApiKey=sua_chave_openai
OpenAi__Model=gpt-4o-mini
OpenAi__MaxTokens=1000
```

> Chaves de API reais nunca devem ser commitadas. Configure-as via variáveis de ambiente no Cloud Run ou no seu gerenciador de segredos.

---

## Executando Localmente

> **Atenção:** ao rodar o backend localmente, a validação de documentos por IA **não funcionará**. As chaves das APIs de OCR (OCR.space) e análise por IA (OpenAI) são configuradas exclusivamente via variáveis de ambiente no Cloud Run. Para testar o pipeline completo de análise de contrato social, utilize o deploy em produção: [mediteranianonboardingdemo.netlify.app](https://mediteranianonboardingdemo.netlify.app).

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

A API estará disponível em `http://localhost:5287` com Swagger em `/swagger`.

---

## Deploy

| Camada | Plataforma |
|---|---|
| Frontend | [Netlify](https://netlify.com) — deploy automático a cada push na branch `main` — acesse em [mediteranianonboardingdemo.netlify.app](https://mediteranianonboardingdemo.netlify.app) |
| Backend | [Google Cloud Run](https://cloud.google.com/run) — containerizado via Docker |
| Banco de dados | SQLite (embutido no container, adequado para demo/staging) |

### Deploy do backend no Cloud Run

```bash
gcloud run deploy transferbank-api \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated
```

### Atualizar uma variável de ambiente no Cloud Run

```bash
gcloud run services update transferbank-api \
  --region us-central1 \
  --update-env-vars "OpenAi__ApiKey=sk-sua-nova-chave"
```
