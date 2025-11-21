# Servicios (lógica de dominio)

`src/services/contentService.ts`
- `getContent()`: trae bio + colecciones ordenadas + contacto (plain objects).
- `updateContent(raw)`: valida con Zod (`contentSchema`), hace upsert de bio/contact y upsert+prune de arrays. Usa IDs opcionales para preservar registros y borra solo lo que no llega en payload; `updateOnDuplicate` mantiene `createdAt`.
- Orden por `order` o índice si no se envía; espera rutas locales en imagePath y URLs de embed/redes.

`src/services/authService.ts`
- `validateAdminCredentials(email, password)`: busca en admin_users y compara bcrypt async; devuelve admin o null.

Static/Assets
- Express expone `/Recursos` apuntando a `../Recursos` (bk/src/app.ts) para servir `Recursos/Fotos/...` y `logo.png` al frontend. Mantener assets optimizados y paths relativos al root (`Recursos/Fotos/...`).

Pendientes
- Logging/monitoring en servicios y métricas de errores.
- Mejorar health en `/api/health` para chequear DB y exponer tiempos.
- Considerar caché para contenido público (TTL corto) e invalidar tras update.***
