# Tasklist — Nomoredrama

## Backend
- [x] Definir y crear modelos Sequelize para visuals, sets, collaborations, influences, contact, admin_users (con migraciones y seed opcional).
- [x] Implementar validaciones Zod en controladores/admin y respuestas consistentes.
- [x] Reemplazar login hardcoded por consulta a admin_users con hash seguro.
- [x] Añadir seeds de contenido demo (bio + 1-2 items por sección).
- [x] Ajustar CORS y configuración de Vercel/Supabase (env vars).
- [ ] Endurecer JWT: rol obligatorio, TTL corto, blacklist/refresh, logging.
- [ ] Mejorar upsert de contenido con diff y preservar metadata (parcial: IDs/upsert ya vivo, falta logging/tests).
- [ ] Agregar logging/monitoring y healthcheck con ping a DB.

## Frontend
- [x] Diseñar layout Y2K/cyberpunk: hero con logo (`Recursos/logo.png`), tipografía y paleta definidas.
- [x] Implementar secciones reales: Bio, Visuales (galería), Sets (embeds), Colaboraciones, Influencias, Contacto.
- [x] Mejorar UX CTA WhatsApp (mensaje prellenado, botones flotantes/mobile-friendly).
- [ ] Construir panel admin completo: login persistente, formularios con RHF+Zod para cada sección, previsualización básica (parcial: persistencia + IDs, falta resolver Zod y previews).
- [x] Estados de loading/error y accesibilidad (focus, contraste, alt text).

## Infra/DevOps
- [x] Crear `.env.example` en backend/frontend con claves requeridas.
- [ ] Configurar scripts de migraciones/seed para Supabase en Vercel pipeline (no durante build).
- [ ] Agregar lint/format y hooks si se requieren (pre-commit opcional).

## Testing
- [x] Agregar tests backend (auth, CRUD content, validaciones).
- [x] Agregar tests frontend críticos (render público, CTA WhatsApp, flujos admin).

## Docs
- [x] Completar `SETUP.md` (local + Vercel + Supabase).
- [x] Completar `DEPLOYMENT.md` (vars, migraciones, rutas).
- [ ] Documentar errores comunes en `errors.md` a medida que surjan.
