# Estilos / Tema

Propósito: Definir look Y2K/cyberpunk centralizado en `src/styles/global.css`.

Patrones/decisiones
- Paleta: fondos oscuros (`--bg`, `--panel`), acentos neon (`--accent`, `--accent-2`, `--accent-3`), bordes fríos (`--border`), glow (`--glow`).
- Tipografía: `Space Grotesk` + `Orbitron` (Google Fonts).
- Layout mobile-first: `.page` padding reducido, nav en columna por defecto; breakpoints en 720px (layout desktop) y 960px (padding paneles).
- Componentes utilitarios: `.btn`, `.pill`, `.badge`, `.panel`, `.embed`, `.visual-card`, `.state-card`, `.floating-cta`, `.skeleton`.
- Fondos: gradientes radiales + grid fijo `.neon-grid`; hero con overlay y background image.
- Accesibilidad: contraste alto; alt en imágenes; estados de carga/error visibles.
- Formularios admin: `form-grid--equal` alinea campos; hints altos (`form-hint--tall`); footers por tarjeta con botón Guardar + mensajes de estado; inputs altos para hero/paths; file inputs para visuales.

Riesgos
- Efectos de blur/backdrop requieren soporte (Safari/older); degradan sin romper.
- Hero usa `/hero.jpg`; asegurarse de mantener el asset o mapear al path entregado por API.***
