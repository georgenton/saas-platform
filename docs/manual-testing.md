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
