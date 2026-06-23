# Frontend — Gestão Carnes Pedidos

Interface React do sistema de gestão de carnes e pedidos.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm start` | Alias para `dev` |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:watch` | Testes em modo watch |

## Estrutura principal

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ErrorHandlerProvider.tsx   # Handler global de erros
│   └── CotacaoCard.tsx            # Cotações USD/EUR
├── pages/               # Páginas por módulo (carnes, compradores, pedidos)
├── services/
│   ├── api.ts           # Cliente Axios da API backend
│   └── cotacaoService.ts # Integração AwesomeAPI
├── utils/
│   ├── errorMessages.ts # Mensagens amigáveis de erro
│   └── format.ts        # Formatação de moeda e data
└── tests/               # Testes unitários (na raiz do frontend)
```

## Integração AwesomeAPI

O serviço `cotacaoService.ts` consome a [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) para obter cotações USD/BRL e EUR/BRL.

- Endpoint padrão: `/cotacao/json/last/USD-BRL,EUR-BRL` (proxy Vite em desenvolvimento)
- Conversão: `convertToBrl(valor, cotacao)` usa a cotação de compra (`bid`)

Exemplo exibido na home: US$ 10 e € 10 convertidos para BRL.

## Tratamento de erros

O `ErrorHandlerProvider` envolve a aplicação e expõe o hook `useErrorHandler()`:

```tsx
const { notifyError, notifySuccess } = useErrorHandler()

try {
  await createCarne(payload)
  notifySuccess('Carne cadastrada com sucesso.')
} catch (error) {
  notifyError(error)
}
```

Mensagens são normalizadas em `utils/errorMessages.ts` (rede, timeout, HTTP 4xx/5xx).

## Proxy de desenvolvimento

Configurado em `vite.config.ts`:

- `/api` → `http://localhost:5005`
- `/cotacao` → `https://economia.awesomeapi.com.br`

## Testes

```bash
npm test
```

Arquivos em `tests/`:
- `cotacaoService.test.ts` — parsing e conversão de moedas
- `errorMessages.test.ts` — mensagens amigáveis
- `format.test.ts` — utilitários de formatação

## Requisitos

- Backend rodando em `http://localhost:5005` para os CRUDs
- Conexão com internet para cotações (AwesomeAPI)
