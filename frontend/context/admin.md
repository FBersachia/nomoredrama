# Admin (esqueleto actual)

Propósito: Panel de login y edición de Bio. Aún pendiente rediseño con el nuevo tema/UI.

Patrones/estructura
- Estado `token` en memoria; React Query para fetch de contenido admin.
- `loginAdmin` (POST) y `saveContent` (PUT) desde `services/api.ts`.
- Formulario minimal para Bio (short/long/heroImagePath).
- Enrutado con `BrowserRouter` usando flags `v7_startTransition` y `v7_relativeSplatPath` para adelantarnos a React Router v7 y evitar warnings.

Riesgos/decisiones
- No hay persistencia del token ni protección de rutas; pendiente.
- No hay validación Zod en frontend; pendiente cuando se rediseñe.
- UI no usa los estilos nuevos; requiere refactor para alinearse a layout Y2K.***
