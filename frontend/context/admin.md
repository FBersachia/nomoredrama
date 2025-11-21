# Admin

Proposito: Panel de login y edicion de contenido (bio, visuales, sets, colaboraciones, influencias, contacto) con layout Y2K.

Patrones/estructura
- Estado `token` en memoria; React Query para fetch de contenido admin.
- `loginAdmin` (POST) y `saveContent` (PUT) desde `services/api.ts`.
- Enrutado con `BrowserRouter` usando flags `v7_startTransition` y `v7_relativeSplatPath` para adelantarnos a React Router v7.
- Tarjetas estilizadas con grid responsivo e inputs custom; listas con append/remove por seccion.
- Barra de acciones pegajosa abajo (recargar + guardar todo) y boton redundante de guardado en Sets.
- Token persistido en `localStorage` (auto-restore al cargar y cleanup en logout).

Riesgos/decisiones
- Sin persistencia del token ni proteccion de rutas; pendiente.
- Validacion de frontend basica; ideal usar resolver Zod para mensajes alineados.
- Experiencia de error/success simple; podria mejorarse con toasts y estados medios anclados por seccion.***
