# SaaS Platform

Monorepo Nx para el cambio de stack hacia:
- Node.js + NestJS
- Prisma + PostgreSQL
- React + Vite

## Proyectos principales

- `api-platform`: API multi-tenant con auth JWT, RBAC, invitaciones y onboarding.
- `web-platform`: shell React para consumir `/api/auth/me`, `sessionState`, invitaciones pendientes y seleccion de tenant.

## Comandos utiles

```sh
pnpm build
pnpm build:web
pnpm test
pnpm dev:web
pnpm prisma:generate
pnpm prisma:validate
```

## App web

La web vive en [apps/web-platform](/Users/jorgequizamanchuro/Projects_local/saas-platform/apps/web-platform) y hoy sirve como primera superficie visible para:
- cargar un Bearer token manualmente
- inspeccionar `/api/auth/me`
- ver `currentTenancy`, `pendingInvitations` y `sessionState`
- revisar y aceptar invitaciones
- administrar invitaciones del tenant actual si el usuario tiene `tenant.invitations.manage`

Por defecto apunta a:

```txt
http://127.0.0.1:3000/api
```

Puedes cambiarlo con:

```txt
VITE_API_BASE_URL
```

## Email de invitaciones

El backend ya puede enviar invitaciones reales por SMTP. Si no configuras SMTP, la invitacion se sigue creando y el sistema deja un warning en logs con el link de onboarding.

Variables relevantes:

```txt
INVITATION_EMAIL_FROM
INVITATION_SMTP_HOST
INVITATION_SMTP_PORT
INVITATION_SMTP_SECURE
INVITATION_SMTP_USER
INVITATION_SMTP_PASSWORD
WEB_PLATFORM_BASE_URL
```

`WEB_PLATFORM_BASE_URL` se usa para construir el link que llega por correo. La web soporta deep-link por `?invitationId=...` para abrir directamente la revision de invitacion.

## Releases

El repo usa Changesets para versionado y PRs de release. Antes de abrir un PR funcional, procura validar:

```sh
pnpm prisma:generate
pnpm prisma:validate
pnpm build
pnpm build:web
pnpm test
```
