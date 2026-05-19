# Gestao e reserva de viaturas

Aplicacao web para gerir viaturas de empresa, reservas semanais e registo posterior da devolucao efetiva com quilometros e descricao/processo da atividade.

## Versao 2: app autonoma

A aplicacao deixou de estar dividida em `frontend` e `backend`. Agora existe uma unica app em `app/`.

O mesmo processo Node/Express:

- serve a API em `/api`
- liga ao MySQL definido em `DATABASE_URL` via Prisma
- serve o build React gerado pelo Vite

Isto permite publicar tudo num unico container Docker. A base de dados MySQL continua externa ou noutro servidor/container.

> Nota: uma app React pura no browser nao deve ligar diretamente ao MySQL, porque exporia credenciais da base de dados. Por isso a app e autonoma no deploy, mas mantem uma camada interna de servidor para falar com o MySQL de forma segura.

## Stack

- React 18, Vite, TypeScript, TailwindCSS, React Query, Axios, FullCalendar, React Hook Form e Zod
- Node.js, Express, TypeScript, Prisma ORM e MySQL
- Docker Compose para publicar um unico servico `app`

## Estrutura

```txt
.
|-- app
|   |-- prisma
|   |   |-- migrations
|   |   |-- schema.prisma
|   |-- server
|   |   |-- controllers
|   |   |-- middlewares
|   |   |-- repositories
|   |   |-- routes
|   |   |-- schemas
|   |   `-- services
|   `-- src
|       |-- components
|       |-- hooks
|       |-- pages
|       |-- services
|       |-- types
|       `-- utils
|-- docker-compose.yml
`-- .env.example
```

## Configuracao

Crie um ficheiro `.env` na raiz a partir de `.env.example`:

```env
DATABASE_URL="mysql://utilizador:password@HOST_MYSQL:3306/NOME_DA_BASE"
PORT=4000
CORS_ORIGIN="http://localhost:4000,http://localhost:5173,http://127.0.0.1:5173"
APP_PORT=4000
VITE_API_URL="/api"
```

Para desenvolvimento local sem Docker, tambem pode criar `app/.env` com os mesmos valores de `DATABASE_URL`, `PORT`, `CORS_ORIGIN` e `VITE_API_URL`.

## Arranque com Docker

```bash
docker compose up --build
```

A app fica disponivel em:

- http://localhost:4000
- API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

O container nao executa migrations automaticamente no arranque, para poder usar bases MySQL existentes e ja preenchidas. Nao existe qualquer fonte de dados de teste: as viaturas e reservas apresentadas sao sempre lidas do MySQL configurado em `DATABASE_URL`.

A base MySQL configurada deve conter as tabelas `viaturas` e `reservas`. O endpoint `GET /api/health` valida a ligacao e confirma que essas tabelas conseguem ser lidas.

## Arranque local

```bash
cd app
npm install
npm run prisma:generate
npm run migrate
npm run dev
```

Em desenvolvimento, o Vite corre em `http://localhost:5173` e envia `/api` para `http://localhost:4000`.

## Scripts uteis

Na raiz:

```bash
npm run dev
npm run build
npm run lint
npm run migrate
```

Dentro de `app/`:

```bash
npm run dev
npm run build
npm run start
npm run migrate:deploy
```

Execute `npm run migrate:deploy` apenas quando quiser aplicar a migration Prisma numa base vazia ou numa base ja gerida pelo historico de migrations Prisma.

## API

### Viaturas

- `GET /api/viaturas` lista todas as viaturas.
- `POST /api/viaturas` cria uma viatura.

### Reservas

- `GET /api/reservas` lista todas as reservas da frota.
- `GET /api/reservas/:idViatura` lista reservas de uma viatura.
- `POST /api/reservas` cria uma reserva, validando conflitos no servidor.
- `PATCH /api/reservas/:id` atualiza os dados de devolucao.

## Regras implementadas

- Nao permite reservas sobrepostas para a mesma viatura.
- A data fim da reserva tem de ser posterior a data inicio.
- A data fim real nao pode ser anterior a data inicio.
- `km` aceita apenas inteiros iguais ou superiores a 0.
- Dados de devolucao podem ser guardados parcialmente.
- Reservas sem `datafimreal` aparecem como ativas/futuras.
- Reservas com `datafimreal` aparecem como concluidas.

## Utilizacao

O calendario semanal mostra todas as viaturas em conjunto, com uma cor por viatura. Ao selecionar uma viatura na lista, abre o modal de reserva ja associado a essa viatura. Tambem pode selecionar um periodo diretamente no calendario para criar uma reserva. Para registar ou editar a devolucao, clique na reserva ou use a acao na lista de reservas.
