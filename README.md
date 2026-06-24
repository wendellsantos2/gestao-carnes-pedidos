# Gestão de Carnes e Pedidos

Sistema full stack para cadastro de **carnes**, **compradores** e **pedidos**, com API REST em .NET 8 e interface React.

## Estrutura do projeto

```
gestao-carnes-pedidos/
├── backend/                 # API REST (.NET 8, EF Core, SQL Server)
│   ├── WebApi/              # Ponto de entrada da API
│   ├── Infra/               # EF Core, migrations e repositórios
│   └── Database/            # Script SQL opcional (criação manual do banco)
├── frontend/                # Interface React (Vite, TypeScript, MUI)
├── docker-compose.yml       # Orquestração Docker (api + web, SQLite)
└── README.md
```

## Pré-requisitos

Instale antes de começar:


| Ferramenta                                        | Versão mínima | Verificar instalação                           |
| ------------------------------------------------- | ------------- | ---------------------------------------------- |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | —   | `docker --version` e `docker compose version`  |
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0           | `dotnet --version`                             |
| [Node.js](https://nodejs.org/)                    | 18+           | `node --version`                               |
| SQL Server ou **LocalDB**                         | —             | Incluído no Visual Studio / SQL Server Express |


> **Windows:** o projeto usa **LocalDB** por padrão (`(localdb)\MSSQLLocalDB`). Não é necessário instalar SQL Server completo para desenvolvimento local.

## Rodar com Docker (recomendado)

A forma mais simples de subir o sistema (API + frontend). No Docker usamos **SQLite** em volume — sem container de SQL Server, sobe em segundos.

### Pré-requisito

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução

### Comandos

Na raiz do projeto:

```bash
docker compose up --build
```

Na primeira execução o Docker compila backend e frontend e cria o banco SQLite com dados de exemplo.

> **Desenvolvimento local (sem Docker)** continua usando SQL Server / LocalDB com migrations EF.

### Acessos


| Recurso        | URL                                                            |
| -------------- | -------------------------------------------------------------- |
| Interface web  | [http://localhost:8080](http://localhost:8080)                 |
| API / Swagger  | [http://localhost:5005](http://localhost:5005) (abre o Swagger automaticamente) |


### Parar os containers

```bash
docker compose down
```

Para remover também o volume do banco (dados apagados):

```bash
docker compose down -v
```

## Como rodar localmente

Siga os passos na ordem abaixo.

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd gestao-carnes-pedidos
```

### 2. Configurar o banco de dados

A connection string padrão está em `backend/WebApi/appsettings.Development.json`:

```
Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=SistemaPedidosCarnes;...
```

> **Não é necessário criar um banco vazio antes.** O comando `dotnet ef database update` cria automaticamente o banco `SistemaPedidosCarnes` (se ainda não existir), aplica todas as migrations e cria as tabelas. Você só precisa ter o **LocalDB** (ou SQL Server) instalado e acessível.

Aplique as migrations:

```bash
cd backend/Infra
dotnet ef database update --startup-project ../WebApi
cd ../..
```

Se o comando `dotnet ef` não for reconhecido, instale a ferramenta uma vez:

```bash
dotnet tool install --global dotnet-ef
```

**Alternativa (script SQL):** execute `backend/Database/SistemaPedidosCarnes.sql` no SQL Server Management Studio — nesse caso o script já cria o banco, as tabelas e os dados iniciais (dispensa o `dotnet ef`).

Na primeira execução da API, o **seed** popula carnes, compradores e pedidos de exemplo automaticamente (quando as tabelas existem mas estão vazias).

### 3. Subir o backend (API)

Abra um terminal:

```bash
cd backend/WebApi
dotnet run
```


| Recurso                | URL                                                            |
| ---------------------- | -------------------------------------------------------------- |
| API                    | [http://localhost:5005](http://localhost:5005)                 |
| Swagger (documentação) | [http://localhost:5005/swagger](http://localhost:5005/swagger) |


Aguarde a mensagem indicando que a aplicação está escutando na porta **5005** antes de iniciar o frontend.

### 4. Subir o frontend

Abra **outro terminal**:

```bash
cd frontend
npm install
npm run dev
```


| Recurso       | URL                                            |
| ------------- | ---------------------------------------------- |
| Interface web | [http://localhost:5173](http://localhost:5173) |


O Vite faz proxy das requisições:

- `/api` → `http://localhost:5005` (backend)
- `/cotacao` → AwesomeAPI (cotações USD/EUR)

> Não é obrigatório criar arquivo `.env` em desenvolvimento. Os valores padrão e o proxy já funcionam. Veja `frontend/.env.example` se precisar customizar.

### 5. Acessar o sistema

1. Abra [http://localhost:5173](http://localhost:5173) no navegador
2. Use o menu lateral para navegar entre **Carnes**, **Compradores** e **Pedidos**
3. Consulte a API em [http://localhost:5005/swagger](http://localhost:5005/swagger)

## Resumo rápido (dois terminais)

**Terminal 1 — Backend:**

```bash
cd backend/WebApi
dotnet run
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm install   # apenas na primeira vez
npm run dev
```

## Funcionalidades

### Carnes

- Cadastro com **descrição** e **origem** (Bovina, Suína, Aves, Peixes)
- Listagem por Id, nome e origem
- Exclusão bloqueada se a carne tiver pedidos vinculados

### Compradores

- Cadastro com **nome**, **documento (CPF/CNPJ)**, **cidade** e **estado**
- **Estado** e **cidade** via combobox com listas pré-definidas; opção **"Outro"** permite informar UF e nome da cidade manualmente (útil quando a localidade não está na lista)
- Listagem por Id, nome e documento
- Exclusão bloqueada se o comprador tiver pedidos vinculados

### Pedidos

- Cadastro com **data**, **comprador**, itens com **carne**, **preço livre**, **moeda** (BRL/USD/EUR) e **quantidade**
- Listagem com totais convertidos para **Real (BRL)** via [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas)
- Filtros por comprador e intervalo de datas

## Testes

### Frontend

```bash
cd frontend
npm test
```

Cobertura atual: cotações, validações de formulário, filtros de pedidos, formatação e mensagens de erro.

### Build de produção (frontend)

```bash
cd frontend
npm run build
npm run preview
```

## Variáveis de ambiente (frontend)

Opcional. Copie `frontend/.env.example` para `frontend/.env` se necessário:


| Variável               | Descrição            | Padrão em dev                        |
| ---------------------- | -------------------- | ------------------------------------ |
| `VITE_API_URL`         | URL base da API      | `/api` (proxy Vite)                  |
| `VITE_COTACAO_API_URL` | Endpoint de cotações | `/cotacao/json/last/USD-BRL,EUR-BRL` |


## Solução de problemas

### Docker: build do frontend falha (EIO / npm)

- Erro `TAR_ENTRY_ERROR EIO` costuma ser disco cheio ou problema de I/O do Docker Desktop no Windows.
- Tente: **Docker Desktop → Settings → Resources** (aumente disco) e `docker system prune -a`
- O Dockerfile do frontend usa `node:20-bookworm-slim` (mais estável que Alpine no Windows).

### Docker: `dotnet.runtimeconfig.json` vazio / exit code 147

Cache corrompido da imagem .NET no Docker Desktop. Rode na raiz do projeto:

```powershell
docker builder prune -af
docker pull mcr.microsoft.com/dotnet/sdk:8.0.404-bookworm-slim
docker pull mcr.microsoft.com/dotnet/aspnet:8.0.16-bookworm-slim
docker compose build --no-cache
docker compose up
```

Se persistir, reinicie o Docker Desktop ou aumente o disco virtual em **Settings → Resources**.

### Docker: API sem dados

- Confirme que os dois containers estão rodando: `docker compose ps`
- A interface em **8080** usa proxy interno para a API; acesse [http://localhost:8080](http://localhost:8080), não o build estático sem proxy.

### `dotnet ef` não encontrado

Instale a ferramenta global:

```bash
dotnet tool install --global dotnet-ef
```

### Erro de conexão com o banco

- Verifique se o LocalDB está instalado e em execução
- Confirme que as migrations foram aplicadas (`dotnet ef database update`)
- Ajuste a connection string em `backend/WebApi/appsettings.Development.json` se usar SQL Server em outra instância

### Frontend não carrega dados / erro de CORS

- Confirme que o backend está rodando em **[http://localhost:5005](http://localhost:5005)**
- Reinicie o frontend após subir o backend
- Em desenvolvimento, use o proxy do Vite (`npm run dev`) em vez de abrir o build estático sem proxy

### Porta 5005 ou 5173 já em uso

- Encerre o processo que ocupa a porta, ou
- Altere a porta no `launchSettings.json` (backend) e em `vite.config.ts` (frontend + proxy)

### Cotações não aparecem na listagem de pedidos

- Verifique sua conexão com a internet (AwesomeAPI é consumida em tempo real)
- Os valores em BRL ainda são exibidos com os dados já carregados; a conversão depende da API externa

## Tecnologias


| Camada   | Stack                                                      |
| -------- | ---------------------------------------------------------- |
| Backend  | .NET 8, EF Core, SQL Server, Swagger                       |
| Frontend | React 18, TypeScript, Vite, MUI, Axios, React Router       |
| Cotações | [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) |
| Testes   | Vitest                                                     |


## Licença

Projeto acadêmico / demonstração.