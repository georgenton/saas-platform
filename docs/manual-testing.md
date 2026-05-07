# Manual Testing Guide

Esta guia deja un flujo reproducible y actualizado para probar localmente:
- API NestJS
- web React
- JWT local para desarrollo
- onboarding multi-tenant
- `Electronic Invoicing EC`
- Postman con automatizaciones

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

## 4. Crear usuarios base

### Owner

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

### Invitee

```http
POST /api/identity/users
Content-Type: application/json

{
  "email": "invitee@saas-platform.dev",
  "authProvider": "password",
  "name": "Invitee Local"
}
```

Guarda tambien el `id` del invitee.

## 5. Generar JWTs locales

### Owner

```sh
pnpm auth:token:local -- --sub "OWNER_USER_ID" --email "owner@saas-platform.dev"
```

### Invitee

```sh
pnpm auth:token:local -- --sub "INVITEE_USER_ID" --email "invitee@saas-platform.dev"
```

Esos tokens sirven para:
- `/api/auth/me`
- crear tenant
- invitar usuarios
- administrar `Electronic Invoicing EC`
- aceptar invitaciones

## 6. Postman

Ya dejamos lista una coleccion ampliada en:
- [tools/postman/saas-platform.local.postman_collection.json](/Users/jorgequizamanchuro/Projects_local/saas-platform/tools/postman/saas-platform.local.postman_collection.json)
- [tools/postman/saas-platform.local.postman_environment.json](/Users/jorgequizamanchuro/Projects_local/saas-platform/tools/postman/saas-platform.local.postman_environment.json)

### Qué incluye la colección

La coleccion cubre:
- health
- identity
- auth
- tenancy
- suscripcion comercial del tenant
- invitations
- setup fiscal Ecuador
- customers
- taxes
- invoices
- items
- payments
- XML preview
- RIDE
- artifacts/downloads
- sandbox readiness
- submit stub
- submit prefirmado
- check authorization

### Automatizaciones incluidas

La coleccion guarda automaticamente en el environment:
- `ownerUserId`
- `inviteeUserId`
- `tenantId`
- `tenantSlug`
- `enabledProductKeys`
- `invitationId`
- `customerId`
- `taxRateId`
- `invoiceId`
- `invoiceNumber`
- `invoiceItemId`
- `paymentId`
- `accessKey`
- `submissionReference`
- `authorizationNumber`
- `xmlPreview`
- `sandboxReady`
- `sandboxRecommendedNextStep`

### Qué debes cargar manualmente

Postman no puede generar JWTs por ti en este flujo local. Debes pegar manualmente en el environment:
- `ownerToken`
- `inviteeToken`

### Runner listo para usar

La colección ahora también trae un folder específico:
- `10. Runner Flows / EC Happy Path - Stub`
- `10. Runner Flows / EC Presigned Flow - Continue After External Signature`

Eso te permite correr un lote ordenado desde Postman Runner sin ir abriendo request por request.

## 7. Orden recomendado en Postman

### 7.1 Onboarding base

Corre en este orden:

1. `01. Health / API / Hello`
2. `02. Identity & Auth / Register Owner`
3. genera `ownerToken` con CLI y pégalo en el environment
4. `03. Tenancy & Invitations / Create Tenant`
5. `03. Tenancy & Invitations / Set Tenant Subscription (Growth)`
6. `03. Tenancy & Invitations / Get Tenant Enabled Products`
7. `02. Identity & Auth / Get Session (Owner)`
8. `02. Identity & Auth / Set Current Tenancy (Owner)`
9. `03. Tenancy & Invitations / Create Invitation`
10. `02. Identity & Auth / Register Invitee`
11. genera `inviteeToken` con CLI y pégalo en el environment
12. `02. Identity & Auth / Get Invitation For Invitee`
13. `02. Identity & Auth / Accept Invitation`

Ese paso de suscripción es obligatorio para habilitar el producto `invoicing`. Si lo omites, el backend responderá:

```txt
Product "invoicing" is not enabled for tenant "..."
```

Si quieres revisar acceso o membresías:
- `03. Tenancy & Invitations / Get Tenant`
- `03. Tenancy & Invitations / List Memberships`
- `03. Tenancy & Invitations / Get Member Access`

### Runner recomendado para onboarding + setup rápido

Si prefieres correrlo manualmente pero siguiendo lote:
1. `Register Owner`
2. pega `ownerToken`
3. `Create Tenant`
4. `Set Tenant Subscription (Growth)`
5. `Get Tenant Enabled Products`
6. `Get Session (Owner)`
7. `Set Current Tenancy (Owner)`

## 8. Flujo completo de Electronic Invoicing EC

### 8.1 Configuración fiscal mínima del tenant

Corre en este orden:

1. `03. Tenancy & Invitations / Set Tenant Subscription (Growth)` si todavía no lo hiciste
2. `03. Tenancy & Invitations / Get Tenant Enabled Products`
3. `04. Invoicing Setup / Upsert Electronic Profile`
4. `04. Invoicing Setup / Upsert Invoice Numbering`
5. `04. Invoicing Setup / Upsert Electronic Signature`
6. `04. Invoicing Setup / Upsert Electronic Submission`
7. `04. Invoicing Setup / Get Electronic Sandbox Readiness`

### Qué esperar

- perfil fiscal creado para Ecuador
- producto `invoicing` habilitado dentro del tenant
- numeración tipo `001-002-000000031`
- firma configurada
- gateway configurado
- readiness indicando si el tenant puede o no pasar a sandbox remoto real

### 8.2 Datos maestros de negocio

Corre:

1. `05. Invoicing Master Data / Create Customer`
2. `05. Invoicing Master Data / Create Tax Rate`

La colección guardará automáticamente:
- `customerId`
- `taxRateId`

### 8.3 Crear factura y líneas

Corre:

1. `06. Invoicing Invoices / Create Invoice (auto numbering)`
2. `07. Invoicing Items / Create Invoice Item`
3. `06. Invoicing Invoices / Get Invoice Detail`

La colección guardará automáticamente:
- `invoiceId`
- `invoiceNumber`
- `invoiceItemId`

### 8.4 Revisar documento y artefactos

Corre:

1. `09. Invoicing Electronic Document / Get XML Preview`
2. `09. Invoicing Electronic Document / Get RIDE`
3. `09. Invoicing Electronic Document / Get Artifacts`
4. `09. Invoicing Electronic Document / Download XML`
5. `09. Invoicing Electronic Document / Download RIDE`

### Qué revisar en el XML

Confirma que existan estos nodos o datos:
- `<factura id="comprobante" version="2.1.0">`
- `<claveAcceso>`
- `<codDoc>01</codDoc>`
- `<estab>001</estab>`
- `<ptoEmi>002</ptoEmi>`
- `<secuencial>`
- `tipoIdentificacionComprador`
- `identificacionComprador`
- `razonSocialComprador`
- `direccionComprador`
- `pagos`
- `totalConImpuestos`

## 8.5 Runner batch para el camino stub

Si ya tienes:
- `ownerToken`
- `tenantSlug`

y quieres una corrida casi completa en lote, abre Postman Runner sobre:

- `10. Runner Flows / EC Happy Path - Stub`

Ese folder corre en este orden:
1. profile
2. numbering
3. signature stub
4. submission stub
5. sandbox readiness
6. customer
7. tax rate
8. invoice
9. invoice item
10. xml preview
11. submit stub
12. check authorization
13. invoice detail
14. ride

### Requisito práctico

Antes de lanzarlo, asegúrate de que el environment tenga:
- `ownerToken`
- `tenantSlug`

Y si quieres valores distintos, ajusta antes:
- customer
- tax rate
- invoice
- numbering
- issuer profile

## 9. Dos caminos de prueba del comprobante electrónico

## 9.1 Camino A: submit local/stub

Este camino sirve para validar el pipeline interno, aunque la firma siga siendo simulada.

Corre:

1. `09. Invoicing Electronic Document / Submit Electronic Document (stub signer)`
2. `09. Invoicing Electronic Document / Check Authorization`
3. `06. Invoicing Invoices / Get Invoice Detail`

### Qué esperar

- `submitted: true`
- `submissionReference` poblado
- `electronicStatus` moviéndose a `submitted` o `authorized` según el flujo stub
- historial técnico visible en el detalle de factura

## 9.2 Camino B: submit prefirmado

Este es el puente actual más útil hacia sandbox real.

### Cuándo usarlo

Úsalo cuando tengas un XML firmado fuera del sistema con una herramienta externa de firma XAdES/PKCS#12.

### Cómo prepararlo

1. corre `09. Invoicing Electronic Document / Get XML Preview`
2. toma ese XML y fírmalo con tu herramienta externa
3. reemplaza en el environment el valor de `presignedXmlJson` por un string JSON válido con el XML firmado

Ejemplo de valor en Postman environment:

```txt
"<factura ...><ds:Signature ...>...</ds:Signature></factura>"
```

Si quieres registrar el nombre del firmador externo, ajusta:

```txt
externalSignerNameJson
```

Por ejemplo:

```txt
"sandbox-signer"
```

### Ejecutar

Corre:

1. `09. Invoicing Electronic Document / Submit Presigned Electronic Document`
2. `09. Invoicing Electronic Document / Check Authorization`
3. `06. Invoicing Invoices / Get Invoice Detail`

## 9.3 Runner batch para el camino prefirmado

Cuando ya tengas un XML firmado externamente, puedes correr un lote corto desde:

- `10. Runner Flows / EC Presigned Flow - Continue After External Signature`

Orden:
1. `Get XML Preview`
2. `Submit Presigned XML`
3. `Check Authorization`
4. `Get Invoice Detail`

### Importante

Antes de ejecutar ese folder, actualiza en el environment:
- `invoiceId`
- `presignedXmlJson`
- opcionalmente `externalSignerNameJson`

### Qué esperar

- la API validará semántica Ecuador
- la API validará XSD oficial
- la API verificará que exista un bloque `ds:Signature`
- el submit se hará usando el gateway configurado
- el historial técnico conservará request, response y referencia de envío

## 10. Sandbox readiness y lectura correcta del estado

Usa siempre:

- `04. Invoicing Setup / Get Electronic Sandbox Readiness`

### Cómo interpretar la respuesta

#### `isReadyForRemoteSandboxSubmission = false`

Significa que todavía falta algo para una prueba remota real. Revisa:
- `blockers`
- `warnings`
- `recommendedNextStep`

#### `isReadyForRemoteSandboxSubmission = true`

Significa que el tenant ya está alineado para una prueba controlada remota.

### Importante

Hoy el repo todavía protege el submit `offline` remoto cuando la firma interna sigue siendo stub. Eso es intencional. El camino correcto para sandbox real es:
- readiness limpio
- XML firmado externamente
- `submit-presigned`

## 11. Variables del environment que más vas a tocar

### Tokens
- `ownerToken`
- `inviteeToken`

### Setup Ecuador
- `issuerLegalName`
- `issuerTaxId`
- `issuerEnvironment`
- `establishmentCode`
- `emissionPointCode`
- `nextSequenceNumber`

### Firma
- `signatureProvider`
- `signatureStorageMode`
- `signatureCertificateLabel`
- `signatureCertificateFingerprint`
- `signaturePkcs12SecretRefJson`
- `signaturePasswordSecretRefJson`
- `signatureSubjectNameJson`

### Gateway
- `submissionProvider`
- `submissionMode`
- `submissionReceptionUrlJson`
- `submissionAuthorizationUrlJson`
- `submissionCredentialsSecretRefJson`
- `submissionTimeoutMs`

### Factura y comprobante
- `customerId`
- `taxRateId`
- `invoiceId`
- `accessKey`
- `submissionReference`
- `authorizationNumber`
- `presignedXmlJson`
- `externalSignerNameJson`

## 12. Qué probar en la web

En [apps/web-platform](/Users/jorgequizamanchuro/Projects_local/saas-platform/apps/web-platform):

1. pega el `ownerToken`
2. verifica `/auth/me`
3. fija el tenant actual
4. configura profile, numbering, signature y submission
5. revisa `Sandbox readiness`
6. crea customer, tax rate e invoice
7. agrega items y pagos
8. abre XML preview y RIDE
9. descarga artifacts
10. prueba `Firmar y enviar (stub)`
11. prueba `Enviar XML prefirmado` si ya cuentas con firma externa

## 13. Troubleshooting

### `403 User cannot access tenant`

El `sub` del JWT no coincide con un usuario miembro del tenant.

### `401 Malformed JWT`

El token fue copiado incompleto o no tiene formato JWT válido.

### `P2003 Membership_userId_fkey`

El usuario del token no existe realmente en base de datos o el `ownerUserId` no coincide con un usuario persistido.

### `The column InvoiceItem.taxRateId does not exist`

Tu base no está al día con las migraciones de la rama actual. Ejecuta:

```sh
pnpm prisma:migrate:dev
pnpm prisma:generate
```

### `Invoice ... is not ready for remote SRI offline submission`

El sistema está bloqueando una prueba remota que todavía no es sana. Revisa primero:
- `Get Electronic Sandbox Readiness`
- la configuración de firma
- el tipo de submit que estás usando

### `El XML prefirmado no contiene un bloque ds:Signature reconocible`

El XML firmado externamente no contiene una firma XML visible o fue serializado de forma incorrecta.

## 14. Recomendación práctica de trabajo

Para pruebas manuales te recomiendo usar dos perfiles:

- `owner`
  - email: `owner@saas-platform.dev`
  - token propio
- `invitee`
  - email: `invitee@saas-platform.dev`
  - token propio

Y para `Electronic Invoicing EC` usar dos modos:

- `stub`
  - para validar el pipeline interno rápido
- `presigned sandbox`
  - para acercarte al flujo real sin esperar a la firma XAdES nativa del repo
