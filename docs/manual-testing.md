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
- numeracion por tipo de documento (`01` factura, `04` nota de credito, `05` nota de debito, `06` guia de remision, `07` comprobante de retencion)
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
- carril dedicado de nota de credito (`04`) con submit, artifacts y runners propios
- carril de nota de debito (`05`) con submit, artifacts y runners propios
- carril de guia de remision (`06`) con submit, artifacts y runners propios
- foundation de comprobante de retencion (`07`) con draft, XML preview, RIDE y artifacts
- carril de comprobante de retencion (`07`) con submit, artifacts y runners propios

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
- `invoice01SchemaValidationAvailable`
- `invoice01SubmitSupported`
- `creditNoteAccessKey`
- `creditNoteSubmissionReference`
- `creditNoteAuthorizationNumber`
- `creditNoteXmlPreview`
- `creditNoteArtifactsFileBaseName`
- `creditNoteSequenceDisplay`
- `creditNote04SubmitSupported`
- `creditNote04SchemaValidationAvailable`
- `debitNote05SubmitSupported`
- `debitNote05SchemaValidationAvailable`
- `withholding07SubmitSupported`
- `withholding07SchemaValidationAvailable`
- `debitNoteId`
- `debitNoteNumber`
- `debitNoteAccessKey`
- `debitNoteSubmissionReference`
- `debitNoteAuthorizationNumber`
- `debitNoteXmlPreview`
- `debitNoteArtifactsFileBaseName`
- `debitNoteSequenceDisplay`
- `withholdingId`
- `withholdingNumber`
- `withholdingXmlPreview`
- `withholdingArtifactsFileBaseName`
- `withholdingSequenceDisplay`

### Qué debes cargar manualmente

Postman no puede generar JWTs por ti en este flujo local. Debes pegar manualmente en el environment:
- `ownerToken`
- `inviteeToken`

### Runner listo para usar

La colección ahora también trae un folder específico:
- `10. Runner Flows / EC Happy Path - Stub`
- `10. Runner Flows / EC Presigned Flow - Continue After External Signature`
- `10. Runner Flows / EC Credit Note Happy Path - Stub`
- `10. Runner Flows / EC Credit Note Presigned Flow - Continue After External Signature`
- `10. Runner Flows / EC Debit Note Happy Path - Stub`
- `10. Runner Flows / EC Debit Note Presigned Flow - Continue After External Signature`
- `10. Runner Flows / EC Withholding Happy Path - Stub`
- `10. Runner Flows / EC Withholding Presigned Flow - Continue After External Signature`

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
5. `04. Invoicing Setup / Upsert Credit Note Numbering` si quieres abrir el carril `04`
6. `04. Invoicing Setup / Upsert Debit Note Numbering` si quieres abrir el carril `05`
7. `04. Invoicing Setup / Upsert Withholding Numbering` si quieres abrir el carril `07`
8. `04. Invoicing Setup / Upsert Remission Guide Numbering` si quieres abrir el carril `06`
9. `04. Invoicing Setup / Upsert Electronic Signature`
10. `04. Invoicing Setup / Get Electronic Signature Inspection`
11. `04. Invoicing Setup / Upsert Electronic Submission`
12. `04. Invoicing Setup / Get Electronic Sandbox Readiness`

### Qué esperar

- perfil fiscal creado para Ecuador
- producto `invoicing` habilitado dentro del tenant
- numeración tipo `001-002-000000031` para factura (`01`)
- opcionalmente numeración independiente para nota de crédito (`04`)
- opcionalmente numeración independiente para nota de débito (`05`)
- opcionalmente numeración independiente para guía de remisión (`06`)
- opcionalmente numeración independiente para comprobante de retención (`07`)
- firma configurada
- inspección concreta del PKCS#12 si usas `xades_pkcs12`
- gateway configurado
- readiness indicando si el tenant puede o no pasar a sandbox remoto real

Cuando el provider remoto sea `sri_offline_ws`, el detalle de factura ya expone un diagnostico estructurado por evento:
- `sriDiagnostics.summary`
- `sriDiagnostics.messages[].identifier`
- `sriDiagnostics.messages[].message`
- `sriDiagnostics.messages[].additionalInfo`

Eso ayuda a leer devoluciones reales del SRI sin tener que inspeccionar el `responsePayload` XML completo.

Importante: el RUC de ejemplo `1790012345001` sirve para fixtures locales y previews, pero ya no debe considerarse apto para `sandboxReady=true` en CELCER. Si apuntas al sandbox real del SRI, usa un contribuyente realmente habilitado en ese ambiente.

Si quieres ahorrar trabajo manual con `xades_pkcs12`, puedes dejar:

- `signatureHydrateMetadataJson = true`

Entonces `Upsert Electronic Signature` intentará completar `certificateFingerprint` y `subjectName` desde el propio PKCS#12 cuando el keystore ya pueda abrirse.

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

### 8.4 Crear una nota de crédito borrador (`04`)

Cuando ya tengas una factura origen con líneas, puedes abrir el primer flujo real de nota de crédito:

1. `06. Invoicing Invoices / Create Credit Note From Invoice`
2. `06. Invoicing Invoices / Get Credit Note Detail`

La colección guardará automáticamente:
- `creditNoteId`
- `creditNoteNumber`
- `creditNoteAccessKey`
- `creditNoteSubmissionReference`
- `creditNoteAuthorizationNumber`
- `creditNoteXmlPreview`
- `creditNoteArtifactsFileBaseName`
- `creditNoteSequenceDisplay`

### Qué esperar

- documento con `documentCode = 04`
- numeración independiente del carril de nota de crédito si configuraste `Upsert Credit Note Numbering`
- referencia al comprobante modificado
- líneas negativas que revierten los valores de la factura origen
- totales negativos en el borrador de la nota de crédito

### Estado electrónico actual del `04`

En esta fase, la nota de crédito ya tiene:
- borrador comercial
- RIDE
- preview XML
- artefactos descargables
- validación XSD oficial local
- submit stub
- submit prefirmado
- check authorization

### 8.5 Revisar documento y artefactos

Corre:

1. `09. Invoicing Electronic Document / Get XML Preview`
2. `09. Invoicing Electronic Document / Get RIDE`
3. `09. Invoicing Electronic Document / Get Artifacts`
4. `09. Invoicing Electronic Document / Download XML`
5. `09. Invoicing Electronic Document / Download RIDE`

Si quieres revisar el carril `04`, usa además:
- `06. Invoicing Invoices / Get Credit Note Detail`
- `09. Invoicing Electronic Document / Get Credit Note XML Preview`
- `09. Invoicing Electronic Document / Get Credit Note RIDE`
- `09. Invoicing Electronic Document / Get Credit Note RIDE HTML`
- `09. Invoicing Electronic Document / Get Credit Note Artifacts`
- `09. Invoicing Electronic Document / Download Credit Note XML`
- `09. Invoicing Electronic Document / Download Credit Note RIDE`

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

Para una nota de crédito (`04`), además revisa:
- `<notaCredito id="comprobante" version="1.0.0">`
- `<codDoc>04</codDoc>`
- `codDocModificado`
- `numDocModificado`
- `fechaEmisionDocSustento`
- `valorModificacion`
- `motivos`

### 8.5.b Crear una nota de débito borrador (`05`)

Cuando ya tengas una factura origen y quieras abrir el siguiente documento SRI del mismo carril, usa:

1. `06. Invoicing Invoices / Create Debit Note From Invoice`
2. `06. Invoicing Invoices / Get Debit Note Detail`

La colección guardará automáticamente:
- `debitNoteId`
- `debitNoteNumber`
- `debitNoteAccessKey`
- `debitNoteSubmissionReference`
- `debitNoteAuthorizationNumber`
- `debitNoteXmlPreview`
- `debitNoteArtifactsFileBaseName`
- `debitNoteSequenceDisplay`

### Qué esperar

- documento con `documentCode = 05`
- numeración independiente del carril de nota de débito si configuraste `Upsert Debit Note Numbering`
- referencia al comprobante modificado
- una primera línea positiva creada desde el motivo inicial
- totales positivos y listos para continuar hacia XML/RIDE

### Estado electrónico actual del `05`

En esta fase, la nota de débito ya tiene:
- borrador comercial
- RIDE
- preview XML
- artefactos descargables
- matriz de readiness por documento
- validación XSD local
- submit stub y prefirmado cuando el tenant esté listo

### 8.5.c Crear un comprobante de retención borrador (`07`)

Cuando ya tengas una factura origen y quieras abrir el carril inicial de retención, usa:

1. `06. Invoicing Invoices / Create Withholding From Invoice`
2. `06. Invoicing Invoices / Get Withholding Detail`

La colección guardará automáticamente:
- `withholdingId`
- `withholdingNumber`
- `withholdingXmlPreview`
- `withholdingArtifactsFileBaseName`
- `withholdingSequenceDisplay`

### Qué esperar

- documento con `documentCode = 07`
- numeración independiente del carril de retención si configuraste `Upsert Withholding Numbering`
- referencia al comprobante sustento
- una primera línea creada desde el motivo y valor retenido inicial
- RIDE y XML preview ya disponibles

### Estado electrónico actual del `07`

En esta fase, el comprobante de retención ya tiene:
- borrador comercial
- RIDE
- preview XML
- artifacts descargables
- matriz de readiness por documento
- validación XSD local
- submit stub y prefirmado cuando el tenant esté listo

### 8.5.d Crear una guía de remisión borrador (`06`)

Cuando ya tengas una factura origen y quieras abrir el carril inicial de traslado, usa:

1. `06. Invoicing Invoices / Create Remission Guide From Invoice`
2. `06. Invoicing Invoices / Get Remission Guide Detail`
3. `06. Invoicing Invoices / Get Remission Guide XML Preview`
4. `06. Invoicing Invoices / Get Remission Guide RIDE`

La colección guardará automáticamente:
- `remissionGuideId`
- `remissionGuideNumber`
- `remissionGuideXmlPreview`
- `remissionGuideArtifactsFileBaseName`
- `remissionGuideSequenceDisplay`

### Qué esperar

- documento con `documentCode = 06`
- numeración independiente del carril de guía de remisión si configuraste `Upsert Remission Guide Numbering`
- referencia a la factura sustento
- metadata de traslado: motivo, fechas, direcciones, transportista, identificación, placa y ruta
- detalle logístico base derivado de las líneas de la factura origen
- RIDE y XML preview ya disponibles

### Estado electrónico actual del `06`

En esta fase, la guía de remisión ya tiene:
- borrador comercial
- RIDE
- preview XML
- artifacts descargables
- matriz de readiness por documento
- validacion XSD local
- submit stub y prefirmado cuando el tenant este listo

### Instalar el bundle XSD/XML oficial para `06`

Cuando tengas el ZIP oficial del SRI para guía de remisión en tu máquina, instálalo así desde la raíz del repo:

```sh
pnpm install:sri:schema-bundle -- --document-code 06 --zip "$HOME/Downloads/XML y XSD Guia de Remision.zip"
```

Después valida el bundle local:

```sh
pnpm validate:sri:xsd:remission-guide
```

Y luego verifica que el readiness del tenant ya refleje el cambio:

- `documentSupport` para `06`
- `schemaValidationAvailable = true`
- `submitSupported = true`

## 8.6 Runner batch para el camino stub

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

### Runner batch específico para nota de crédito stub

Cuando ya tengas una factura origen y quieras probar el carril `04` sin ir request por request, usa:

- `10. Runner Flows / EC Credit Note Happy Path - Stub`

Ese folder corre en este orden:
1. credit note numbering
2. sandbox readiness
3. create credit note
4. credit note detail
5. credit note XML preview
6. credit note submit stub
7. credit note check authorization
8. credit note detail final
9. credit note RIDE
10. credit note artifacts

Antes de lanzarlo, asegúrate de que el environment ya tenga:
- `ownerToken`
- `tenantSlug`
- `invoiceId` de una factura origen válida

### Runner batch específico para nota de débito stub

Cuando ya tengas una factura origen y quieras probar el carril `05` sin ir request por request, usa:

- `10. Runner Flows / EC Debit Note Happy Path - Stub`

Ese folder corre en este orden:
1. debit note numbering
2. sandbox readiness
3. create debit note
4. debit note detail
5. debit note XML preview
6. debit note submit stub
7. debit note check authorization
8. debit note detail final
9. debit note RIDE
10. debit note artifacts

Antes de lanzarlo, asegúrate de que el environment ya tenga:
- `ownerToken`
- `tenantSlug`
- `invoiceId` de una factura origen válida

### Runner batch específico para comprobante de retención stub

Cuando ya tengas una factura origen y quieras probar el carril `07` sin ir request por request, usa:

- `10. Runner Flows / EC Withholding Happy Path - Stub`

Ese folder corre en este orden:
1. withholding numbering
2. sandbox readiness
3. create withholding
4. withholding detail
5. withholding XML preview
6. withholding submit stub
7. withholding check authorization
8. withholding detail final
9. withholding RIDE
10. withholding artifacts

Antes de lanzarlo, asegúrate de que el environment ya tenga:
- `ownerToken`
- `tenantSlug`
- `invoiceId` de una factura origen válida

### Runner batch específico para guía de remisión foundation

Cuando ya tengas una factura origen y quieras probar el carril `06` sin ir request por request, usa:

- `10. Runner Flows / EC Remission Guide Foundation`

Ese folder corre en este orden:
1. remission guide numbering
2. sandbox readiness
3. create remission guide
4. remission guide detail
5. remission guide XML preview
6. remission guide RIDE
7. remission guide artifacts

Antes de lanzarlo, asegúrate de que el environment ya tenga:
- `ownerToken`
- `tenantSlug`
- `invoiceId` de una factura origen válida

### Runner batch específico para guía de remisión stub

Cuando ya tengas una factura origen y quieras probar el carril `06` con submit electrónico de punta a punta, usa:

- `10. Runner Flows / EC Remission Guide Happy Path - Stub`

Ese folder corre en este orden:
1. remission guide numbering
2. sandbox readiness
3. create remission guide
4. remission guide detail
5. remission guide XML preview
6. remission guide submit stub
7. remission guide check authorization
8. remission guide detail final
9. remission guide RIDE
10. remission guide artifacts

### Runner batch específico para guía de remisión prefirmada

Si ya cuentas con un XML firmado externamente para `06`, usa:

- `10. Runner Flows / EC Remission Guide Presigned Flow - Continue After External Signature`

Antes de lanzarlo, asegúrate de que el environment ya tenga:
- `ownerToken`
- `tenantSlug`
- `invoiceId` de una factura origen válida
- `remissionGuidePresignedXmlJson`

### Runner batch específico para comprobante de retención prefirmado

Si ya cuentas con un XML firmado externamente para `07`, usa:

- `10. Runner Flows / EC Withholding Presigned Flow - Continue After External Signature`

Antes de lanzarlo, asegúrate de que el environment ya tenga:
- `ownerToken`
- `tenantSlug`
- `invoiceId` de una factura origen válida

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

Para `04`, usa estas variantes dedicadas:
1. `09. Invoicing Electronic Document / Submit Credit Note Electronic Document (stub signer)`
2. `09. Invoicing Electronic Document / Check Credit Note Authorization`
3. `06. Invoicing Invoices / Get Credit Note Detail`

Para `05`, usa estas variantes. En este branch el XSD local ya viene soportado por el repo:
1. `09. Invoicing Electronic Document / Submit Debit Note Electronic Document (stub signer)`
2. `09. Invoicing Electronic Document / Check Debit Note Authorization`
3. `06. Invoicing Invoices / Get Debit Note Detail`

Para `07`, usa estas variantes:
1. `09. Invoicing Electronic Document / Submit Withholding Electronic Document (stub signer)`
2. `09. Invoicing Electronic Document / Check Withholding Authorization`
3. `06. Invoicing Invoices / Get Withholding Detail`

Para `06`, usa estas variantes:
1. `09. Invoicing Electronic Document / Submit Remission Guide Electronic Document (stub signer)`
2. `09. Invoicing Electronic Document / Check Remission Guide Authorization`
3. `06. Invoicing Invoices / Get Remission Guide Detail`

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

Para nota de crédito puedes usar el environment dedicado:

```txt
creditNotePresignedXmlJson
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

Para `04`, usa estas variantes:
1. `09. Invoicing Electronic Document / Submit Credit Note Presigned Electronic Document`
2. `09. Invoicing Electronic Document / Check Credit Note Authorization`
3. `06. Invoicing Invoices / Get Credit Note Detail`

Para `05`, usa estas variantes:
1. `09. Invoicing Electronic Document / Submit Debit Note Presigned Electronic Document`
2. `09. Invoicing Electronic Document / Check Debit Note Authorization`
3. `06. Invoicing Invoices / Get Debit Note Detail`

Para `07`, usa estas variantes:
1. `09. Invoicing Electronic Document / Submit Withholding Presigned Electronic Document`
2. `09. Invoicing Electronic Document / Check Withholding Authorization`
3. `06. Invoicing Invoices / Get Withholding Detail`

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

Si quieres un runner corto equivalente para `04`, usa:

- `10. Runner Flows / EC Credit Note Presigned Flow - Continue After External Signature`

Si quieres un runner corto equivalente para `05`, usa:

- `10. Runner Flows / EC Debit Note Presigned Flow - Continue After External Signature`

Si quieres un runner corto equivalente para `07`, usa:

- `10. Runner Flows / EC Withholding Presigned Flow - Continue After External Signature`

Y antes actualiza:
- `invoiceId`
- `withholdingPresignedXmlJson`
- opcionalmente `externalSignerNameJson`

El runner se encargará de:
- crear la nota de crédito
- guardar `creditNoteId`
- guardar `creditNoteXmlPreview`
- guardar `creditNoteAccessKey`
- guardar `creditNoteSubmissionReference`
- guardar `creditNoteAuthorizationNumber`

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

#### `isReadyForPresignedRemoteSandboxSubmission = true`

Significa que ya puedes probar el gateway remoto con XML firmado externamente, aunque la firma interna todavía no haya quedado verificada para ese tenant.

#### `isInternalSignerMaterialReady = true`

Significa que el `pkcs12SecretRef` y su password ya resolvieron a un material que OpenSSL pudo abrir como PKCS#12 y del que ya fue posible leer el certificado. Aun no garantiza firma criptografica valida para SRI; solo confirma que el keystore ya no parece vacio, PEM equivocado o basura imposible de cargar.

#### `isReadyForLocalStubSubmission = true`

Significa que el tenant todavía puede validar el pipeline interno usando `stub_sri`, aunque el camino remoto real siga pendiente.

#### `isReadyForRemoteSandboxSubmission = true`

Significa que el tenant ya está alineado para una prueba controlada remota con firma interna y gateway sandbox.

#### `latestRemoteSriSubmission*`

Cuando ya hubo al menos un intento real contra `sri_offline_ws`, la respuesta también expone:

- `latestRemoteSriSubmissionStatus`
- `latestRemoteSriSubmissionSummary`
- `latestRemoteSriSubmissionCategory`
- `latestRemoteSriSubmissionOccurredAt`

Úsalo así:

- `taxpayer_not_registered`:
  - el último rechazo remoto apunta a identidad fiscal no habilitada en CELCER
  - normalmente no tiene sentido seguir afinando firma mientras el emisor siga en ese estado
- `xml_structure`:
  - el SRI devolvió una observación estructural sobre el XML enviado
  - aquí ya conviene revisar shape de firma, estructura del documento o compatibilidad XSD/XAdES
- `authorization_rejected`:
  - el documento pasó la frontera de recepción pero terminó rechazado en autorización
- `technical_failure`:
  - hubo una falla de transporte o de integración que no parece de negocio
- `unknown`:
  - hubo feedback remoto, pero todavía no cayó limpiamente en una categoría conocida

Si `latestRemoteSriSubmissionSummary` ya trae un rechazo claro, úsalo como evidencia más fuerte que un supuesto local: el readiness ahora puede reflejar no solo lo que “parece faltar”, sino también lo último que el SRI ya dijo explícitamente.

Además, `recommendedNextStep` ya toma en cuenta esa categoría remota. Si el último rechazo fue por `taxpayer_not_registered`, la recomendación te va a empujar a alinear el emisor sandbox; si fue `xml_structure`, te va a mandar primero a revisar la firma/XML antes de insistir con otra prueba.

#### `credentialsSecretRef`

Hoy es opcional para el cliente `sri_offline_ws` del repo. Si está vacío, el readiness no debería degradarse por eso solo. Configúralo únicamente cuando tu entorno, proxy o integración necesiten cabeceras adicionales para salir hacia el gateway remoto.

### Nueva lectura recomendada: `documentSupport`

Además de los blockers generales, ahora la respuesta también incluye una matriz `documentSupport`. Úsala así:

- `01`:
  - `previewAvailable = true` y `rideAvailable = true`
  - `schemaValidationAvailable = true` cuando el XSD de factura está presente
  - `submitSupported = true` cuando el carril electrónico de factura puede pasar del preview al submit
- `04`:
  - `previewAvailable = true` y `rideAvailable = true`
  - `schemaValidationAvailable = true` cuando el bundle `notaCredito_V1.0.0.xsd` ya existe en `vendor/sri`
  - `submitSupported = true` cuando el repo ya detecta ese XSD local y el carril `04` puede pasar de preview a submit
- `05`:
  - `previewAvailable = true` y `rideAvailable = true`
  - `schemaValidationAvailable = true` cuando el bundle `notaDebito_V1.0.0.xsd` ya existe en `vendor/sri`
  - `submitSupported = true` cuando el repo ya detecta ese XSD local y el carril `05` puede pasar de preview a submit
- `06`:
  - `previewAvailable = true` y `rideAvailable = true`
  - `schemaValidationAvailable = true` cuando el bundle `guiaRemision_V1.0.0.xsd` ya existe en `vendor/sri`
  - `submitSupported = true` cuando el repo ya detecta ese XSD local y el carril `06` puede pasar de preview a submit
- `07`:
  - `previewAvailable = true` y `rideAvailable = true`
  - `schemaValidationAvailable = true` cuando el bundle `comprobanteRetencion_V2.0.0.xsd` ya existe en `vendor/sri`
  - `submitSupported = true` cuando el repo ya detecta ese XSD local y el carril `07` puede pasar de preview a submit

### Nueva lectura recomendada: material del signer interno

Además del semáforo remoto, ahora la respuesta también expone:

- `internalSignerMaterialStatus`
- `internalSignerMaterialDetail`
- `isInternalSignerMaterialReady`
- `internalSignerCertificateValidityStatus`
- `internalSignerCertificateValidityDetail`
- `internalSignerCertificateValidUntil`
- `isInternalSignerCertificateCurrentlyValid`
- `internalSignerCryptoProofStatus`
- `internalSignerCryptoProofDetail`
- `isInternalSignerCryptographicallyReady`

Úsalo así:

- `not_applicable`:
  - el provider actual no usa PKCS#12, normalmente `stub_local`
- `not_configured`:
  - todavía no existe una configuración activa de firma
- `invalid`:
  - el secret respondió vacío, parece PEM en vez de PKCS#12, o no decodifica como base64/DER utilizable
- `likely_usable`:
  - el material ya parece cargable por una frontera interna, idealmente porque OpenSSL pudo abrir el PKCS#12
  - si el detail menciona metadata faltante o ausencia de OpenSSL en runtime, todavía conviene cerrar esa parte antes de confiar demasiado en el carril interno

### Nueva lectura recomendada: vigencia del certificado interno

Cuando el provider es `xades_pkcs12`, ahora también vale mirar:

- `internalSignerCertificateValidityStatus`
- `internalSignerCertificateValidityDetail`
- `internalSignerCertificateValidUntil`
- `isInternalSignerCertificateCurrentlyValid`

Úsalo así:

- `valid`:
  - el certificado está vigente y no vence dentro del umbral cercano
- `expiring_soon`:
  - el certificado sigue vigente, pero conviene renovarlo pronto
  - no bloquea por sí solo el carril remoto, pero sí deja warning
- `expired`:
  - bloquea el carril remoto interno aunque el PKCS#12 abra bien
- `not_yet_valid`:
  - el certificado todavía no entra en vigencia y el carril remoto interno queda bloqueado
- `unknown`:
  - el keystore abrió, pero no fue posible interpretar con certeza sus fechas
- `not_applicable`:
  - el provider actual no usa PKCS#12

### Nueva lectura recomendada: prueba criptográfica interna

Cuando el provider es `xades_pkcs12`, ahora también vale mirar:

- `internalSignerCryptoProofStatus`
- `internalSignerCryptoProofDetail`
- `isInternalSignerCryptographicallyReady`

Úsalo así:

- `verified`:
  - OpenSSL logró extraer la llave privada, firmar un challenge SHA-256 y verificarlo con el certificado del mismo PKCS#12
  - esto todavía no significa XAdES/SRI listo, pero sí demuestra que la llave privada ya es operable de verdad
- `failed`:
  - el keystore abrió, pero la llave privada no superó la prueba de firma/verificación
  - en ese estado conviene revisar password, compatibilidad del PKCS#12 o material corrupto
- `unknown`:
  - todavía no fue posible ejecutar la prueba real porque la inspección ni siquiera logró abrir bien el PKCS#12
- `not_applicable`:
  - el provider actual no usa PKCS#12

### Nueva lectura recomendada: compatibilidad offline local

Cuando el provider es `xades_pkcs12`, ahora también vale mirar:

- `internalSignerOfflineCompatibilityStatus`
- `internalSignerOfflineCompatibilityDetail`
- `isInternalSignerOfflineCompatible`
- `internalSignerIssuerAlignmentStatus`
- `internalSignerIssuerAlignmentDetail`
- `internalSignerExtractedTaxId`
- `isInternalSignerIssuerAligned`

Úsalo así:

- `verified`:
  - la firma interna pudo firmar comprobantes oficiales del repo y volver a pasar chequeo estructural offline + XSD local
  - esto todavía no significa “sandbox SRI ya listo”, pero sí demuestra que el artefacto firmado ya está mucho más cerca del perfil esperado
- `failed`:
  - la firma interna todavía arma un XML que no supera alguno de los chequeos offline locales
  - normalmente aquí conviene revisar referencias, `SignedProperties`, serial del certificado o compatibilidad final de XAdES
- `unknown`:
  - todavía no fue posible correr la prueba porque falta cerrar una condición previa, normalmente material o prueba criptográfica
- `not_applicable`:
  - el provider actual no usa PKCS#12

### Nueva lectura recomendada: alineación emisor-certificado

Cuando el provider es `xades_pkcs12`, ahora también vale mirar:

- `internalSignerIssuerAlignmentStatus`
- `internalSignerIssuerAlignmentDetail`
- `internalSignerExtractedTaxId`
- `isInternalSignerIssuerAligned`

Úsalo así:

- `matched`:
  - el certificado inspeccionado deja ver un RUC y coincide con el `issuerProfile.taxId` del tenant
- `mismatched`:
  - el certificado sugiere un RUC distinto del emisor fiscal configurado
  - aquí conviene frenar antes de CELCER y alinear primero tenant + PKCS#12
- `unknown`:
  - el keystore abrió, pero no dejó evidencia suficiente para extraer un RUC claro
  - no siempre bloquea por sí solo, pero sí deja pendiente una verificación manual
- `not_applicable`:
  - el provider actual no usa PKCS#12

En la web ahora puedes usar el botón `Usar RUC del certificado` para prefijar el formulario o `Alinear y guardar` para ejecutar la alineación directamente desde backend. En Postman existen `Upsert Electronic Profile Using Signature Tax ID` y `Sync Issuer Profile Tax ID From Signature Certificate`, y ambos aprovechan el RUC extraído de la inspección cuando está disponible.

### Request específico: `Get Electronic Signature Inspection`

Este request complementa el readiness general y te sirve para revisar directamente el keystore del signer interno:

- `inspection.status`
- `inspection.probeMethod`
- `inspection.extractedFingerprint`
- `inspection.extractedSubjectName`
- `inspection.extractedIssuerName`
- `inspection.certificateValidityStatus`
- `inspection.cryptographicProofStatus`
- `inspection.cryptographicProofDetail`
- `inspection.validFrom`
- `inspection.validUntil`
- `inspection.daysUntilExpiry`
- `inspection.detail`

Úsalo especialmente cuando:

- el tenant está en `xades_pkcs12`
- quieres validar si el password realmente abre el PKCS#12
- quieres comparar la huella configurada con la huella extraída
- quieres recuperar el `subjectName` correcto del certificado antes de guardarlo
- quieres revisar si el certificado ya venció o está por vencer antes de intentar sandbox remoto interno
- quieres confirmar si la llave privada realmente firma y verifica un challenge antes de apostar por el signer interno

### Smoke CLI: alineación rápida emisor-certificado

Para evitar repetir a mano:
- inspección del PKCS#12
- lectura del `issuerProfile`
- ajuste del `taxId` usando el RUC extraído del certificado
- y revisión final del readiness

ahora existe este comando:

```sh
pnpm smoke:ec:issuer-alignment -- --sub "OWNER_USER_ID" --email "owner@saas-platform.dev" --tenant-slug "saas-platform-local"
```

Parámetros útiles:
- `--base-url http://127.0.0.1:3000/api`
- `--tenant-slug saas-platform-local`
- `--token TU_JWT` para reutilizar un token ya generado
- `--sub ... --email ...` para que el script genere el JWT local automáticamente
- `--sync-issuer-tax-id` para regrabar el `issuerProfile.taxId` usando el RUC extraído del certificado cuando ya existe un perfil fiscal
- `--require-remote-ready` para que el comando falle si `isReadyForRemoteSandboxSubmission` sigue en `false`

Ejemplo completo:

```sh
pnpm smoke:ec:issuer-alignment -- \
  --sub "OWNER_USER_ID" \
  --email "owner@saas-platform.dev" \
  --tenant-slug "saas-platform-local" \
  --sync-issuer-tax-id \
  --require-remote-ready
```

El script imprime:
- resultado de `electronic-signature/inspection`
- `taxId` actual del emisor
- `internalSignerIssuerAlignmentStatus`
- `internalSignerOfflineCompatibilityStatus`
- último feedback remoto del SRI
- `recommendedNextStep`

Si el perfil fiscal todavía no existe, el smoke no lo inventa; solo reporta el faltante para no pisar datos fiscales sin contexto.

### Bootstrap CLI: pasar de `stub_local + stub_sri` a sandbox remoto interno

Si tu tenant todavía está en configuración local de demo, ahora puedes hacer el salto inicial con un solo comando:

```sh
pnpm smoke:ec:sandbox-bootstrap -- \
  --sub "OWNER_USER_ID" \
  --email "owner@saas-platform.dev" \
  --tenant-slug "saas-platform-local" \
  --sync-issuer-tax-id \
  --require-remote-ready
```

Este bootstrap hace, en orden:
- `POST /electronic-signature` con `provider=xades_pkcs12`
- `POST /electronic-submission` con `provider=sri_offline_ws`
- inspección del PKCS#12
- intento de alineación del `issuerProfile.taxId` usando el RUC extraído del certificado
- revisión final de `electronic-document/readiness`

Defaults importantes:
- `--signature-provider xades_pkcs12`
- `--signature-storage-mode secret_ref`
- `--pkcs12-secret-ref env:EC_PKCS12`
- `--pkcs12-password-secret-ref env:EC_PKCS12_PASSWORD`
- `--submission-provider sri_offline_ws`
- `--submission-environment test`
- `--submission-mode offline`
- `--submission-reception-url https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl`
- `--submission-authorization-url https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl`

Parámetros útiles adicionales:
- `--certificate-label "Firma interna PKCS#12 Sandbox"`
- `--submission-credentials-secret-ref env:EC_SRI_WS_CREDENTIALS`
- `--submission-timeout-ms 15000`
- `--no-hydrate-metadata-from-pkcs12` si quieres evitar que el backend rellene metadata desde el keystore
- `--token TU_JWT` si prefieres reutilizar un token ya generado

Este comando no inventa el perfil fiscal si todavía no existe. Si no encuentra `issuerProfile`, deja el readiness y el diagnóstico listos para que completes primero los datos del emisor.

### Smoke CLI: submit remoto interno de factura (`01`)

Cuando el readiness remoto interno ya esté en verde, puedes hacer una prueba operacional más completa:

```sh
pnpm smoke:ec:remote-submit -- \
  --sub "OWNER_USER_ID" \
  --email "owner@saas-platform.dev" \
  --tenant-slug "saas-platform-local"
```

Este smoke hace, en orden:
- inspección opcional + sincronización del `taxId` del emisor desde el certificado
- verificación de `electronic-document/readiness`
- `POST /numbering/invoice`
- `POST /customers`
- `POST /taxes`
- `POST /invoices`
- `POST /invoices/:invoiceId/items`
- `POST /invoices/:invoiceId/status` con `issued`
- `POST /invoices/:invoiceId/electronic-document/submit`
- `GET /invoices/:invoiceId`

Flags útiles:
- `--bootstrap-remote-sandbox` para configurar antes `xades_pkcs12 + sri_offline_ws`
- `--sync-issuer-tax-id` para alinear el `issuerProfile.taxId` con el RUC extraído del certificado
- `--check-authorization` para disparar además `electronic-document/check-authorization`

## Shared foundation pressure review: `Party` read-only directory

Como primer paso de fundación compartida, el backend ya expone un directorio `Party` montado sobre los `Customer` actuales de `Invoicing`. La idea no es mover persistencia todavía, sino ofrecer una superficie reusable para próximos productos.

Endpoints:

```http
GET /api/parties/tenants/:slug/parties
GET /api/parties/tenants/:slug/parties/:partyId
```

Comportamiento actual:
- exige acceso al producto `invoicing`
- exige permiso `invoicing.customers.read`
- devuelve parties con `roles=["customer"]`
- `sourceContext` actual: `invoicing_customer`

Smoke rápido con `curl`:

```sh
curl -s \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  http://127.0.0.1:3000/api/parties/tenants/saas-platform-local/parties
```

Ejemplo esperado:

```json
[
  {
    "id": "customer_acme",
    "tenantId": "tenant_123",
    "displayName": "Acme Corp",
    "email": "billing@acme.dev",
    "taxId": "1790012345001",
    "identificationType": "04",
    "identification": "1790012345001",
    "billingAddress": "Av. Amazonas N34-451 y Av. Atahualpa",
    "roles": ["customer"],
    "kind": "organization",
    "sourceContext": "invoicing_customer"
  }
]
```

Este slice sirve como prueba de arquitectura:
- reutiliza datos existentes sin mover tablas
- nos deja validar si `Ecommerce`, `Growth` u otros dominios realmente necesitan leer `Party`
- posterga con seguridad la decisión difícil de extraer escritura y persistencia

## Growth slice: tenant lead capture

El primer slice de `Growth & Conversations` ya vive en backend como captura de leads tenant-aware, sin abrir todavía inbox de WhatsApp.

Endpoints:

```http
GET /api/growth/tenants/:slug/leads
GET /api/growth/tenants/:slug/leads/:leadId
POST /api/growth/tenants/:slug/leads
```

Permisos:
- `growth.leads.read`
- `growth.leads.manage`

Ejemplo de creación:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/leads \
  -d '{
    "fullName": "Maria Perez",
    "email": "maria@example.com",
    "phoneE164": "+593999111222",
    "whatsappE164": "+593999111222",
    "source": "landing_page",
    "status": "captured",
    "notes": "Quiere demo del modulo de facturacion."
  }'
```

Notas de alcance:
- este slice ya tiene persistencia propia (`Lead`)
- todavía no crea `Party` automáticamente
- todavía no existe inbox de WhatsApp
- ahora sí existe una fundación manual mínima de conversaciones ligada opcionalmente a `Lead`

## Growth slice: conversation thread foundation

Este segundo corte de `Growth & Conversations` abre un primer carril manual de threads y mensajes dentro del tenant. Todavía no hay inbox omnicanal ni integración con WhatsApp, pero ya existe una estructura útil para empezar a conectar `Lead` con seguimiento comercial.

Endpoints:

```http
GET /api/growth/tenants/:slug/conversations
GET /api/growth/tenants/:slug/conversations/:threadId
POST /api/growth/tenants/:slug/conversations
GET /api/growth/tenants/:slug/conversations/:threadId/messages
POST /api/growth/tenants/:slug/conversations/:threadId/messages
```

Permisos:
- `growth.conversations.read`
- `growth.conversations.manage`

Ejemplo de creación de thread:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations \
  -d '{
    "leadId": "LEAD_ID_OPCIONAL",
    "subject": "Seguimiento demo facturacion electronica",
    "channel": "manual",
    "status": "open"
  }'
```

Ejemplo de creación de mensaje:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/THREAD_ID/messages \
  -d '{
    "direction": "outbound",
    "body": "Hola, te comparto la propuesta de onboarding para el modulo.",
    "externalMessageId": null
  }'
```

Notas de alcance:
- este slice ya tiene persistencia propia (`ConversationThread`, `ConversationMessage`)
- el canal inicial es una fundación manual, no un inbox conectado
- el siguiente paso natural en `Growth` es abrir pipeline o integrar un inbox real sobre esta base

## Growth slice: pipeline foundation

Este tercer corte de `Growth & Conversations` abre un pipeline comercial mínimo con `Opportunity`, enlazable opcionalmente a `Lead` y `ConversationThread`. Todavía no hay automatizaciones ni vista kanban, pero ya existe una base operable para seguimiento comercial por etapa.

Endpoints:

```http
GET /api/growth/tenants/:slug/opportunities
GET /api/growth/tenants/:slug/opportunities/:opportunityId
POST /api/growth/tenants/:slug/opportunities
PUT /api/growth/tenants/:slug/opportunities/:opportunityId/stage
```

Permisos:
- `growth.opportunities.read`
- `growth.opportunities.manage`

Ejemplo de creación:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/opportunities \
  -d '{
    "leadId": "LEAD_ID_OPCIONAL",
    "threadId": "THREAD_ID_OPCIONAL",
    "title": "Onboarding anual facturacion electronica",
    "stage": "proposal",
    "amountInCents": 199000,
    "currency": "USD",
    "notes": "Cliente con alto interes y decision esta semana."
  }'
```

Ejemplo de cambio de etapa:

```sh
curl -s \
  -X PUT \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/opportunities/OPPORTUNITY_ID/stage \
  -d '{
    "stage": "won"
  }'
```

Notas de alcance:
- este slice ya tiene persistencia propia (`Opportunity`)
- `Opportunity` ya soporta `assigneeUserId` como ownership explícito dentro del tenant
- el pipeline todavía no tiene vista kanban ni automatizaciones
- el siguiente paso natural en `Growth` es sumar inbox real o enriquecer pipeline con activities, analytics o conversiones

Ejemplo de assignment:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/opportunities/OPPORTUNITY_ID/assignment \
  -d '{
    "assigneeUserId": "USER_ID_DEL_TENANT"
  }'
```

## Growth slice: WhatsApp inbox foundation

Este cuarto corte de `Growth & Conversations` ya abre una fundación de inbox para WhatsApp sobre los mismos `ConversationThread` y `ConversationMessage`. Todavía no existe integración real con proveedor ni webhooks definitivos, pero ya podemos ingestar mensajes inbound, agruparlos por `externalConversationId` y listarlos como inbox.

Endpoints:

```http
GET /api/growth/tenants/:slug/conversations/whatsapp-inbox
POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/messages
```

Permisos:
- `growth.conversations.read`
- `growth.conversations.manage`

Ejemplo de ingesta inbound:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-inbox/messages \
  -d '{
    "externalConversationId": "wa_conv_001",
    "participantHandle": "+593999111222",
    "participantDisplayName": "Maria Perez",
    "leadId": "LEAD_ID_OPCIONAL",
    "body": "Hola, quiero retomar la propuesta.",
    "externalMessageId": "wamid-001",
    "occurredAt": "2026-05-16T14:00:00.000Z"
  }'
```

Notas de alcance:
- este slice reutiliza `ConversationThread` y `ConversationMessage`
- `ConversationThread` ya soporta `assigneeUserId` como ownership explícito dentro del tenant
- el inbox ya puede registrar outbound y eventos de entrega internos
- ahora también puede usar un gateway outbound real de Meta Cloud API cuando el entorno tenga `GROWTH_WHATSAPP_OUTBOUND_PROVIDER=meta_cloud_api`, `GROWTH_WHATSAPP_META_ACCESS_TOKEN` y `GROWTH_WHATSAPP_META_OUTBOUND_PHONE_NUMBER_ID`
- si esos envs no existen, el mismo endpoint cae de forma segura al carril `meta_cloud_api_stub`
- ahora también soporta `WhatsApp message templates` tenant-aware y `outboundIntentKey` para dar semántica comercial explícita al outbound
- cuando un template ya tiene `providerTemplateName` y `providerApprovalStatus=approved`, el gateway real usa payload `type=template` contra Meta Cloud API
- ahora también existe una vista derivada de reporting para medir outbound por `outboundIntentKey` y por template
- ahora también existe una primera fundación de automatizaciones con reglas persistidas y sugerencias por thread
- los delivery events ahora guardan semántica enriquecida del provider como categorías y error code cuando exista
- el siguiente paso natural ya no es foundation básica, sino ejecución automática más profunda o semántica de proveedor todavía más fina

Templates disponibles:

```http
GET /api/growth/tenants/:slug/conversations/whatsapp-templates
GET /api/growth/tenants/:slug/conversations/whatsapp-templates/:templateId
POST /api/growth/tenants/:slug/conversations/whatsapp-templates
```

Automatizaciones disponibles:

```http
GET /api/growth/tenants/:slug/conversations/whatsapp-automations
GET /api/growth/tenants/:slug/conversations/whatsapp-automations/:automationId
POST /api/growth/tenants/:slug/conversations/whatsapp-automations
GET /api/growth/tenants/:slug/conversations/:threadId/whatsapp-automation-suggestions
```

Ejemplo de creación:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-templates \
  -d '{
    "key": "follow_up_demo",
    "name": "Follow Up Demo",
    "languageCode": "es_EC",
    "category": "utility",
    "bodyTemplate": "Hola {{firstName}}, retomamos la demo de {{product}}.",
    "intentKey": "follow_up",
    "providerTemplateName": "follow_up_demo_meta",
    "providerApprovalStatus": "approved"
  }'
```

Estados de aprobación soportados:
- `draft`
- `pending_review`
- `approved`
- `rejected`

Semántica:
- `approved` habilita el carril `template` cuando el provider real Meta está activo
- cualquier otro estado conserva el template como modelo interno, pero el envío sigue pudiendo caer a `text`

Ejemplo de outbound:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-inbox/THREAD_ID/outbound-messages \
  -d '{
    "body": "Perfecto, te escribo en unos minutos.",
    "externalMessageId": "wamid-002",
    "occurredAt": "2026-05-16T14:05:00.000Z"
  }'
```

Ejemplo de outbound usando template + intent:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-inbox/THREAD_ID/outbound-messages \
  -d '{
    "templateId": "TEMPLATE_ID",
    "templateVariables": {
      "firstName": "Maria",
      "product": "facturacion"
    },
    "outboundIntentKey": "follow_up",
    "externalMessageId": "wamid-002",
    "occurredAt": "2026-05-16T14:05:00.000Z"
  }'
```

Ejemplo de evento de entrega:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-inbox/delivery-events \
  -d '{
    "externalMessageId": "wamid-002",
    "deliveryStatus": "delivered",
    "occurredAt": "2026-05-16T14:06:00.000Z"
  }'
```

Inspección de delivery events persistidos:

```http
GET /api/growth/tenants/:slug/conversations/:threadId/messages/:messageId/delivery-events
```

Ejemplo:

```sh
curl -s \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/THREAD_ID/messages/MESSAGE_ID/delivery-events
```

Campos enriquecidos que ahora puedes esperar en cada delivery event:
- `providerStatusDetail`
- `providerConversationCategory`
- `providerPricingCategory`
- `providerErrorCode`

Semántica operativa importante:
- al crear un outbound message ahora también se persiste un primer delivery event inmediato
- ese primer evento representa si el provider aceptó o rechazó el send (`pending`, `sent` o `failed`)
- después pueden llegar eventos adicionales del webhook con estados más profundos como `delivered` o `read`
- esto permite distinguir entre “el provider aceptó el mensaje” y “el destinatario realmente lo recibió o leyó”

Ejemplo de assignment de thread:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/THREAD_ID/assignment \
  -d '{
    "assigneeUserId": "USER_ID_DEL_TENANT"
  }'
```

Vista rápida de workload por owner:

```http
GET /api/growth/tenants/:slug/assignment-workload
GET /api/growth/tenants/:slug/conversations?assigneeUserId=:userId
GET /api/growth/tenants/:slug/conversations/whatsapp-inbox?assigneeUserId=:userId
GET /api/growth/tenants/:slug/opportunities?assigneeUserId=:userId
```

Ejemplo:

```sh
curl -s \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/assignment-workload
```

Qué devuelve esta vista:
- threads abiertos totales
- threads abiertos sin owner
- oportunidades abiertas totales
- oportunidades abiertas sin owner
- monto abierto agregado
- carga por usuario con split entre `whatsapp`, `manual`, `open`, `won` y `lost`

Esto sirve para responder rápidamente:
- quién tiene carga operativa hoy
- cuánto está sin asignar
- cuánto pipeline abierto está concentrado en cada owner
- y filtrar inbox u oportunidades por `assigneeUserId` sin montar todavía una UI de workload completa

Vista rápida de workbench / SLA de conversaciones:

```http
GET /api/growth/tenants/:slug/conversations/workbench
```

Query params opcionales:
- `assigneeUserId`
- `channel=manual|whatsapp`
- `firstResponseSlaHours`
- `followUpSlaHours`
- `staleThreadHours`

Ejemplo:

```sh
curl -s \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  "http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/workbench?channel=whatsapp&firstResponseSlaHours=2&followUpSlaHours=6&staleThreadHours=24"
```

Qué devuelve esta vista:
- conteo de threads abiertos y sin owner
- split entre conversaciones esperando al equipo y esperando al cliente
- conteo de `overdueFirstResponse`
- conteo de `overdueFollowUp`
- conteo de `staleThread`
- `threads[]` priorizado para operación diaria

Por thread incluye:
- `nextActionOwner`
- `firstResponseStatus`
- `followUpStatus`
- `staleStatus`
- `priority`
- `hoursSinceLastActivity`
- `hoursSinceLastInbound`

Esto sirve para responder rápidamente:
- qué conversaciones requieren acción del equipo ahora mismo
- cuáles están a punto de romper o ya rompieron SLA
- cuáles siguen sin owner
- y cómo filtrar el workbench por owner o por canal antes de tener una UI completa

Vista rápida de reporting outbound WhatsApp:

```http
GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/outbound-summary
```

Ejemplo:

```sh
curl -s \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-reporting/outbound-summary
```

Qué devuelve esta vista:
- totales de outbound WhatsApp
- split entre mensajes `freeform` y mensajes basados en template
- conteo de templates ya `approved`
- estado actual del funnel de entrega (`pending`, `sent`, `delivered`, `read`, `failed`)
- agregado por `outboundIntentKey`
- agregado por template, incluyendo `providerTemplateName` y `providerApprovalStatus`
- agregado por provider (`byProvider`)
- agregado por clase/fase de fallo (`byFailureClass`)
- agregado por taxonomía fina del provider (`byProviderTaxonomy`)
- top de `providerErrorCode` observados en fallos
- postura operativa de retry/backoff (`retryOperations`)
- dashboard operativo resumido (`operationalDashboard`)
- alertas operativas derivadas (`operationalAlerts`)

Esto sirve para responder rápidamente:
- qué intención comercial estamos ejecutando más
- qué templates se están usando de verdad
- cuántos mensajes siguen libres vs semánticos
- qué parte del outbound ya está apoyándose en templates alineados con proveedor
- qué provider está concentrando los fallos
- qué error codes se están repitiendo
- y cuántos fallos parecen reintentables vs permanentes

Lectura operativa de los nuevos bloques:
- `byProvider` resume volumen y estados por gateway/proveedor efectivo
- `byFailureClass` separa mejor si el problema fue rate limiting, policy, destinatario o configuración, y además distingue rechazo inmediato vs fallo asíncrono
- `byProviderTaxonomy` baja un nivel más, con familias y detalles como `throughput_limit / meta_pair_rate_limit` o `recipient_reachability / meta_recipient_unreachable`
- `topProviderErrorCodes` ahora también expone `failureClass`, `failurePhase`, `retryDisposition`, `providerTaxonomyFamily` y `providerTaxonomyDetail`, ayudando a detectar patrones como throttling, policy blocks o destinos inválidos
- `retryOperations` resume:
  - cuántos mensajes fallidos totales tenemos
  - cuántos parecen reintentables
  - cuántos parecen permanentes
  - cuántos siguen bloqueados por cooldown
  - cuántos ya están listos para retry
- `operationalDashboard` resume el estado general del carril outbound:
  - `overallStatus`
  - tasa de rechazo inmediato
  - tasa de fallo asíncrono
  - cola lista para retry
  - cola bloqueada por cooldown
  - taxonomía dominante del momento
- `operationalThresholds` expone los thresholds calibrados que hoy gobiernan esas alertas
- `operationalAlerts` convierte esa lectura en items accionables con severidad y recomendación

Semántica actual de provider:
- `immediate_send_rejection` cubre rechazos que nacen en el intento de envío inicial
- `asynchronous_delivery_failure` cubre fallos reportados después por delivery webhook/event
- `failureClass` clasifica los fallos en `rate_limited`, `recipient_issue`, `policy_block`, `auth_or_configuration`, `provider_transient` o `unknown`
- `providerTaxonomyFamily` traduce esos fallos a buckets operativos más finos como `throughput_limit`, `template_policy`, `quality_enforcement` o `permission_scope`
- `providerTaxonomyDetail` deja un detalle más específico inspirado en Meta, como `meta_pair_rate_limit`, `meta_template_not_approved`, `meta_quality_hold` o `meta_access_token_invalid`
- `retryDisposition` traduce esa lectura a operación: `retryable` o `permanent`

Thresholds calibrados actualmente:
- `immediateSendRejectionRateWarning = 0.05`
- `asynchronousDeliveryFailureRateWarning = 0.03`
- `readyRetryQueueWarningCount = 1`
- `cooldownRetryQueueWarningCount = 3`
- `authOrConfigurationCriticalCount = 1`
- `policyBlockCriticalCount = 1`
- `rateLimitedWarningCount = 1`
- `unknownFailureWarningCount = 1`

Retry manual de un mensaje fallido listo para reintento:

```http
POST /api/growth/tenants/:slug/conversations/:threadId/messages/:messageId/retry
```

Ejemplo:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/thread_whatsapp_001/messages/message_whatsapp_002/retry \
  -d '{
    "occurredAt": "2026-05-16T14:12:00.000Z"
  }'
```

Reglas actuales del retry manual:
- usa la misma clasificación y cooldown que expone `retryOperations`
- solo permite retry sobre mensajes outbound WhatsApp con estado `failed`
- rechaza fallos clasificados como permanentes
- rechaza mensajes que todavía siguen en cooldown
- reintenta mensajes `freeform` de forma fiel
- reintenta mensajes por template usando el snapshot persistido del render original
- si el mensaje fue enviado antes de que existiera ese snapshot durable, responde error explícito y lo deja visible como deuda operativa legacy

Runner tenant-scoped para retries listos:

```http
POST /api/growth/tenants/:slug/conversations/whatsapp-reporting/retry-ready
```

Ejemplo:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-reporting/retry-ready \
  -d '{
    "limit": 25,
    "occurredAt": "2026-05-19T09:15:00.000Z"
  }'
```

Qué hace este runner:
- revisa mensajes outbound fallidos del tenant
- ignora mensajes ya superseded por un retry hijo
- aplica la misma clasificación `retryable` vs `permanent`
- solo ejecuta los que ya están `readyNow`
- devuelve un resumen con reintentos hechos, cooldowns pendientes y fallos permanentes

Esto deja lista la semántica para enchufar un cron/job después sin reescribir el núcleo.

Monitor operativo tenant-scoped para scheduler externo:

```http
POST /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor
```

Ejemplo:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-reporting/monitor \
  -d '{
    "autoRunReadyRetries": true,
    "retryReadyLimit": 25,
    "occurredAt": "2026-05-20T10:00:00.000Z"
  }'
```

Qué hace este monitor:
- devuelve `operationalThresholds`, `operationalDashboard` y `operationalAlerts` en un solo snapshot
- cuenta alertas `warning` y `critical`
- si `autoRunReadyRetries=true`, dispara también el runner de retries listos
- deja un `retryRunnerSummary` listo para que un cron o monitor externo lo persista o lo envíe a logs/observabilidad

Consumer web inicial para este snapshot operativo:
- levanta el frontend con `pnpm dev:web`
- carga un Bearer token con acceso al tenant
- si el usuario expone `growth.conversations.read`, aparece una consola nueva de:
  - `workbench` SLA de conversaciones
  - `operational summary`
  - `operational alerts`
  - `provider taxonomy`
  - ejecución manual de `monitor`
- si el tenant además publica `growth` dentro de `GET /api/tenancy/tenants/:slug/products`, la UI lo refleja como contexto comercial; si ese `product key` todavía no aparece pero el permiso efectivo sí existe, el consumer no se oculta
- la UX del consumer ahora también deja:
  - un `operator brief` que resume si la cola está saludable, en warning o crítica
  - reseteo rápido de la `workbench policy`
  - empty states con contexto cuando los filtros esconden threads
  - lectura resumida del último `monitor` manual y de los retries evaluados
  - `drill-down inspector` para alertas, taxonomías, códigos del provider, threads e historial
  - `acknowledgements` compartidos por alerta, persistidos por tenant en backend
  - `monitor history` compartido, alimentado por corridas manuales y del scheduler
  - una consola `fleet` cross-tenant para operadores con permiso en varias tenancies:
    - ordena qué tenant atender primero por estado, alertas activas y ready-now retries
    - resume hotspots compartidos y taxonomías repetidas entre tenancies
    - permite saltar desde el radar fleet al workspace puntual del tenant elegido
    - ya incluye primeras lecturas de `escalation candidates` y `staffing pressure` usando workbench + monitor history compartidos
    - ahora también expone:
      - `runbooks` operativos derivados del estado fleet
      - una `ownership queue` cross-tenant para threads que piden owner o follow-up más urgente
      - una cola compartida de `operational cases` persistidos para:
        - `alert_escalation`
        - `ownership_routing`
        - `follow_up`
      - acciones de workflow compartido sobre esos casos:
        - crear o reabrir por `sourceKey`
        - `take`
        - `resolve`
        - `reopen`
        - actualizar estado explícito de `follow_up` entre `pending_team`, `scheduled` y `waiting_customer`
      - cada caso ahora también expone un `routingPolicyKey` calculado, por ejemplo:
        - `growth_ops`
        - `escalation_review`
        - `owner_assignment`
        - `follow_up_team`
        - `follow_up_waiting_customer`
      - la cola ya no se muestra plana:
        - fleet y tenant actual ahora pueden filtrarse por `routingPolicyKey`
        - ambos consumers agrupan los casos visibles por lane para que `growth_ops`, `owner_assignment` y los dos carriles de `follow_up` se lean como colas operativas distintas
      - además ya existe una revisión manual de routing:
        - `POST /api/growth/tenants/:slug/conversations/operational-cases/review-routing`
        - promueve a `escalation_review` los `follow_up` u `ownership_routing` vencidos
        - también endurece prioridad a `critical` cuando el caso ya se atrasó y sigue requiriendo intervención del equipo
      - además ya existe una primera auto-asignación opinada:
        - `POST /api/growth/tenants/:slug/conversations/operational-cases/auto-assign`
        - solo revisa lanes que sí requieren intervención activa del equipo:
          - `owner_assignment`
          - `follow_up_team`
          - `escalation_review`
        - primero intenta heredar el owner del thread cuando ya exista uno elegible
        - si el thread todavía no tiene owner, asigna el caso al operador elegible con menor carga abierta
        - cuando el caso apunta a un thread sin owner, el mismo pass también alinea `ConversationThread.assigneeUserId`
        - ahora también acepta `policyKey` para cambiar la estrategia sin tocar código:
          - `balanced`
          - `owner_queue_first`
          - `follow_up_first`
        - además cada tenant ya puede guardar su pack por defecto:
          - `GET /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings`
          - `PUT /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings`
        - cuando `POST /api/growth/tenants/:slug/conversations/operational-cases/auto-assign` corre sin `policyKey`, usa ese default persistido del tenant
        - la respuesta ya deja auditado:
          - qué `policyKey` corrió
          - cuántos casos heredaron owner existente
          - cuántos cayeron por fallback de menor carga
      - el consumer web ahora también expone una primera capa `Growth Assist` sobre ese mismo core:
        - traduce la cola operativa en una agenda simple tipo “qué hacer ahora”
        - resume en lenguaje de negocio cuántas conversaciones requieren respuesta, seguimiento o reordenar owner
        - muestra recordatorios de `waiting_customer` sin obligar al usuario a entender primero los lanes técnicos
        - además ya muestra cues más opinados para negocio:
          - calor simple de conversaciones (`lead caliente`, `en movimiento`, `en radar`)
          - sugerencias de arranque de respuesta en lenguaje comercial sencillo
          - playbooks cortos según el estado del workbench, los casos operativos y la salud del canal
        - esa misma capa ahora también trae sugerencias de reply más accionables:
          - motivo de por qué conviene responder
          - objetivo del mensaje
          - borrador listo para adaptar
          - prompt corto para destrabar la respuesta
          - checklist simple para no olvidar el siguiente paso
        - y ahora además resume el día en un bloque todavía más simple:
          - `nextActions`
          - la idea es responder a “si solo haces 3 cosas hoy, ¿cuáles son?”
          - con porqué conviene hacerlas ahora, qué acción recomienda el sistema y qué impacto comercial evita
        - y ahora también publica un radar de calor más explícito:
          - `leadWarmthSummary`
          - `leadWarmthHints`
          - eso permite explicar cuántos leads se ven `hot`, `warm` o `watch`, por qué se ven así y con qué cadencia conviene moverlos
        - los `playbooks` ya no son solo “qué hacer”:
          - ahora también dicen `goal`
          - `avoid`
          - `successSignal`
          - con eso un operador no experto entiende mejor qué está tratando de lograr y cómo se ve una buena ejecución
        - los playbooks también ya aterrizan a `whenToUse` y `steps`, para que un negocio pequeño no tenga que traducir la consola operativa por su cuenta
        - reutiliza el mismo `workbench`, `operational cases`, `outbound-summary` y `auto-assignment-settings`; no abre un segundo backend paralelo
      - ese modo asistido ya tiene su propio contrato backend:
        - `GET /api/growth/tenants/:slug/conversations/assist/daily-agenda`
        - resume:
          - `summary`
          - `tasks`
          - `conversationCues`
          - `replySuggestions`
          - `nextActions`
          - `leadWarmthSummary`
          - `leadWarmthHints`
          - `playbooks`
          - `waitingCustomerQueue`
          - `channelHealth`
        - con eso la web ya no depende solo de heurísticas locales para explicar “qué hacer hoy”
      - además ya existe el primer corte transversal de la `AI Capability Platform`:
        - `GET /api/ai/agents`
          - devuelve el catálogo transversal de agentes
          - hoy expone:
            - `growth-assist-coach` como `ready`
            - `invoice-document-assistant` como `planned`
            - `ecommerce-launch-assistant` como `planned`
        - `GET /api/ai/tenants/:slug/agents/growth-assist-coach/suggestion-envelope`
          - prepara un envelope `tenant-scoped` en modo `suggestion`
          - toma como fuente el contrato determinístico `growth.assist.daily_agenda`
          - devuelve:
            - `agent`
            - `surface`
            - `promptPack`
            - `objective`
            - `constraints`
            - `suggestedOutputs`
            - `contextBlocks`
          - importante:
            - no ejecuta acciones
            - no envía mensajes
            - no reemplaza reglas del dominio
            - solo prepara el handoff auditable para una futura capa de modelo
        - ese mismo corte ahora ya expone un `prompt registry` transversal:
          - `GET /api/ai/prompts`
          - `GET /api/ai/agents/:agentKey/prompt-pack`
          - eso deja explícito por agente:
            - `key`
            - `version`
            - `objective`
            - `styleGuidance`
            - `constraints`
            - `suggestedOutputs`
          - con esto el prompt pack deja de vivir “escondido” dentro del envelope y pasa a ser una pieza versionable y visible de la plataforma AI
- el consumer ya no depende solo de `localStorage` para esa memoria operativa; ahora lee y escribe:
  - `GET /api/growth/tenants/:slug/conversations/operational-cases`
    - acepta `status`
    - acepta `routingPolicyKey`
  - `GET /api/growth/tenants/:slug/conversations/assist/daily-agenda`
  - `GET /api/ai/agents`
  - `GET /api/ai/prompts`
  - `GET /api/ai/agents/:agentKey/prompt-pack`
  - `GET /api/ai/tenants/:slug/agents/growth-assist-coach/suggestion-envelope`
  - `GET /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings`
  - `POST /api/growth/tenants/:slug/conversations/operational-cases`
  - `POST /api/growth/tenants/:slug/conversations/operational-cases/auto-assign`
  - `PUT /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings`
  - `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/take`
  - `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/resolve`
  - `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/reopen`
  - `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/follow-up-state`
  - `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor-runs`
  - `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor-analytics`
  - `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/alert-acknowledgements`
  - `PUT /api/growth/tenants/:slug/conversations/whatsapp-reporting/alert-acknowledgements/:alertKey`
  - `DELETE /api/growth/tenants/:slug/conversations/whatsapp-reporting/alert-acknowledgements/:alertKey`
- esa misma historia compartida ya alimenta una primera lectura de calibración:
  - frecuencia histórica de alertas
  - reparto manual vs scheduler
  - sugerencias de ajuste para thresholds como `immediateSendRejectionRateWarning`, `asynchronousDeliveryFailureRateWarning`, `readyRetryQueueWarningCount` y `cooldownRetryQueueWarningCount`
- si además el usuario tiene `growth.conversations.manage`, desde la misma UI puede ejecutar el monitor con `autoRunReadyRetries`

La UI consume:
- `GET /api/growth/tenants/:slug/conversations/workbench`
- `GET /api/growth/tenants/:slug/conversations/operational-cases`
- `GET /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings`
- `POST /api/growth/tenants/:slug/conversations/operational-cases`
- `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/take`
- `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/resolve`
- `POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/reopen`
- `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/outbound-summary`
- `PUT /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings`
- `POST /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor`
- `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor-runs`
- `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor-analytics`
- `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/alert-acknowledgements`
- `PUT /api/growth/tenants/:slug/conversations/whatsapp-reporting/alert-acknowledgements/:alertKey`
- `DELETE /api/growth/tenants/:slug/conversations/whatsapp-reporting/alert-acknowledgements/:alertKey`

Scheduler interno del API para este monitor:
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_SCHEDULER_ENABLED=true`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_TENANT_SLUGS=saas-platform-local`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_INTERVAL_MS=60000`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_AUTO_RUN_READY_RETRIES=true`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_RETRY_READY_LIMIT=25`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_WEBHOOK_URL=https://...`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_AUTH_HEADER_NAME=x-monitor-token`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_AUTH_HEADER_VALUE=...`
- `GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_TIMEOUT_MS=5000`

Con eso, el API ejecuta el monitor periódicamente al levantar el proceso y deja logs resumidos por tenant:
- `healthy`
- `warning`
- `critical`

Y además puede publicar cada snapshot del monitor hacia observabilidad externa real por webhook HTTP. El payload incluye:
- `source`
- `eventType`
- `emittedAt`
- `summary`

Eso permite conectarlo de forma simple a:
- una Lambda / Cloud Function receptora
- un collector HTTP propio
- un pipeline que reenvíe a Datadog, Grafana, OpenSearch o similares

Collector local para pruebas end-to-end:

Terminal aparte:

```sh
pnpm dev:whatsapp-monitor-collector
```

Eso levanta por defecto:
- `http://127.0.0.1:4011/health`
- `http://127.0.0.1:4011/ingest`
- `http://127.0.0.1:4011/events`

Luego configura en el API:

```txt
GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_WEBHOOK_URL=http://127.0.0.1:4011/ingest
```

Smoke end-to-end del cable de observabilidad:

```sh
pnpm smoke:growth:whatsapp-monitor-observability -- \
  --tenant-slug saas-platform-local \
  --collector-base-url http://127.0.0.1:4011 \
  --sub TU_OWNER_SUB \
  --email owner@saas-platform.dev
```

Qué verifica este smoke:
- llama el endpoint `POST /growth/tenants/:slug/conversations/whatsapp-reporting/monitor`
- confirma que el collector recibió un evento nuevo
- valida que el `tenantSlug` emitido coincide con el tenant monitoreado

Smoke end-to-end de taxonomía operativa con un fallo WhatsApp controlado:

```sh
pnpm smoke:growth:whatsapp-provider-taxonomy -- \
  --tenant-slug saas-platform-local \
  --collector-base-url http://127.0.0.1:4011 \
  --sub TU_OWNER_SUB \
  --email owner@saas-platform.dev
```

Qué verifica este smoke:
- crea un thread WhatsApp local para pruebas
- registra un outbound y luego un `deliveryStatus=failed`
- valida que `GET /growth/tenants/:slug/conversations/whatsapp-reporting/outbound-summary` clasifica el error en la taxonomía esperada
- vuelve a correr el monitor
- confirma que el collector recibió un snapshot nuevo con `leadingProviderTaxonomyFamily`, `leadingProviderTaxonomyDetail` y `operationalAlerts` coherentes

Valores por defecto de esta smoke:
- `providerErrorCode=131053`
- `expectedTaxonomyFamily=throughput_limit`
- `expectedTaxonomyDetail=meta_pair_rate_limit`

Detalles finos de taxonomía Meta que ya quedan distinguidos:
- `meta_api_throttle`
- `meta_pair_rate_limit`
- `meta_recipient_unreachable`
- `meta_reengagement_restriction`
- `meta_template_not_approved`
- `meta_quality_hold`
- `meta_account_block`
- `meta_access_token_invalid`
- `meta_missing_permission`
- `meta_phone_number_id_invalid`
- `meta_platform_error`
- `provider_unavailable`

Ejemplo de creación de automation rule:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-automations \
  -d '{
    "key": "follow_up_unassigned",
    "name": "Follow Up Unassigned",
    "triggerEvent": "inbound_message",
    "matchOutboundIntentKey": "follow_up",
    "matchAssigneeMode": "unassigned",
    "templateId": "TEMPLATE_ID",
    "actionType": "send_template",
    "actionOutboundIntentKey": "follow_up"
  }'
```

Semántica actual de esta fundación:
- las reglas con `actionType: "suggest_template"` siguen funcionando como recomendación
- las reglas con `actionType: "send_template"` ya ejecutan un envío real cuando entra el evento compatible
- el auto-send queda deduplicado por evento y regla para soportar retries y replays
- el auto-send solo corre cuando el template está `active`, `approved` y con `providerTemplateName` listo
- las variables se resuelven con el contexto actual del thread/lead (`firstName`, `fullName`, `participantDisplayName`, `participantHandle`, `leadEmail`, `leadPhoneE164`, `leadWhatsappE164`, `tenantSlug`, `threadId`)

Ejemplo de sugerencias:

```sh
curl -s \
  -H "Authorization: Bearer TU_OWNER_TOKEN" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/THREAD_ID/whatsapp-automation-suggestions
```

Ejemplo práctico de auto-ejecución:
- crea un template provider-approved
- crea una regla `send_template`
- ingresa un inbound por `POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/messages`
- o registra un delivery event por `POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/delivery-events`
- y el backend disparará el `outbound-message` automáticamente si la regla matchea

## Growth slice: Meta-like webhook foundation

Este siguiente corte abre una frontera pública de webhook para WhatsApp con semántica inspirada en Meta Cloud API y ya con una primera capa operativa de autenticidad/routing. La idea es que el backend ya pueda:
- verificar un webhook
- recibir payloads inbound
- procesar delivery statuses
- enrutar todo eso al inbox existente
- validar firma `X-Hub-Signature-256` cuando usamos la ruta provider-facing
- resolver tenant por metadata del proveedor cuando no queremos depender del `slug` en la URL
- persistir el envelope recibido para trazabilidad e idempotencia
- ignorar reintentos del mismo envelope sin volver a disparar side effects

Endpoints públicos:

```http
GET /api/growth/webhooks/whatsapp/meta
POST /api/growth/webhooks/whatsapp/meta
GET /api/growth/webhooks/whatsapp/meta/tenants/:slug
POST /api/growth/webhooks/whatsapp/meta/tenants/:slug
```

Verificación:
- requiere `GROWTH_WHATSAPP_META_VERIFY_TOKEN` en el entorno del backend
- compara el `hub.verify_token` recibido con ese valor
- la ruta `POST /meta` además requiere `GROWTH_WHATSAPP_META_APP_SECRET`
- el routing provider-facing puede usar:
  - `GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP`
  - `GROWTH_WHATSAPP_META_BUSINESS_ACCOUNT_ID_TENANT_MAP`

Ejemplo de verificación:

```sh
curl -i \
  "http://127.0.0.1:3000/api/growth/webhooks/whatsapp/meta?hub.mode=subscribe&hub.verify_token=TU_VERIFY_TOKEN&hub.challenge=challenge-xyz"
```

Ejemplo de mapping por `phone_number_id`:

```sh
export GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP='{"1234567890":"saas-platform-local"}'
```

Ejemplo de payload `Meta-like` por la ruta provider-facing:

```sh
RAW_PAYLOAD='{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "waba-001",
      "changes": [
        {
          "field": "messages",
          "value": {
            "metadata": {
              "phone_number_id": "1234567890",
              "display_phone_number": "+593999111222"
            },
            "contacts": [
              {
                "wa_id": "+593999111222",
                "profile": {
                  "name": "Maria Perez"
                }
              }
            ],
            "messages": [
              {
                "id": "wamid-001",
                "from": "+593999111222",
                "timestamp": "1715868000",
                "type": "text",
                "text": {
                  "body": "Hola, quiero retomar la propuesta."
                }
              }
            ],
            "statuses": [
              {
                "id": "wamid-002",
                "status": "delivered",
                "timestamp": "1715868060"
              }
            ]
          }
        }
      ]
    }
  ]
}'

SIGNATURE=$(printf '%s' "$RAW_PAYLOAD" | openssl dgst -sha256 -hmac "$GROWTH_WHATSAPP_META_APP_SECRET" -hex | sed 's/^.* //')

curl -s \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  http://127.0.0.1:3000/api/growth/webhooks/whatsapp/meta \
  -d "$RAW_PAYLOAD"
```

Notas de alcance:
- esta fundación ya no requiere auth bearer en esas rutas públicas
- la ruta con `:slug` sigue siendo útil para pruebas locales y slices tempranos
- la ruta provider-facing ya valida firma HMAC y puede resolver tenant por `phone_number_id` o `business_account_id`
- el webhook ya persiste envelope con `eventKey`, `payloadHash`, metadata externa y estado de procesamiento
- un reintento del mismo envelope responde como `duplicate=true` y no vuelve a ejecutar la ingestión interna
- ahora también existe superficie autenticada para inspección y replay operativo del envelope persistido
- los `statuses` del provider ya pueden aterrizar como `ConversationDeliveryEvent` durables, con `eventKey`, `providerEventId`, `payloadJson` y no-op seguro ante duplicados o eventos atrasados
- el siguiente paso natural es profundizar assignment, analytics o integraciones de proveedor adicionales, ya no la base operativa del webhook

Inspección autenticada:

```http
GET /api/growth/tenants/:slug/conversations/whatsapp-inbox/webhook-envelopes
GET /api/growth/tenants/:slug/conversations/whatsapp-inbox/webhook-envelopes/:envelopeId
POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/webhook-envelopes/:envelopeId/replay
```

Ejemplo de listado:

```sh
curl -s \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-inbox/webhook-envelopes
```

Ejemplo de replay:

```sh
curl -s \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://127.0.0.1:3000/api/growth/tenants/saas-platform-local/conversations/whatsapp-inbox/webhook-envelopes/WEBHOOK_ENVELOPE_ID/replay
```

Qué aporta este corte:
- inspección operativa del payload recibido y su metadata de provider
- `providerEventId` best-effort para lectura humana
- replay manual controlado sobre envelopes fallidos o sospechosos
- idempotencia doble:
  - por envelope (`eventKey`)
  - por mensaje/estado (`externalMessageId` y jerarquía de delivery status)
- persistencia durable de delivery events por mensaje para trazabilidad de estado
- un primer carril outbound real/stub con semántica de proveedor más honesta

## Smoke remoto Ecuador: remote submit

Ejemplo completo:

```sh
pnpm smoke:ec:remote-submit -- \
  --sub "OWNER_USER_ID" \
  --email "owner@saas-platform.dev" \
  --tenant-slug "saas-platform-local" \
  --bootstrap-remote-sandbox \
  --sync-issuer-tax-id \
  --check-authorization
```

Este smoke no crea el `issuerProfile` desde cero. Si el tenant todavía no tiene perfil fiscal o sigue bloqueado por readiness, el script corta temprano y deja el mensaje del bloqueo explícito.

### Preparar `EC_PKCS12` y `EC_PKCS12_PASSWORD` desde un certificado real

Cuando por fin consigas un `.p12` o `.pfx` funcional, ya no hace falta convertirlo a mano. Ahora existe:

```sh
pnpm prepare:ec:pkcs12-env -- \
  --file /ruta/certificado.p12 \
  --password "TU_PASSWORD" \
  --print-next-steps
```

Qué hace:
- abre el PKCS#12 con OpenSSL
- extrae huella, `subject`, `issuer` y vigencia
- intenta una prueba criptográfica simple con la llave privada
- genera el bloque `.env` listo para `EC_PKCS12` y `EC_PKCS12_PASSWORD`

Si quieres guardar la salida en un archivo auxiliar en vez de copiarla desde consola:

```sh
pnpm prepare:ec:pkcs12-env -- \
  --file /ruta/certificado.p12 \
  --password "TU_PASSWORD" \
  --out-file .env.pkcs12.local \
  --print-next-steps
```

La salida incluye por defecto:
- `EC_PKCS12`
- `EC_PKCS12_PASSWORD`
- `EC_PKCS12_SECRET_REF="env:EC_PKCS12"`
- `EC_PKCS12_PASSWORD_SECRET_REF="env:EC_PKCS12_PASSWORD"`

Importante:
- no subas ese bloque al repo
- úsalo solo en tu entorno local o en un secreto seguro
- si la herramienta no logra abrir el archivo o verificar la llave, todavía no es el certificado correcto para continuar con sandbox remoto

### Importante

El carril remoto interno solo debe usarse cuando `isReadyForRemoteSandboxSubmission = true`. Si ese semáforo todavía no está en verde, el camino correcto para sandbox real sigue siendo:
- readiness limpio
- compatibilidad offline local verificada
- XML firmado externamente
- `submit-presigned`

Cuando `isReadyForRemoteSandboxSubmission = true`, ya puedes intentar una prueba controlada con firma interna sobre `xades_pkcs12`.

Para `nota de crédito (04)`, la restricción práctica ya no es el tipo de documento en sí, sino la presencia del XSD local:
- si `notaCredito_V1.0.0.xsd` no existe en `vendor/sri`, el submit sigue bloqueado
- si el bundle ya está instalado, `04` puede recorrer el mismo carril técnico de submit que `01`

Para `nota de débito (05)`, aplica el mismo criterio:
- si `notaDebito_V1.0.0.xsd` no existe en `vendor/sri`, el submit sigue bloqueado
- si el bundle ya está instalado, `05` puede recorrer el mismo carril técnico de submit que `01`

Para `guía de remisión (06)`, aplica exactamente la misma regla:
- si `guiaRemision_V1.0.0.xsd` no existe en `vendor/sri`, el submit sigue bloqueado
- si el bundle ya está instalado, `06` puede pasar de preview a submit sobre la misma frontera multi-documento

Para `comprobante de retención (07)`, aplica exactamente la misma regla:
- si `comprobanteRetencion_V2.0.0.xsd` no existe en `vendor/sri`, el submit sigue bloqueado
- si el bundle ya está instalado, `07` puede pasar de preview a submit sobre la misma frontera multi-documento

### Cómo destrabar localmente el XSD de `04`

Si ya descargaste manualmente el ZIP oficial desde el SRI, puedes instalarlo al layout esperado del repo con:

```sh
pnpm install:sri:schema-bundle -- --document-code 04 --zip /ruta/XML-y-XSD-Nota-de-Credito.zip
```

El script copia al menos:
- `notaCredito_V1.0.0.xsd`
- `xmldsig-core-schema.xsd`

Y los deja en:
- [vendor/sri/nota-credito-1.0.0/README.md](/Users/jorgequizamanchuro/Projects_local/saas-platform/vendor/sri/nota-credito-1.0.0/README.md)

Cuando ese bundle exista en `vendor/sri`, el readiness ya podrá reflejar que `04` tiene soporte XSD local y submit habilitado.

### Cómo reinstalar localmente el XSD de `05`

Si ya descargaste manualmente el ZIP oficial desde el SRI, puedes instalarlo al layout esperado del repo con:

```sh
pnpm install:sri:schema-bundle -- --document-code 05 --zip /ruta/XML-y-XSD-Nota-de-Debito.zip
```

El script copia al menos:
- `notaDebito_V1.0.0.xsd`
- `xmldsig-core-schema.xsd`

Y los deja en:
- [vendor/sri/nota-debito-1.0.0/README.md](/Users/jorgequizamanchuro/Projects_local/saas-platform/vendor/sri/nota-debito-1.0.0/README.md)

Cuando el bundle ya esté instalado, puedes validarlo de forma aislada con:

```sh
pnpm validate:sri:xsd:debit-note
```

Y si además quieres comprobar el estado completo del repo para los documentos que hoy sí están cargados en `vendor/sri`, puedes usar:

```sh
pnpm validate:sri:xsd
```

### Cómo preparar localmente el XSD de `07`

Cuando ya tengas el ZIP correcto del SRI para comprobante de retención, instálalo con:

```sh
pnpm install:sri:schema-bundle -- --document-code 07 --zip /ruta/XML-y-XSD-Comprobante-de-Retencion.zip
```

El layout esperado queda documentado en:
- [vendor/sri/comprobante-retencion-2.0.0/README.md](/Users/jorgequizamanchuro/Projects_local/saas-platform/vendor/sri/comprobante-retencion-2.0.0/README.md)

Y luego puedes validar el bundle aislado con:

```sh
pnpm validate:sri:xsd:withholding
```

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
- `signatureHydrateMetadataJson`
- `signatureInspectionStatus`
- `signatureInspectionProbeMethod`
- `signatureInspectionExtractedFingerprint`
- `signatureInspectionExtractedSubjectName`
- `signatureInspectionDetail`
- `signatureInspectionReady`

### Gateway
- `submissionProvider`
- `submissionMode`
- `submissionReceptionUrlJson`
- `submissionAuthorizationUrlJson`
- `submissionCredentialsSecretRefJson`
- `submissionTimeoutMs`
- `sandboxReady`
- `sandboxLocalStubReady`
- `sandboxPresignedReady`
- `sandboxInternalSignerMaterialReady`
- `sandboxInternalSignerMaterialStatus`
- `sandboxInternalSignerMaterialDetail`
- `sandboxRecommendedNextStep`

### Factura y comprobante
- `customerId`
- `taxRateId`
- `invoiceId`
- `invoiceNumber`
- `creditNoteId`
- `creditNoteNumber`
- `creditNoteReason`
- `creditNoteIssuedAt`
- `creditNoteNotes`
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
