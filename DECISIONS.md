# Decisões de Projeto

Este documento registra as principais decisões técnicas tomadas durante o desenvolvimento do Mediteranian Bank, com a justificativa por trás de cada escolha.

---

## 1. Arquitetura DDD + SOLID no Frontend

Aplicar Domain-Driven Design em um SPA é uma escolha incomum — essa abordagem é muito mais frequente em backends. No entanto, o projeto cresceu consideravelmente além do escopo inicial previsto, e ficou claro que uma estrutura mais organizada seria necessária para sustentar essa expansão.

A separação em camadas de domínio, aplicação e infraestrutura no frontend trouxe um custo inicial de estruturação maior, mas tornou o código significativamente mais fácil de estender, testar e manter. Pensando na possibilidade de o projeto continuar crescendo no futuro, essa decisão se mostrou acertada: novas funcionalidades podem ser adicionadas sem que as camadas existentes precisem ser reescritas.

---

## 2. ASP.NET Core (.NET 9) para o Backend

A escolha do ASP.NET Core foi motivada principalmente pelo momento de aprendizado em que o projeto foi desenvolvido. O .NET era a tecnologia que estava sendo estudada ativamente na época, o que proporcionou maior conforto e produtividade durante a implementação.

Além disso, o ecossistema .NET oferece uma estrutura robusta para APIs REST, com suporte nativo a injeção de dependência, tipagem forte e ferramentas maduras — características que se alinham bem com os princípios de DDD e SOLID adotados no projeto.

---

## 3. SQLite como Banco de Dados

O SQLite foi escolhido pela simplicidade e velocidade de implementação que oferece. As necessidades de persistência do projeto são relativamente simples — cadastro de empresas, sócios e credenciais — e não justificavam a complexidade operacional de configurar e manter um banco de dados dedicado como PostgreSQL ou MySQL.

Para o escopo atual, um banco mais robusto seria um exagero e consumiria um tempo de desenvolvimento que pôde ser melhor aproveitado em outras partes do sistema. O SQLite atende plenamente aos requisitos, é embutido no container Docker e não exige infraestrutura adicional.

---

## 4. Pipeline OCR + IA para Validação do Contrato Social

A implementação do pipeline de extração de texto via OCR seguida de análise por inteligência artificial foi uma exigência do projeto. A separação em duas etapas distintas — OCR.space para extração do texto e OpenAI para análise do conteúdo — permite que cada serviço faça aquilo que faz melhor, além de facilitar a substituição de qualquer uma das partes de forma independente no futuro.

---

## 5. Internacionalização com Composable Próprio

As soluções de internacionalização disponíveis para Vue, como o vue-i18n, não ofereciam o nível de controle desejado sobre a forma como o conteúdo seria apresentado ao usuário. A decisão foi construir um composable próprio — `useTranslation` — com uma árvore de traduções totalmente tipada em TypeScript.

Essa abordagem garante que qualquer chave de tradução inexistente seja detectada em tempo de compilação, elimina strings mágicas espalhadas pelos componentes e dá controle total sobre a estrutura e o comportamento do sistema de tradução, sem depender de convenções ou limitações de uma biblioteca externa.

---

## 6. Deploy: Netlify (Frontend) + Google Cloud Run (Backend)

A escolha dessas duas plataformas foi influenciada pela experiência prévia com ambas. Já tendo realizado deploys anteriores no Netlify e no Google Cloud Run, a familiaridade com os fluxos de configuração, variáveis de ambiente e pipelines de CI/CD de cada plataforma reduziu o atrito e o tempo necessário para colocar o projeto em produção.

O Netlify se integra diretamente ao repositório GitHub e realiza o deploy automaticamente a cada push na branch principal, enquanto o Cloud Run oferece escalabilidade automática e isolamento via container Docker — uma combinação que funciona bem para o perfil deste projeto.

---

## 7. Bootstrap 5 como Base de UI

O uso do Bootstrap 5 foi uma exigência do projeto. Dentro dessa restrição, a decisão foi utilizá-lo de forma disciplinada: as classes utilitárias do Bootstrap foram priorizadas sempre que possível, e um sistema de design tokens em CSS customizado (`base.css`) foi construído sobre ele para garantir consistência visual e facilitar futuras alterações de tema sem depender de sobrescritas espalhadas pelo código.

---

## 8. Duas APIs de Câmbio: CoinGecko + ExchangeRate-API

O projeto utiliza duas fontes de dados distintas para as cotações porque cada API é especializada em uma classe de ativos diferente.

O **CoinGecko** é voltado especificamente para o mercado de criptomoedas. Ele fornece cotações de BTC e ETH em tempo real com alta frequência de atualização — característica essencial para ativos tão voláteis quanto criptomoedas, cujo preço pode variar significativamente em questão de segundos.

O **ExchangeRate-API** cobre as moedas fiduciárias tradicionais (USD, EUR, GBP, JPY). Embora o CoinGecko também disponibilize alguns dados de câmbio fiat, esse não é o seu foco principal, e o plano gratuito impõe limitações de requisições que tornariam seu uso para esse fim menos confiável. O ExchangeRate-API é mais adequado para esse propósito, simples de integrar e gratuito para o volume de consultas necessário.

Utilizar cada API para aquilo que ela faz melhor resulta em dados mais confiáveis para cada tipo de ativo. Do ponto de vista arquitetural, a interface `ICurrencyRateProvider` abstrai ambas as fontes atrás de um único contrato, o que significa que qualquer uma delas pode ser substituída de forma independente no futuro sem impacto nas camadas superiores da aplicação.
