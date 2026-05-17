# JS Playground

A full-stack JavaScript playground where you can write and run JavaScript code in the browser, solve classic DSA problems, save code snippets, and install npm packages for use inside the editor.

## Features

- Monaco editor with syntax highlighting and dark theme
- Run JavaScript code with `console.log` output capture
- 13 classic DSA problems (Easy → Hard) with test cases
- Save and manage code snippets
- Install npm packages and use them via `require()` in your code
- Code templates (Hello World, Fibonacci, Sorting, etc.)

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, shadcn/ui |
| Editor    | Monaco Editor (`@monaco-editor/react`) |
| API       | Express 5, Node.js 24               |
| Database  | PostgreSQL + Drizzle ORM            |
| Validation| Zod v4, drizzle-zod                 |
| API hooks | Orval (generated from OpenAPI spec) |
| Monorepo  | pnpm workspaces                     |

## Project Structure

```
├── artifacts/
│   ├── api-server/        # Express API server (port 8080)
│   └── js-playground/     # React + Vite frontend
├── lib/
│   ├── db/                # Drizzle schema + migrations
│   ├── api-spec/          # OpenAPI spec (source of truth)
│   ├── api-client-react/  # Generated React Query hooks
│   └── api-zod/           # Generated Zod schemas
├── scripts/               # Utility scripts (seed, etc.)
│   └── import.sql         # Full DB import (schema + seed data)
└── pnpm-workspace.yaml
```

## Local Setup

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- [pnpm](https://pnpm.io) — `npm install -g pnpm`
- [PostgreSQL](https://www.postgresql.org) running locally

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example env files and fill in your values:

```bash
cp .env.example artifacts/api-server/.env
```

Edit `artifacts/api-server/.env` with your local Postgres credentials.

### 3. Set up the database

**Option A — SQL import (recommended, single step):**

```bash
# Create the database first
createdb -U postgres jsplayground

# Import schema + all seed data
psql -U postgres -d jsplayground -f scripts/import.sql
```

**Option B — Drizzle push + seed script:**

```bash
# Push schema via Drizzle
pnpm --filter @workspace/db run push

# Seed DSA problems
pnpm --filter @workspace/scripts run seed-problems
```

### 4. Add a Vite proxy (frontend → API)

Add the following to `artifacts/js-playground/vite.config.ts` inside `server: { ... }`:

```ts
proxy: {
  '/api': 'http://localhost:8080'
}
```

### 5. Start the API server

Open a terminal and run:

```bash
cd artifacts/api-server
PORT=8080 pnpm run dev
```

The API will be available at `http://localhost:8080/api`.

### 6. Start the frontend

Open a second terminal and run:

```bash
cd artifacts/js-playground
PORT=5173 BASE_PATH=/ pnpm run dev
```

Open `http://localhost:5173` in your browser.

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm run typecheck` | Full TypeScript check across all packages |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev only) |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks from OpenAPI spec |
| `pnpm --filter @workspace/scripts run seed-problems` | Re-seed DSA problems |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | Yes | Port for the API server (e.g. `8080`) |
| `SESSION_SECRET` | Yes | Secret string for session signing |
| `NODE_ENV` | No | `development` or `production` (default: `development`) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/code/run` | Execute JavaScript code |
| `GET` | `/api/problems` | List all DSA problems |
| `GET` | `/api/problems/:id` | Get a single problem |
| `GET` | `/api/problems/stats` | Problem count by difficulty |
| `GET` | `/api/snippets` | List saved snippets |
| `POST` | `/api/snippets` | Save a new snippet |
| `DELETE` | `/api/snippets/:id` | Delete a snippet |
| `GET` | `/api/packages` | List installed npm packages |
| `POST` | `/api/packages` | Install an npm package |
| `DELETE` | `/api/packages/:name` | Remove an npm package |
