# PRD - Nomoredrama Portfolio (Web)

## 1) Objetivo
Crear un portfolio/EPK web interactivo que exprese la identidad Y2K/cyberpunk de Nomoredrama y facilite bookings via WhatsApp, con administracion protegida para actualizar contenido sin tocar codigo.

## 2) Usuarios y necesidades
- Luca (artista/cliente): mostrar identidad, sets, colaboraciones, influencias; controlar contenido sin depender de desarrollo.
- Francisco (developer/admin): mantener y operar la plataforma, cargar activos, ajustar copy.
- Visitante/productoras: conocer bio, estetica, sets, colaboraciones; contactar rapido para bookings.

## 3) Alcance (MVP)
- Web en espanol (desktop/mobile) con secciones: Bio, Visuales (galeria), Sets en Vivo (embeds), Colaboraciones, Influencias, Contacto (CTA WhatsApp).
- CTA principal: boton/link a WhatsApp con mensaje prellenado.
- Admin protegido (login) para CRUD de contenido de todas las secciones.
- Contenido en Supabase Postgres; imagenes servidas desde `Recursos/Fotos/`; videos embebidos (YouTube/Vimeo).
- Estetica Y2K/cyberpunk: negros, violeta oscuro, metalicos, verdes; uso del logo (`Recursos/logo.png`).

## 4) Fuera de alcance (MVP)
- Multilenguaje.
- Subida masiva de imagenes desde admin (se asume assets ya presentes).
- Integraciones externas avanzadas (analytics, email marketing, pagos).
- App movil nativa.

## 5) Requisitos funcionales
- Bio: texto breve y extendido; hero image.
- Visuales: galeria de items con titulo, descripcion breve e imagen local.
- Sets en Vivo: lista con titulo, descripcion breve y URL de embed.
- Colaboraciones: lista con artista/proyecto, rol, ano, link opcional.
- Influencias: lista con nombre, genero/escena y nota breve.
- Contacto: CTA WhatsApp + redes (IG/Spotify/YouTube/SoundCloud); email opcional.
- Admin:
  - Login (JWT), logout.
  - CRUD por seccion; validacion con Zod.
  - Previsualizacion basica antes de guardar (ideal).
  - Control simple de rol (admin unico).

## 6) Requisitos no funcionales
- Performance: carga inicial ligera; lazy-load de media; optimizar imagenes (~1600px max, <400KB).
- Seguridad: proteger admin con auth y HTTPS; sin secretos en frontend; CORS configurado.
- Accesibilidad: contraste alto, navegacion teclado, labels/alt text.
- UX/UI: transiciones sutiles coherentes con estetica; priorizar legibilidad.

## 7) Arquitectura esperada
- Frontend: React 18 + TS + Vite; React Router v6; Axios; React Query; RHF+Zod; UI custom.
- Backend: Node 20 + TS + Express; Sequelize (Supabase/Postgres); JWT auth; Zod en endpoints.
- API: version `/api/v1/...`; rutas publicas de contenido + rutas protegidas admin.
- Deploy: Vercel (frontend + serverless API); DB Supabase; migraciones con Sequelize.

## 8) Modelo de datos (borrador)
- bio: id, shortText, longText, heroImagePath.
- visuals: id, title, description, imagePath, order.
- sets: id, title, description, embedUrl, platform, order.
- collaborations: id, name, role, year, link, order.
- influences: id, name, genre, note, order.
- contact: id, whatsappNumber, whatsappMessage, instagram, spotify, youtube, soundcloud, email?, location.
- admin_users: id, email, passwordHash, createdAt, updatedAt.

## 9) Flujos clave
- Visitante: entra -> ve hero/bio -> navega galeria -> abre embeds -> clic CTA WhatsApp.
- Admin: login -> edita contenido -> guarda -> frontend consume.

## 10) Metricas de exito (minimas)
- Tiempo a primer contacto: clics en CTA/visitas.
- Integridad de contenido: % secciones completas cargadas.
- Performance: LCP < 2.5s en redes moviles razonables.
- Errores admin: ratio de solicitudes 4xx/5xx en CRUD.

## 11) Riesgos y mitigaciones
- Peso de imagenes alto -> guideline de tamano/calidad; lazy-load; optimizar antes de subir.
- Embeds bloqueados -> usar URLs oficiales; fallback a links.
- Filtrado de secretos -> usar env en Vercel/Supabase; no hardcodear.
- Falta de tests -> priorizar auth y CRUD; smoke de contenido publico.

## 12) Archivos relevantes
- `start-project.md`
- `file_structure.md`
- `content_sources.md`
- `tasklist.md`
