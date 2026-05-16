# NileLock Simulator

Campus lock display simulator (React + Vite). Connects to the NileLock API and public WebSocket channel.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Runs on http://localhost:5174

## Production build

```bash
npm run build
npm run start
```

Set `VITE_API_URL` at **build time** (Docker `ARG`, Easypanel env, or `.env`).

## Deploy (Easypanel)

- **Nixpacks** (default): uses `nixpacks.toml`, Node 22 (`.nvmrc`), `Caddyfile` serves `dist/`.
- **Dockerfile**: multi-stage build + `serve` on `PORT` (default 3000).
