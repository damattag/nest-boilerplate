# Nest Boilerplate

Este é um boilerplate robusto para o desenvolvimento de backends de plataformas, focado em escalabilidade, manutenibilidade e produtividade. Construído com **NestJS**, ele segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## 🚀 Tecnologias

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Banco de Dados**: PostgreSQL 17 (configurado via Docker)
- **Linting & Formatação**: [Biome](https://biomejs.dev/)
- **Testes**: [Vitest](https://vitest.dev/)
- **Autenticação**: Passport JWT & Bcryptjs
- **Validação**: Zod
- **Logs**: Winston
- **Documentação**: [Swagger/OpenAPI](https://swagger.io/)
- **Provider de Email**: SendGrid
- **Automação**: Plop

## 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura modular baseada em DDD para separação clara de responsabilidades:

```text
src/
├── modules/              # Módulos de domínio da aplicação
│   ├── [nome-do-modulo]/
│   │   ├── application/  # Casos de uso, interfaces de repositórios
│   │   ├── domain/       # Entidades e regras de domínio puras
│   │   └── infra/        # Adaptadores (controllers, mappers, repositórios prisma, DTOs)
├── shared/               # Recursos compartilhados transversais
│   ├── database/         # Configuração do Prisma
│   ├── exceptions/       # Filtros e tratamentos de erro globais
│   ├── http/             # Middlewares e interceptores
│   ├── libs/             # Integrações com libs externas (Nest config, Swagger)
│   ├── services/         # Serviços compartilhados (Env, Logger, Mail)
│   ├── types/            # Tipagens globais
│   └── utils/            # Helpers e utilitários
├── app.module.ts         # Módulo raiz
└── main.ts               # Ponto de entrada
```

## 🛠️ Scripts Disponíveis

| Script | Descrição |
| :--- | :--- |
| `pnpm build` | Compila o projeto para o diretório `dist` |
| `pnpm start` | Inicia a aplicação |
| `pnpm start:dev` | Inicia a aplicação em modo *hot-reload* |
| `pnpm start:debug` | Inicia a aplicação em modo *debug* |
| `pnpm start:prod` | Inicia a aplicação em produção |
| `pnpm lint` | Executa o linting do projeto |
| `pnpm lint:fix` | Corrige problemas de lint e formata o código com Biome |
| `pnpm lint:ci` | Executa o linting no CI |
| `pnpm test` | Executa a suíte de testes unitários com Vitest |
| `pnpm test:watch` | Executa os testes em modo *watch* |
| `pnpm test:coverage` | Gera relatório de cobertura de testes |
| `pnpm types:check` | Executa a verificação de tipos |
| `pnpm db:generate` | Sincroniza o cliente Prisma com o schema |
| `pnpm db:pull` | Atualiza o schema Prisma a partir de um banco existente |
| `pnpm db:migrate` | Executa as migrações em desenvolvimento |
| `pnpm db:migrate:deploy` | Aplica migrações em produção |
| `pnpm db:studio` | Abre o Prisma Studio |
| `pnpm gen` | Executa o gerador de módulos (**Plop**) |

## 🏁 Começando

### Pré-requisitos

- Node.js (conforme `.nvmrc`)
- pnpm
- Docker & Docker Compose

### Instalação e Configuração

1. **Instale as dependências**:
   ```bash
   pnpm install
   ```

2. **Configure o ambiente**:
   Copie `.env.example` para `.env` e ajuste as credenciais.

3. **Inicie a infraestrutura**:
   O projeto utiliza perfis de Docker Compose para facilitar o desenvolvimento:
   ```bash
   # Para desenvolvimento (com PostgreSQL)
   docker-compose --profile dev up -d
   ```

4. **Prepare o banco de dados**:
   ```bash
   pnpm db:generate
   ```

5. **Execute a aplicação**:
   ```bash
   pnpm start:dev
   ```

## 🤖 Automação (Plop)

Para acelerar o desenvolvimento e manter a consistência arquitetural, utilizamos o **Plop** para gerar novos módulos. O gerador cria automaticamente toda a estrutura de pastas e arquivos (Entity, Repository, Use Cases, Controller, DTO e Mapper) de acordo com o padrão do projeto.

Para gerar um novo módulo:
```bash
pnpm gen
```
Siga as instruções no terminal para definir o nome do módulo.

## 📖 Documentação da API

Quando a aplicação está em execução no modo de desenvolvimento, a documentação Swagger está disponível em:

- **URL**: `http://localhost:3001/docs` (ou a porta configurada no seu `.env`)

Esta interface permite testar os endpoints diretamente e entender os contratos de entrada e saída.

## 🧹 Qualidade de Código

Utilizamos o **Biome** como ferramenta única para linting e formatação, garantindo performance superior e configuração simplificada.

```bash
pnpm lint:fix
```
