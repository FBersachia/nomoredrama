# Auth y protección admin

Flujo actual:
- POST `/api/v1/admin/login`: valida payload con Zod (`adminLoginSchema`), verifica admin_users con bcrypt async, emite JWT con `sub`, `email`, `role=admin`, `jti`, exp 30m.
- POST `/api/v1/admin/logout`: requiere Bearer; invalida token agregando `jti` a blacklist en memoria hasta su exp.
- Middleware `requireAuth`: espera `Authorization: Bearer <token>`, verifica firma y `role=admin`, revisa blacklist, valida que el admin exista; 401 en error.
- Rutas protegidas: GET/PUT `/api/v1/admin/content` y POST `/api/v1/admin/logout`.

Pendientes / decisiones:
- Blacklist es en memoria (no compartida); para despliegue multi-instance/serverless, mover a store compartido (Redis/Supabase).
- Considerar TTL más corto + refresh token o re-login simple (1 admin).
- Agregar logging estructurado y métricas de intentos/bloqueos.
- Rotar password seed en prod; JWT secret fuerte (16+ chars, ideal 32+).***
