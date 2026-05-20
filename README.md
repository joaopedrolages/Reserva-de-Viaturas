# Reserva de Viaturas

Aplicacao web para gestao e reserva de viaturas da empresa.

A aplicacao permite consultar viaturas existentes no MySQL, criar reservas, visualizar reservas num calendario semanal e registar posteriormente a devolucao efetiva da viatura com quilometros, processo, proposta e descricao.

## Estado Da Versao 1

- Aplicacao autonoma num unico projeto `app/`.
- O React e servido pelo mesmo processo Node/Express que disponibiliza a API.
- A API liga exclusivamente ao MySQL configurado em `DATABASE_URL`.
- Nao existe seed, mock, fallback local, localStorage ou dados virtuais.
- O Docker publica um unico servico: `app`.
- O container nao executa migrations automaticamente no arranque, para permitir usar bases MySQL existentes.

## Stack

- React 18
- Vite
- TypeScript
- TailwindCSS
- React Query
- Axios
- FullCalendar
- React Hook Form
- Zod
- Node.js
- Express
- Prisma ORM
- MySQL
- Docker Compose

## Estrutura

```txt
.
|-- app
|   |-- prisma
|   |   |-- migrations
|   |   `-- schema.prisma
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
|       |-- schemas
|       |-- services
|       |-- types
|       `-- utils
|-- docker-compose.yml
|-- package.json
`-- .env.example
```

## Configuracao

Crie um ficheiro `.env` na raiz do projeto, ao lado do `docker-compose.yml`.

Exemplo:

```env
DATABASE_URL="mysql://utilizador:password@HOST_MYSQL:3306/NOME_DA_BASE"
PORT=4000
CORS_ORIGIN="http://localhost:4000,http://localhost:5173,http://127.0.0.1:5173"
APP_PORT=4000
VITE_API_URL="/api"
```

Em Docker, o ficheiro usado e sempre:

```txt
Reserva-de-Viaturas/.env
```

O ficheiro `.env.example` e apenas um modelo. Nao e lido automaticamente pela aplicacao.

## Base De Dados

A aplicacao espera encontrar estas tabelas no MySQL indicado em `DATABASE_URL`.

### `viaturas`

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `ID` | int, primary key, auto increment | Sim |
| `Nome` | varchar(100) | Sim |

### `reservas`

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `ID` | int, primary key, auto increment | Sim |
| `IDViatura` | int, foreign key para `viaturas.ID` | Sim |
| `NomeCondutor` | varchar(100) | Sim |
| `DataInicio` | datetime | Sim |
| `DataFim` | datetime | Sim |
| `km` | int | Nao |
| `processo` | varchar(5), numerico | Nao |
| `proposta` | int, ate 6 digitos | Nao |
| `descricao` | varchar(250) | Nao |
| `datafimreal` | datetime | Nao |

## Docker

Na pasta raiz do projeto:

```powershell
docker compose build --no-cache app
docker compose up -d --force-recreate app
```

A aplicacao fica disponivel em:

```txt
http://localhost:4000
```

Ou pelo IP da maquina Docker:

```txt
http://IP_DA_MAQUINA:4000
```

Para consultar logs:

```powershell
docker compose logs -f app
```

Para validar a ligacao ao MySQL:

```powershell
curl http://IP_DA_MAQUINA:4000/api/health
```

Resposta esperada:

```json
{
  "database": "mysql",
  "mode": "standalone",
  "status": "ok",
  "tables": {
    "reservas": 0,
    "viaturas": 0
  }
}
```

## Desenvolvimento Local

```powershell
cd app
npm install
npm run prisma:generate
npm run dev
```

Em desenvolvimento:

- React/Vite: `http://localhost:5173`
- API Express: `http://localhost:4000/api`
- Health check: `http://localhost:4000/api/health`

## Scripts

Na raiz:

```powershell
npm run dev
npm run build
npm run lint
npm run migrate
npm run migrate:deploy
```

Dentro de `app/`:

```powershell
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run migrate
npm run migrate:deploy
```

Use `npm run migrate:deploy` apenas em bases vazias ou em bases ja geridas pelo historico de migrations Prisma.

## Funcionalidades

### Viaturas

- Lista todas as viaturas existentes no MySQL.
- Cada viatura aparece como cartao clicavel.
- Clicar numa viatura abre o modal para criar uma nova reserva dessa viatura.

### Calendario

- Mostra um calendario semanal com todas as viaturas.
- Cada viatura tem uma cor diferente.
- Apenas reservas ainda reservadas aparecem no calendario.
- Reservas concluidas nao aparecem no calendario.
- Clicar numa reserva no calendario abre o modal para criar uma nova reserva no mesmo periodo.
- Clicar numa reserva no calendario nao regista devolucao.

### Reservas

- A criacao de reserva valida campos obrigatorios.
- A data fim tem de ser posterior a data inicio.
- Reservas sobrepostas sao bloqueadas apenas contra reservas ainda reservadas.
- Reservas concluidas nao limitam reservas futuras.
- A validacao de conflitos acontece no frontend e no backend.

### Devolucao

O registo de devolucao e feito exclusivamente pela lista de reservas.

Campos:

- Data fim real
- Km percorridos
- Processo
- Proposta
- Descricao

Validacoes:

- `datafimreal` nao pode ser anterior a `DataInicio`.
- `km` deve ser inteiro igual ou superior a 0.
- `processo` aceita apenas numeros e no maximo 5 digitos.
- `proposta` aceita apenas numero inteiro ate 6 digitos.
- `descricao` aceita ate 250 caracteres.
- Pelo menos um dos campos `processo`, `proposta` ou `descricao` tem de ser preenchido.

## Estados

### Reservada

Reserva sem `datafimreal`.

Estas reservas:

- aparecem no calendario
- aparecem na lista de reservas
- contam para conflito de novas reservas

### Concluida

Reserva com `datafimreal`.

Estas reservas:

- nao aparecem no calendario
- nao aparecem na lista de reservas
- nao contam para conflito de novas reservas
- continuam guardadas no MySQL

## API

### Health

- `GET /api/health`

Valida a ligacao ao MySQL e a leitura das tabelas `viaturas` e `reservas`.

### Viaturas

- `GET /api/viaturas`
- `POST /api/viaturas`

Exemplo de criacao:

```json
{
  "Nome": "AA-BB-CC"
}
```

### Reservas

- `GET /api/reservas`
- `GET /api/reservas/:idViatura`
- `POST /api/reservas`
- `PATCH /api/reservas/:id`

Exemplo de criacao:

```json
{
  "IDViatura": 1,
  "NomeCondutor": "Joao Silva",
  "DataInicio": "2026-05-20T09:00:00.000Z",
  "DataFim": "2026-05-20T12:00:00.000Z"
}
```

Exemplo de devolucao:

```json
{
  "datafimreal": "2026-05-20T12:15:00.000Z",
  "km": 35,
  "processo": "12345",
  "proposta": 123456,
  "descricao": "Deslocacao a cliente"
}
```

## Atualizacao No Servidor Docker

Depois de novas alteracoes no GitHub:

```powershell
git pull
docker compose build --no-cache app
docker compose up -d --force-recreate app
docker compose logs -f app
```

## Notas Importantes

- A app nao cria dados de teste.
- Se aparecerem viaturas inesperadas, elas estao na base MySQL configurada em `DATABASE_URL`.
- Dentro de um container, `localhost` aponta para o proprio container, nao para a maquina host.
- Se o MySQL estiver na maquina Docker, use o IP da maquina ou `host.docker.internal`, conforme o ambiente.
