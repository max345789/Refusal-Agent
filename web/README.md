# Refusal Bot — Web App

Production-ready frontend for Refusal Bot (Next.js, TypeScript, Tailwind, Framer Motion, React Query).

## Run locally

```bash
cd web
npm install
cp .env.example .env.local
# Optional: set NEXT_PUBLIC_API_URL if your API is not at http://localhost:3001
npm run dev
```

Open **http://localhost:3000**.

**Note:** If your backend runs on port 3000, run it on another port (e.g. 3001) and set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local`.

## Scripts

- `npm run dev` — Dev server (default port 3000)
- `npm run build` — Production build
- `npm run start` — Run production build

## Features

- **Landing** — Hero, problem, how it works, features, pricing, CTA, footer
- **Dashboard** — Stats, analyze-refund form, links to tickets/analytics
- **Tickets** — Table with expandable rows (customer message, decision, policy clause, response, alternative)
- **Analytics** — Charts (refund requests, denied, revenue saved)
- **Store setup** — Create store, paste policy, get API key, webhook endpoint
- **Settings** — Save store API key (browser only)

API key is stored in `localStorage`; set it in Settings or create a store in Stores.
