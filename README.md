# Refusal Bot

Production-ready AI SaaS backend that analyzes ecommerce refund requests and generates policy-compliant responses. When a refund violates store policy, the system denies politely, cites the relevant clause, and suggests alternatives (store credit, replacement, discount, exchange).

## Tech stack

- **Backend:** Node.js, Express
- **AI:** OpenAI API (gpt-4o-mini)
- **Database:** PostgreSQL, Prisma ORM
- **Queue:** BullMQ with Redis
- **Validation:** Zod | **Logging:** Winston | **Tests:** Jest | **Containers:** Docker

## Quick start (local)

```bash
cd server
npm install
cp .env.example .env
# Set DATABASE_URL, REDIS_URL, OPENAI_API_KEY in .env
npm run db:generate
npm run db:push
npm run dev
```

Server: **http://localhost:3000**

- **Health:** `GET /health` → `{ "status": "ok" }`

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/analyze-refund` | API key | Analyze refund (sync or async) |
| POST | `/api/stores` | No | Create store (returns API key) |
| GET | `/api/stores` | API key | Get current store |
| GET | `/api/tickets` | API key | List refund tickets |
| GET | `/api/analytics` | API key | Store analytics |
| POST | `/api/webhooks/shopify/refund-request` | API key | Webhook: create ticket + queue |

**Authentication:** Send store API key in header:

- `X-API-Key: <your-store-api-key>`
- or `Authorization: Bearer <your-store-api-key>`

## Docker (local)

```bash
cd server
echo "OPENAI_API_KEY=sk-..." > .env
docker compose up --build
```

Runs: API on 3000, PostgreSQL on 5432, Redis on 6379, refund worker.

## Running the worker

For async refund analysis (webhook or `async: true`):

```bash
cd server
npm run worker
```

Requires Redis and PostgreSQL (same `.env` as API).

## Tests

```bash
cd server
npm test
```

Covers at least `GET /health` → `{ "status": "ok" }`.

---

## Deployment

### Railway

1. Create a new project; add **PostgreSQL** and **Redis** from the catalog.
2. Add a **Web Service** from your repo (or from Dockerfile). Root: `server` if monorepo.
3. Variables: `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY` (from the Postgres/Redis services or your own).
4. Build: use **Dockerfile** if you added one in `server/`, or set build command to `npm install && npx prisma generate` and start to `npx prisma migrate deploy && node src/server.js`.
5. Deploy. Optionally add a second service for the worker: same repo, start command `node src/workers/refundWorker.js`, same env.

### Render

1. **Blueprint (recommended):** Add `server/render.yaml` (see below) and connect the repo. Render will create Web Service + PostgreSQL + Redis + worker from the blueprint.
2. **Manual:** Create **PostgreSQL** and **Redis** instances. Create a **Web Service** from repo; root directory `server`; build `npm install && npx prisma generate`; start `npx prisma migrate deploy && node src/server.js`. Set env: `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`. Add a **Background Worker** with start `node src/workers/refundWorker.js` and same env.

Example `server/render.yaml`:

```yaml
services:
  - type: web
    name: refusal-bot-api
    runtime: node
    rootDir: server
    buildCommand: npm install && npx prisma generate
    startCommand: npx prisma migrate deploy && node src/server.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: refusal-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          type: redis
          name: refusal-redis
          property: connectionString
      - key: OPENAI_API_KEY
        sync: false
  - type: worker
    name: refusal-bot-worker
    runtime: node
    rootDir: server
    startCommand: node src/workers/refundWorker.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: refusal-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          type: redis
          name: refusal-redis
          property: connectionString
      - key: OPENAI_API_KEY
        sync: false
databases:
  - name: refusal-db
    plan: free
  - name: refusal-redis
    plan: free
```

(Adjust `fromDatabase`/`fromService` names to match what Render creates.)

### AWS

1. **RDS:** Create a PostgreSQL instance; note the endpoint and set `DATABASE_URL`.
2. **ElastiCache:** Create a Redis cluster (or use a small EC2 Redis); set `REDIS_URL`.
3. **Compute:** Run the API and worker on ECS (Fargate), EC2, or Lambda (API only; worker on ECS/EC2).
   - **ECS:** Build a Docker image from `server/Dockerfile`, push to ECR. Create a task definition with env from Secrets Manager or SSM. Run two services: one for the API (port 3000), one for the worker (same image, command `node src/workers/refundWorker.js`). Put behind an Application Load Balancer for the API.
   - **EC2:** Install Node, clone repo, set env, run `node src/server.js` and `node src/workers/refundWorker.js` (e.g. with systemd or PM2).
4. **Secrets:** Store `OPENAI_API_KEY` in AWS Secrets Manager or Parameter Store and inject into the task/instance.
5. **Migrations:** Run `npx prisma migrate deploy` in the API container or a one-off task before starting the app.

---

## Project structure (server)

```
server/
├── package.json
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── logs/
├── tests/
│   └── api.test.js
└── src/
    ├── server.js
    ├── app.js
    ├── ai/refundAnalyzer.js
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── services/
    ├── database/
    ├── workers/refundWorker.js
    └── utils/
```

This folder was renamed from `refusal-bot/` to `refusal-agent/`.
