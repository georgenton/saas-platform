# Manual Testing Guide

Esta guia deja un flujo reproducible para probar localmente:
- API NestJS
- web React
- JWT local para desarrollo
- onboarding multi-tenant
- invitaciones por email
- Postman

## 1. Preparar el entorno local

En tu `.env` configura como minimo:

```txt
DATABASE_URL=postgresql://...
AUTH_JWT_VERIFIER_MODE=local
AUTH_JWT_SECRET=dev-local-secret
WEB_PLATFORM_BASE_URL=http://127.0.0.1:5173
```

Si quieres probar email local sin proveedor externo, usa Mailpit:

```txt
INVITATION_EMAIL_FROM=onboarding@saas-platform.local
INVITATION_SMTP_HOST=127.0.0.1
INVITATION_SMTP_PORT=1025
INVITATION_SMTP_SECURE=false
INVITATION_SMTP_USER=
INVITATION_SMTP_PASSWORD=
```

Mailpit expone normalmente:
- SMTP: `127.0.0.1:1025`
- UI web: `http://127.0.0.1:8025`

## 2. Instalar, migrar y generar Prisma

```sh
pnpm install
pnpm prisma:generate
pnpm prisma:migrate:dev
```

## 3. Levantar API y web

Terminal 1:

```sh
pnpm nx serve api-platform
```

La API queda en:

```txt
http://127.0.0.1:3000/api
```

Terminal 2:

```sh
pnpm dev:web
```

La web queda normalmente en:

```txt
http://127.0.0.1:5173
```

## 4. Crear un usuario base

Haz primero este request sin autenticacion:

```http
POST /api/identity/users
Content-Type: application/json

{
  "email": "owner@saas-platform.dev",
  "authProvider": "password",
  "name": "Owner Local"
}
```

Guarda el `id` que regresa.

## 5. Generar un JWT local

Usa el `id` anterior como `sub`:

```sh
pnpm auth:token:local -- --sub "USER_ID_AQUI" --email "owner@saas-platform.dev"
```

Ese token sirve para:
- `/api/auth/me`
- crear tenant
- invitar usuarios
- administrar onboarding

## 6. Flujo minimo recomendado de prueba

### A. Crear tenant

```http
POST /api/tenancy/tenants
Content-Type: application/json

{
  "name": "SaaS Platform Local",
  "slug": "saas-platform-local",
  "ownerUserId": "USER_ID_AQUI"
}
```

### B. Ver sesion

```http
GET /api/auth/me
Authorization: Bearer {{token}}
```

### C. Fijar tenant actual

```http
PUT /api/auth/me/current-tenancy
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "tenantSlug": "saas-platform-local"
}
```

### D. Crear invitacion

```http
POST /api/tenancy/tenants/saas-platform-local/invitations
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "email": "invitee@saas-platform.dev"
}
```

### E. Ver invitaciones del tenant

```http
GET /api/tenancy/tenants/saas-platform-local/invitations
Authorization: Bearer {{token}}
```

### F. Crear usuario invitado

```http
POST /api/identity/users
Content-Type: application/json

{
  "email": "invitee@saas-platform.dev",
  "authProvider": "password",
  "name": "Invitee Local"
}
```

### G. Generar token del invitado

```sh
pnpm auth:token:local -- --sub "INVITEE_USER_ID" --email "invitee@saas-platform.dev"
```

### H. Ver la invitacion como invitee

```http
GET /api/auth/invitations/{{invitationId}}
Authorization: Bearer {{inviteeToken}}
```

### I. Aceptar la invitacion

```http
POST /api/auth/invitations/{{invitationId}}/accept
Authorization: Bearer {{inviteeToken}}
```

### J. Ver la sesion del invitee ya onboarded

```http
GET /api/auth/me
Authorization: Bearer {{inviteeToken}}
```

## 7. Qué probar en la web

En [apps/web-platform](/Users/jorgequizamanchuro/Projects_local/saas-platform/apps/web-platform):

1. pega el token del owner
2. revisa `/auth/me`
3. selecciona tenant actual
4. crea invitacion desde la UI
5. si usas Mailpit, abre el correo y entra al deep-link
6. pega el token del invitee
7. revisa y acepta la invitacion

## 8. Mailpit como buzon local

Si tienes Docker:

```sh
docker run --rm -p 1025:1025 -p 8025:8025 axllent/mailpit
```

Luego abre:

```txt
http://127.0.0.1:8025
```

## 9. Postman

Ya dejamos una coleccion base en:
- [tools/postman/saas-platform.local.postman_collection.json](/Users/jorgequizamanchuro/Projects_local/saas-platform/tools/postman/saas-platform.local.postman_collection.json)
- [tools/postman/saas-platform.local.postman_environment.json](/Users/jorgequizamanchuro/Projects_local/saas-platform/tools/postman/saas-platform.local.postman_environment.json)

Importa ambos archivos y empieza por:
1. `Identity / Register Owner`
2. `Tenancy / Create Tenant`
3. `Auth / Get Session`
4. `Auth / Set Current Tenancy`
5. `Invitations / Create`
6. `Auth / Get Invitation For Invitee`
7. `Auth / Accept Invitation`

## 10. Recomendacion de trabajo

Para pruebas manuales te recomiendo usar dos perfiles:

- `owner`
  - email: `owner@saas-platform.dev`
  - token propio
- `invitee`
  - email: `invitee@saas-platform.dev`
  - token propio

Con eso puedes recorrer casi todo el onboarding sin depender de terceros.
