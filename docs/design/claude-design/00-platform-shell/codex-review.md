# Codex Review - Platform Shell Design Delivery

Fecha: 2026-06-14

## Decision

Aceptar esta direccion visual como base del Platform Shell.

El segundo iter de Claude Design corrige los problemas principales del primer paquete:

- La tipografia Manrope se siente mas humana, menos tecnica y mas cercana para LATAM/Ecuador.
- Los moods ya cambian la personalidad completa del shell, no solo el panel central.
- El modelo multi-producto se mantiene claro: productos habilitados, disponibles, bloqueados por plan, sin permiso o desactivados.
- El asistente IA esta bien planteado como copiloto de sugerencias y aprobacion humana, sin prometer ejecucion autonoma.
- El paquete trae web + mobile, estados de error/carga/permisos y mocks alineados con los endpoints definidos para frontend handoff.

## Validaciones

- El paquete incluye `README.md`, `notes.md`, `integration-plan.md`, tokens CSS, mock JSON, source JSX de prototipo y screenshots desktop/mobile.
- Todos los JSON en `mock-data/` parsean correctamente.
- Los endpoints referenciados existen en `docs/api/openapi.json`:
  - `GET /api/auth/me`
  - `GET /api/tenancy/tenants/{slug}/products`
  - `GET /api/tenancy/tenants/{slug}/subscription`
  - `GET /api/tenancy/tenants/{slug}/entitlements`
  - `GET /api/tenancy/tenants/{slug}/feature-flags`
  - `GET /api/platform/products`
  - `GET /api/platform/plans`
- El diseno no inventa endpoints para moods ni para IA. Mood persistence queda como frontend/local state. El asistente queda como presencia UI de sugerencias.
- Los screenshots revisados muestran diferencia real entre comfort, calm y night.

## Hallazgos

- `index.html` usa React, ReactDOM y Babel desde CDN. Correcto para revision de diseno, no para integracion productiva.
- `fonts.css` usa Google Fonts. Para produccion debemos decidir si aceptamos carga externa o si empaquetamos/self-hosteamos fuentes por performance, privacidad y disponibilidad.
- `typography.css` todavia comenta "IBM Plex Sans" aunque el token real ya usa Manrope. Es un detalle documental, no funcional.
- Parte de la UI del prototipo conserva labels en ingles: `Dashboard`, `Add products`, `Suggestion`, `Design mood`, `Switch tenant`, `Upgrade plan`. La integracion productiva debe localizar el shell a espanol neutro para Ecuador/LATAM.
- El mock `products.json` usa `accessState`, y `source/data.js` lo reduce a `state`. El backend actual devuelve `PlatformProduct` para catalogo/productos habilitados y no expone aun ese `accessState` directo. La app debe derivarlo con productos habilitados, catalogo, plan, entitlements, permisos y feature flags.
- El marketplace/add-product y upgrade son estados visuales. Las acciones reales de compra/upgrade/activacion deben quedar deshabilitadas, simuladas o conectadas solo cuando exista backend comercial completo.
- La presencia IA es adecuada, pero debe conectarse a superficies existentes de AI Console/guarded execution. No debe crear un endpoint nuevo solo para el shell.

## Recomendacion De Integracion

No copiar el prototipo JSX literal dentro de `apps/web-platform`.

Integrarlo en tres pasos controlados:

1. **Design foundation**
   - Portar tokens CSS a la app.
   - Crear provider `data-mood` con `localStorage`.
   - Definir `MoodKey` y componentes base pequenos: button, pill, banner, nav item, mood selector.

2. **Platform shell real**
   - Reemplazar el layout actual por shell desktop/mobile usando componentes React/TS propios.
   - Consumir endpoints reales desde `apps/web-platform/src/app/api.ts`.
   - Crear un mapper `deriveProductAccessState(...)` para convertir contrato real en estados visuales.

3. **Product screens por partes**
   - Empezar por Dashboard/Platform Command Center.
   - Luego Invoicing, Tax Compliance EC, Growth, Ecommerce, Parties, Accounting.
   - Cada pantalla debe recibir un handoff independiente de Claude Design y conectarse con su API real.

## Backlog

- Persistencia backend de mood por usuario/tenant.
- Activacion/upgrade real de productos desde marketplace.
- Handoff especifico de AI assistant conectado a AI Console y aprobaciones.
- Localizacion completa del shell y estados.
- Decidir estrategia de fuente: Google Fonts vs self-host.
- Revisar `accessState` como posible contrato backend futuro si conviene no derivarlo siempre en frontend.
