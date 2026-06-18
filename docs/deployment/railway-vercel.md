# Railway + Vercel Deployment Runbook

Fecha: 2026-06-15

## Decision

Usar Railway para el backend NestJS + Prisma + PostgreSQL y Vercel para el frontend React/Vite.

Esta separacion mantiene el backend como servicio persistente con Docker, migraciones Prisma y base de datos administrada, mientras el frontend queda optimizado para previews y trabajo fino de UX/UI.

## URLs activas

Estado registrado al 2026-06-16:

- Frontend Vercel activo: `https://saas-platform-api-platform.vercel.app/`
- Backend productivo: Railway

Nota: cuando cambie alguno de estos endpoints, actualizar esta seccion junto con
`VITE_API_BASE_URL`, `CORS_ORIGIN` y `WEB_PLATFORM_BASE_URL` para no perder la
trazabilidad del entorno real que estamos usando para QA e integracion visual.

## Servicios

### Railway - API

Repositorio: `georgenton/saas-platform`

Config incluida:

- `railway.json`
- `Dockerfile`
- healthcheck: `/api/health`

Railway debe detectar el `Dockerfile` de la raiz. El contenedor:

1. instala dependencias con pnpm;
2. genera Prisma Client;
3. empaqueta `api-platform`;
4. instala dependencias productivas;
5. ejecuta `prisma migrate deploy`;
6. arranca `node main.js`.

Variables minimas:

```text
DATABASE_URL=<Railway Postgres DATABASE_URL>
HOST=0.0.0.0
PORT=3000
AUTH_JWT_VERIFIER_MODE=local
AUTH_JWT_SECRET=<secret largo para piloto>
CORS_ORIGIN=https://<vercel-app>.vercel.app
WEB_PLATFORM_BASE_URL=https://<vercel-app>.vercel.app
```

Variables opcionales segun productos:

```text
INVITATION_EMAIL_FROM=
INVITATION_SMTP_HOST=
INVITATION_SMTP_PORT=
INVITATION_SMTP_SECURE=
INVITATION_SMTP_USER=
INVITATION_SMTP_PASSWORD=
INVOICING_EMAIL_FROM=
GROWTH_WHATSAPP_OUTBOUND_PROVIDER=
GROWTH_WHATSAPP_META_ACCESS_TOKEN=
GROWTH_WHATSAPP_META_OUTBOUND_PHONE_NUMBER_ID=
GROWTH_WHATSAPP_META_VERIFY_TOKEN=
GROWTH_WHATSAPP_META_APP_SECRET=
```

Smoke inicial:

```bash
curl https://<railway-api-domain>/api/health
curl https://<railway-api-domain>/api/docs
curl https://<railway-api-domain>/api/openapi.json
```

### Vercel - Web

Repositorio: `georgenton/saas-platform`

Config incluida:

- `vercel.json`

Settings esperados:

```text
Framework Preset: Vite
Install Command: pnpm install --frozen-lockfile
Build Command: pnpm nx build web-platform
Output Directory: dist/apps/web-platform
```

Variable minima:

```text
VITE_API_BASE_URL=https://<railway-api-domain>/api
```

Despues de cambiar `VITE_API_BASE_URL` hay que redeployar Vercel, porque Vite inyecta variables `VITE_*` durante build.

## Orden recomendado

1. Mergear este PR.
2. Crear servicio PostgreSQL en Railway.
3. Crear servicio API en Railway desde GitHub usando Dockerfile.
4. Configurar variables Railway.
5. Deploy Railway.
6. Probar `/api/health`, `/api/docs` y `/api/openapi.json`.
7. Crear proyecto web en Vercel desde el mismo repo.
8. Configurar `VITE_API_BASE_URL` con el dominio Railway.
9. Deploy Vercel.
10. Actualizar `CORS_ORIGIN` y `WEB_PLATFORM_BASE_URL` en Railway con el dominio final de Vercel.
11. Redeploy Railway.
12. Probar frontend contra API desplegada.

## QA remoto de Invoicing

Despues de un deploy exitoso, usar
`docs/frontend-handoff/10-invoicing-vercel-qa-runbook.md` como prueba manual
minima para validar el recorrido:

1. login/token en Vercel;
2. Command Center;
3. workspace de Invoicing;
4. borrador de factura;
5. lineas y totales;
6. emision;
7. intento de envio SRI con error legible si el XML aun no supera XSD.

## Riesgos actuales

- La base nueva queda con esquema migrado, pero puede no tener tenant/usuario demo. Despues del primer deploy conviene crear un script de bootstrap para piloto.
- `AUTH_JWT_VERIFIER_MODE=local` sirve para piloto controlado. Antes de usuarios reales, mover a provider JWT con claves/issuer/audience.
- CORS debe incluir todos los dominios activos de Vercel que vayamos a probar.
- Algunas integraciones reales de Growth, email e invoicing remoto requieren secretos adicionales.

## Continuidad Frontend Despues Del Deploy

Este deploy no cambia la estrategia de frontend.

Despues de tener Railway + Vercel funcionando, retomamos los slices de integracion visual en este orden:

1. **Access / Login Gateway**
   - reemplazar el textarea JWT como entrada principal;
   - mantener el token bootstrap como carril tecnico avanzado;
   - resolver signed-out, loading, invitaciones, seleccion de tenant y handoff al command center.

2. **Platform Shell real**
   - convertir el shell actual en una estructura desktop/mobile mas cercana al handoff de Claude Design;
   - mantener moods frontend-only con `localStorage`;
   - derivar estados visuales de producto desde API real.

3. **Product Command Center**
   - conectar dashboard operativo con `auth/me`, catalogo, subscription, entitlements y feature flags;
   - dejar estados vacio/loading/error/permission claros.

4. **Pantallas producto por producto**
   - Invoicing;
   - Tax Compliance EC;
   - Growth;
   - Ecommerce;
   - Parties;
   - Accounting;
   - Medical Clinics;
   - Psychology Clinics.

Claude Design seguira entregando paquetes en `docs/design/claude-design/<slice>`, y cada integracion debe dejar su review/plan antes de tocar UI productiva.

## Backlog Deployment

- Script de bootstrap demo/prod-pilot para crear tenant, owner, plan, permisos y productos habilitados.
- Smoke remoto Railway + Vercel con token local de prueba.
- Workflow manual `delivery` parametrizado para Railway/Vercel.
- Migrar auth local a provider JWT antes de onboarding externo.
- Dominios custom y CORS por ambiente.
