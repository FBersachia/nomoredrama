# Estructura de archivos — Nomoredrama

Rutas clave y propósito de cada carpeta/archivo. Actualiza si cambia la estructura.

## Raiz
- `start-project.md` — blueprint de arranque de sesiones.
- `prd.md` — requisitos del producto.
- `content_sources.md` — checklist para cargar contenido real.
- `tasklist.md` — pendientes priorizados.
- `recursos/` — materiales de contexto y assets fuente (no exponer secretos).

## Recursos
- `recursos/original-prompt.md` — visión estética y secciones solicitadas.
- `Recursos/logo.png` — logo 1024x1024.
- `Recursos/Fotos/` — imágenes locales (optimizar ~1600px/<400KB).

## Frontend (esperado)
- `frontend/` — SPA React/Vite.
  - `src/`
    - `pages/` — vistas principales (Home, Admin).
    - `components/` — UI reutilizable (hero, galerías, cards, CTA, embeds).
    - `hooks/` — lógica compartida (data fetching, auth).
    - `services/` — clientes API (Axios, React Query).
    - `styles/` — temas, variables, globales.
    - `types/` — tipos compartidos (DTOs).
  - `public/` — assets estáticos accesibles.
  - `vite.config.ts`, `tsconfig.json`, `package.json`.

## Backend (esperado)
- `backend/` — API Express serverless-friendly.
  - `src/`
    - `app.ts` / `server.ts` — bootstrap Express.
    - `routes/` — rutas públicas (`/content`) y admin (`/admin`).
    - `controllers/` — lógica HTTP.
    - `services/` — reglas de negocio y orquestación.
    - `models/` — definiciones Sequelize.
    - `migrations/`, `seeders/` — esquema y datos iniciales.
    - `middlewares/` — auth JWT, validación, manejo de errores.
    - `schemas/` — validaciones Zod para requests/responses.
    - `config/` — conexión DB, env, CORS.
    - `utils/` — helpers puntuales.
  - `package.json`, `tsconfig.json`, `sequelize` config.

## Docs (sugerido)
- `docs/` — specs complementarias:
  - `especificacion_funcional.md` — flujos (visitante/admin).
  - `especificacion_tecnica.md` — arquitectura, endpoints, modelos.
  - `TESTING.md` — estrategia y comandos.
  - `SETUP.md` — instrucciones locales/Vercel/Supabase.
  - `DEPLOYMENT.md` — pasos a prod.
  - `TODO.md` / `tasklist-*.md` — pendientes.
  - `errors.md` — problemas comunes y fixes.
  - `context/` — instrucciones AI, `session_log.md`.

## Notas
- Solo imágenes locales en `Recursos/Fotos/`; videos via embed (YouTube/Vimeo).
- Admin requiere auth JWT; no almacenar secretos en frontend. Guardar credenciales y URLs en `.env` (no versionado).
