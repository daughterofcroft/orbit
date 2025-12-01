## orbit – RISC-V Instruction Decoder

`orbit` is a small RISC-V RV32I instruction visualiser and decoder.

- **Frontend**: Vite + React + Mantine (see `frontend/`)
- **Backend**: NestJS API that decodes 32-bit RV32I instructions (see `api/`)

### Quick start (development)

# install deps (from repo root, using pnpm workspace)
pnpm install

# start backend
cd api
pnpm start:dev

# in another terminal, start frontend
cd ../frontend
pnpm dev### Production

- **API**: `cd api && pnpm build && pnpm start:prod`
- **Frontend**: `cd frontend && pnpm build` (serves static files from `dist/`)
- Configure:
  - `FRONTEND_ORIGIN` for the API CORS origin (default `http://localhost:5173`)
  - `VITE_API_URL` for the frontend API base URL (default `http://localhost:3000`)
