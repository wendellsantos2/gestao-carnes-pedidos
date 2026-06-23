# Gestão de Carnes e Pedidos

Sistema full stack para cadastro de carnes, compradores e pedidos, com API REST em .NET 8 e frontend React.

## Estrutura do projeto

```
gestao-carnes-pedidos/
├── backend/          # API REST (.NET 8, EF Core, SQL Server)
├── frontend/         # Interface React (Vite, TypeScript, MUI)
└── README.md
```

## Funcionalidades

### Backend
- CRUD de carnes, compradores e pedidos
- Regras de negócio para status de pedidos e vínculos
- Swagger em `/swagger`
- Seed inicial de dados

### Frontend
- Layout responsivo com menu lateral
- CRUD completo das três entidades
- Integração com AwesomeAPI (cotação USD/EUR → BRL)
- Tratamento global de erros com mensagens amigáveis
- Testes unitários com Vitest

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server ou LocalDB

## Como executar

### 1. Backend

```bash
cd backend/WebApi
dotnet run
```

API disponível em `http://localhost:5005`  
Swagger: `http://localhost:5005/swagger`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Interface em `http://localhost:5173`

## Testes

### Frontend

```bash
cd frontend
npm test
```

Cobertura atual:
- Conversão de cotações (AwesomeAPI)
- Mensagens de erro amigáveis
- Formatação de moeda e data

## Variáveis de ambiente (frontend)

Copie `frontend/.env.example` para `frontend/.env` se necessário:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL da API backend | `/api` (proxy Vite) |
| `VITE_COTACAO_API_URL` | URL da AwesomeAPI | `/cotacao/json/last/USD-BRL,EUR-BRL` |

## Tecnologias

| Camada | Stack |
|--------|-------|
| Backend | .NET 8, EF Core, SQL Server, Swagger |
| Frontend | React 18, TypeScript, Vite, MUI, Axios, React Router |
| Cotações | [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) |
| Testes | Vitest |

## Entrega

O projeto está pronto para demonstração com:
- API documentada via Swagger
- Interface funcional com CRUDs integrados
- Cotações em tempo real na página inicial
- Erros exibidos de forma amigável ao usuário
- Testes automatizados no frontend
