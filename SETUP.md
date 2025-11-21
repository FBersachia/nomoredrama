# SETUP — Nomoredrama

## Prerrequisitos
- Node.js 20+
- npm
- PostgreSQL accesible (local o Supabase)

## Backend (local)
1) `cd backend`
2) `cp .env.example .env` y ajustar:
   - `DATABASE_URL=postgres://postgres:mce775Postgre@localhost:5432/nomoredrama` (o tu DB)
   - `JWT_SECRET` a un valor seguro
   - `CORS_ORIGIN` con los orígenes permitidos (p.ej. `http://localhost:5173`)
3) Instalar deps: `npm install --legacy-peer-deps`
4) Crear DB (si no existe): `createdb nomoredrama` (o via psql)
5) Migraciones: `npx sequelize-cli db:migrate`
6) Seeds demo: `npx sequelize-cli db:seed:all`
7) Arrancar: `npm run dev` (API en `http://localhost:3001`; el puerto est�� forzado a 3001)

## Frontend (local)
1) `cd frontend`
2) `cp .env.example .env` y setear `VITE_API_URL=http://localhost:3001/api`
3) Instalar deps: `npm install`
4) Correr: `npm run dev` (Vite en `http://localhost:5173`; el puerto est�� forzado a 5173 con `strictPort`)

## Notas
- Admin demo: `admin@example.com` / `changeme` (cambiar antes de prod).
- Imágenes locales deben vivir en `Recursos/Fotos/...`; referenciar esos paths en el contenido.
- Para tests backend: `cd backend && npm test` (Vitest).
