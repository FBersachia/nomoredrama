# Servicios (API cliente)

Propósito: Consumo HTTP de contenido público y admin.

Patrones
- Axios `client` con `baseURL` en `VITE_API_URL` (fallback `/api`).
- React Query consume:
  - `fetchPublicContent`: GET `/v1/content`, retorna `PublicContent`.
  - `fetchAdminContent`: GET `/v1/admin/content` con header Bearer.
  - `loginAdmin`: POST `/v1/admin/login` -> `{ token }`.
  - `saveContent`: PUT `/v1/admin/content` con Bearer + payload.
 - Carga de assets: `VITE_ASSET_BASE` opcional se usa para prefijar paths relativos (ej: `Recursos/Fotos/...`) en frontend; si no existe, se usa `VITE_API_URL` sin el sufijo `/api`.
- Tipos en `src/types/content.ts` (bio, visuals, sets, collaborations, influences, contact).

Riesgos/decisiones
- Sin interceptors de auth/refresh; token se pasa manualmente.
- No hay manejo global de errores; cada vista decide fallback (ej: HomePage muestra card de error).***
