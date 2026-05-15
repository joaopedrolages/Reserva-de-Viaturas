# Gestão e reserva de viaturas

Aplicação web completa para gestão de viaturas de empresa, reservas semanais e registo posterior da devolução efetiva com quilómetros e descrição/processo da atividade.

## Stack

- Frontend: React 18, Vite, TypeScript, TailwindCSS, React Query, Axios, FullCalendar, React Hook Form e Zod.
- Backend: Node.js, Express, TypeScript, Prisma ORM e MySQL.
- Base de dados: MySQL, schema `geo`.

## Estrutura

```txt
.
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src
│       ├── controllers
│       ├── middlewares
│       ├── repositories
│       ├── routes
│       ├── schemas
│       └── services
├── frontend
│   └── src
│       ├── components
│       ├── hooks
│       ├── pages
│       ├── services
│       ├── types
│       └── utils
└── docker-compose.yml
```

## Arranque com Docker

```bash
docker compose up --build
```

Serviços:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api
- MySQL: localhost:3306, base de dados `geo`

O container do backend executa `prisma migrate deploy`, aplica a migration inicial e corre o seed com viaturas de exemplo.

## Arranque local

1. Instalar dependências:

```bash
npm install
```

2. Criar ficheiros `.env` a partir dos exemplos:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Garantir que existe uma base de dados MySQL chamada `geo` e ajustar `backend/.env`:

```env
DATABASE_URL="mysql://geo_user:geo_password@localhost:3306/geo"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

4. Preparar Prisma:

```bash
npm run prisma:generate --workspace backend
npm run migrate --workspace backend
npm run seed --workspace backend
```

5. Iniciar frontend e backend:

```bash
npm run dev
```

## Scripts úteis

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run migrate --workspace backend
npm run seed --workspace backend
```

## API

### Viaturas

- `GET /api/viaturas` lista todas as viaturas.
- `POST /api/viaturas` cria uma viatura.

Exemplo:

```json
{
  "Nome": "Ford Transit - 32-AB-10"
}
```

### Reservas

- `GET /api/reservas` lista todas as reservas da frota, incluindo a viatura associada.
- `GET /api/reservas/:idViatura` lista reservas de uma viatura.
- `POST /api/reservas` cria uma reserva, validando conflitos no backend.
- `PATCH /api/reservas/:id` atualiza apenas dados de devolução.

Exemplo de criação:

```json
{
  "IDViatura": 1,
  "NomeCondutor": "Ana Martins",
  "DataInicio": "2026-05-18T09:00:00.000Z",
  "DataFim": "2026-05-18T12:00:00.000Z"
}
```

Exemplo de devolução parcial ou completa:

```json
{
  "datafimreal": "2026-05-18T11:45:00.000Z",
  "km": 128,
  "processo": "Visita técnica ao cliente"
}
```

## Regras implementadas

- Não é possível criar reservas sobrepostas para a mesma viatura.
- A data fim da reserva tem de ser posterior à data início.
- A data fim real não pode ser anterior à data início.
- `km` aceita apenas inteiros iguais ou superiores a 0.
- Dados de devolução podem ser guardados parcialmente.
- Reservas sem `datafimreal` aparecem como ativas/futuras.
- Reservas com `datafimreal` aparecem como concluídas.

## Notas de utilização

No frontend, escolha uma viatura no painel lateral, selecione um período no calendário semanal e preencha o modal de reserva. Para registar ou editar a devolução, clique numa reserva no calendário ou use a ação na lista abaixo do calendário.
