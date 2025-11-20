# Tasklist — Nomoredrama

## Backend
- [ ] Definir y crear modelos Sequelize para visuals, sets, collaborations, influences, contact, admin_users (con migraciones y seed opcional).
- [ ] Implementar validaciones Zod en controladores/admin y respuestas consistentes.
- [ ] Reemplazar login hardcoded por consulta a admin_users con hash seguro.
- [ ] Añadir seeds de contenido demo (bio + 1-2 items por sección).
- [ ] Ajustar CORS y configuración de Vercel/Supabase (env vars).

## Frontend
- [ ] Diseñar layout Y2K/cyberpunk: hero con logo (`Recursos/logo.png`), tipografía y paleta definidas.
- [ ] Implementar secciones reales: Bio, Visuales (galería), Sets (embeds), Colaboraciones, Influencias, Contacto.
- [ ] Mejorar UX CTA WhatsApp (mensaje prellenado, botones flotantes/mobile-friendly).
- [ ] Construir panel admin completo: login persistente, formularios con RHF+Zod para cada sección, previsualización básica.
- [ ] Estados de loading/error y accesibilidad (focus, contraste, alt text).

## Infra/DevOps
- [ ] Crear `.env.example` en backend/frontend con claves requeridas.
- [ ] Configurar scripts de migraciones/seed para Supabase en Vercel pipeline (no durante build).
- [ ] Agregar lint/format y hooks si se requieren (pre-commit opcional).

## Testing
- [ ] Agregar tests backend (auth, CRUD content, validaciones).
- [ ] Agregar tests frontend críticos (render público, CTA WhatsApp, flujos admin).

## Docs
- [ ] Completar `SETUP.md` (local + Vercel + Supabase).
- [ ] Completar `DEPLOYMENT.md` (vars, migraciones, rutas).
- [ ] Documentar errores comunes en `errors.md` a medida que surjan.
