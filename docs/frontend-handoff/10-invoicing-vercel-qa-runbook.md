# Invoicing Vercel QA Runbook

Fecha base: 2026-06-18

## Objetivo

Probar el flujo real de `Electronic Invoicing EC` en el entorno desplegado,
usando Vercel como frontend y Railway como backend, antes de seguir pidiendo o
aplicando mas slices visuales de Claude Design.

Este runbook responde:

> "Puede una persona entrar al workspace, crear una factura real de piloto,
> componerla, revisarla y entender con claridad por que el envio SRI se detiene?"

## Entorno

- Frontend Vercel: `https://saas-platform-api-platform.vercel.app/`
- Backend Railway: configurado via `VITE_API_BASE_URL` en build de Vercel.
- Tenant de piloto usado: `saas-platform-local`
- Producto: `invoicing`
- Ruta principal a probar: `#invoicing-documents`

Referencias:

- `docs/deployment/railway-vercel.md`
- `docs/frontend-handoff/06-invoicing-customer-draft-flow.md`
- `docs/frontend-handoff/07-invoicing-items-flow.md`
- `docs/frontend-handoff/08-invoicing-document-review.md`
- `docs/frontend-handoff/09-invoicing-sri-submission-lifecycle.md`
- `docs/frontend-handoff/11-invoicing-payment-email-delivery-closeout.md`
- `docs/frontend-handoff/12-invoicing-operational-polish-qa.md`

## Prerrequisitos

1. Railway debe tener:
   - `DATABASE_URL`
   - `AUTH_JWT_VERIFIER_MODE=local`
   - `AUTH_JWT_SECRET`
   - `CORS_ORIGIN=https://saas-platform-api-platform.vercel.app`
   - `WEB_PLATFORM_BASE_URL=https://saas-platform-api-platform.vercel.app`

2. Vercel debe tener:
   - `VITE_API_BASE_URL=https://<railway-api-domain>/api`

3. El tenant debe tener:
   - owner o usuario miembro con acceso operativo;
   - producto `invoicing` habilitado;
   - emisor configurado;
   - numeracion `001-001`;
   - firma/gateway en modo de piloto;
   - al menos una tasa activa de IVA para probar totales.

4. Tener un Bearer token de piloto vigente.

El token es como una llave temporal de oficina: no crea el workspace por si
solo, solo permite entrar si el usuario del token ya pertenece al tenant.

## Paso 1. Entrar al workspace

1. Abrir `https://saas-platform-api-platform.vercel.app/`.
2. Si aparece el gateway, abrir `Acceso avanzado`.
3. Pegar el Bearer token.
4. Confirmar que se muestra el `Product Command Center`.

### Resultado esperado

- No debe aparecer `Sin workspace`.
- No debe aparecer error de CORS.
- El shell debe mostrar:
  - tenant `saas-platform-local`;
  - producto `Facturacion` activo;
  - API apuntando al backend Railway.

## Paso 2. Abrir Invoicing

1. Desde el Command Center, entrar a `Facturacion`.
2. Confirmar que la URL use un hash de Invoicing:
   - `#invoicing-domain`, o
   - `#invoicing-documents`, o
   - `#invoicing-customer-draft`.
3. Navegar a `Documentos`.

### Resultado esperado

- Solo debe quedar visible el workspace de facturacion.
- El Command Center puede seguir montado en DOM, pero debe estar oculto.
- No debe quedar una pagina larga mezclando productos sin jerarquia.
- La consola del navegador no debe mostrar errores `Uncaught`.

### QA visual post polish

Despues de los PRs de polish operativo, la entrada a Invoicing debe leerse como
un workspace dedicado, no como una seccion mas del dashboard:

- un solo encabezado de producto;
- navegacion de subvistas con estado activo;
- tira de contexto visible cuando hay factura seleccionada;
- una accion primaria recomendada por estado;
- el selector de mood disponible desde el shell;
- Command Center oculto cuando el hash activo pertenece a Invoicing.

## Paso 3. Crear o seleccionar un borrador

1. Ir a `Clientes y borrador`.
2. Seleccionar un comprador existente o crear uno nuevo.
3. Crear una factura en estado `Borrador`.
4. Ir a `Documentos`.
5. Seleccionar la factura recien creada.

### Resultado esperado

- La factura aparece en la lista con numero `001-001-...`.
- Estado documental: `Borrador`.
- Estado electronico: `Sin estado electronico`.
- El resumen muestra subtotal, total, saldo y cliente.

## Paso 4. Agregar linea y validar totales

1. En el bloque `Lineas y totales`, completar:
   - descripcion: `Servicio profesional QA Vercel`;
   - cantidad: `1`;
   - precio unitario: `125.00`;
   - impuesto: una tasa IVA activa, por ejemplo `15%`.
2. Presionar `Agregar linea`.

### Resultado esperado

- La UI muestra confirmacion legible, no JSON crudo.
- La factura actualiza:
  - `1 linea`;
  - subtotal `$125,00`;
  - IVA `$18,75` si la tasa es 15%;
  - total `$143,75`;
  - saldo `$143,75`.
- Al recargar `#invoicing-documents`, la linea y los totales persisten.

## Paso 5. Revisar documento y artefactos

1. En la misma factura, revisar el panel de documento.
2. Confirmar la presencia de:
   - RIDE referencial;
   - XML preliminar;
   - datos de emisor;
   - datos de comprador;
   - numeracion;
   - lineas y totales.

### Resultado esperado

- El panel debe recordar que revisar no es enviar al SRI.
- RIDE/XML pueden abrirse o descargarse como artefactos preliminares.
- La UI no debe decir que el documento esta autorizado.

## Paso 6. Marcar como emitida

1. Presionar `Marcar como emitida`.

### Resultado esperado

- Estado documental cambia de `Borrador` a `Emitida`.
- La UI muestra mensaje accesible de exito.
- Las lineas quedan fijas para este documento.
- Aparece o queda disponible el carril electronico SRI.

## Paso 7. Intentar envio SRI

1. Presionar `Firmar y enviar al SRI`.

### Resultado esperado actual

El envio debe detenerse con un error legible de validacion XSD. El bloqueo
conocido al 2026-06-18 es:

```text
El XML del comprobante electronico no paso la validacion previa:
element SignatureValue: This element is not expected. Expected is SignedInfo.
```

Este resultado es aceptable para el estado actual del piloto porque confirma
que:

- el frontend llega hasta el backend real;
- el backend valida XML antes de tratarlo como enviado/autorizado;
- la UI no marca `Autorizado` antes de confirmacion real;
- el usuario ve un mensaje legible, no un payload JSON crudo.

## Paso 8. Validar jerarquia SRI, entrega y pago

1. Con la factura seleccionada, revisar las subvistas de `Documentos`, `SRI` y
   cierre/entrega.
2. Confirmar que la triada `SRI · Entrega · Pago` se mantenga como tres
   verdades independientes.
3. Si el estado electronico es `submitted`, verificar que se lea como
   `Enviado al SRI` o seguimiento, nunca como autorizado.
4. Si existe pago registrado, revisar que `Revertir pago` aparezca como accion
   secundaria/ghost, no como accion principal.
5. Abrir el historial tecnico SRI solo desde su disclosure secundario.

### Resultado esperado

- Verde/success queda reservado para `authorized` confirmado por backend.
- `submitted` usa tono de atencion/seguimiento.
- Entregar por email no cambia SRI ni pago.
- Registrar pago no implica conciliacion bancaria ni asiento contable.
- El trace tecnico no domina la pantalla operativa.

## Paso 9. QA de moods y responsive

Probar al menos estas rutas en desktop y mobile:

- `#invoicing-domain`
- `#invoicing-settings-sri`
- `#invoicing-customer-draft`
- `#invoicing-documents`

En cada ruta, alternar los cinco moods:

- `comfort`
- `focus`
- `calm`
- `high-contrast`
- `night`

### Checklist desktop

- Las tarjetas usan superficies, bordes y sombras acordes al mood.
- High contrast no depende de sombras para jerarquia.
- La navegacion de subvistas conserva foco/estado activo.
- Los status pills mantienen radio, padding y peso visual consistente.
- La accion primaria no compite con acciones secundarias o destructivas.

### Checklist mobile

- No hay overflow horizontal.
- La navegacion de producto no se corta.
- Las triadas y grids se apilan a una columna.
- Los textos largos de siguiente paso envuelven sin sacar botones de pantalla.
- Los status pills no aplastan contenido.
- La accion principal queda alcanzable y clara.

## Criterios de pase

La prueba pasa si:

- login/token resuelve workspace;
- Invoicing abre como workspace dedicado;
- se puede crear o seleccionar una factura;
- se puede agregar linea;
- totales persisten tras recarga;
- se puede marcar como emitida;
- el intento SRI muestra error legible;
- no hay errores `Uncaught` en consola;
- ninguna pantalla afirma autorizacion SRI sin backend confirmando `authorized`.
- desktop y mobile no presentan overflow horizontal;
- los cinco moods afectan shell, cards, controles y feedback;
- los traces tecnicos permanecen secundarios.

## Criterios de falla

La prueba falla si:

- aparece `Sin workspace` con un token valido;
- CORS bloquea llamadas desde Vercel;
- `#invoicing-documents` queda en blanco;
- una accion deja la pantalla sin feedback;
- la UI muestra JSON crudo en errores;
- se pierden lineas/totales tras recargar;
- la UI marca `Autorizado` solo por haber enviado o intentado enviar;
- el shell mezcla Command Center e Invoicing como contenido visible principal.
- `submitted` aparece en verde o como completado legal;
- una accion destructiva o excepcional compite como accion primaria;
- mobile requiere scroll horizontal para entender la triada o los tabs.

## Hallazgos del piloto 2026-06-18

- El flujo completo Vercel -> Railway funciona hasta la validacion SRI.
- El documento probado llego a:
  - `Emitida`;
  - `1 linea`;
  - total `$143,75`;
  - RIDE/XML preliminares visibles.
- El bloqueo real esta en la estructura de firma XML para XSD:
  `SignatureValue` aparece antes de `SignedInfo`.
- La correccion `fix(frontend): normalize api error messages` evita mostrar
  errores JSON crudos al usuario.
- El polish operativo de slice 11 quedo integrado hasta:
  - shell/workspace layout;
  - navegacion de subvistas y tira de contexto;
  - hardening mobile;
  - jerarquia de estados y acciones.

## Backlog derivado

1. Backend/SRI: corregir orden de nodos XML DSig para que XSD acepte la firma.
2. Frontend: seguir reduciendo contenido montado no visible para que el DOM y
   la UX mental coincidan mejor.
3. Frontend: automatizar este recorrido con un smoke remoto cuando exista un
   token/tenant de piloto generable sin pasos manuales.
4. Frontend: considerar rutas dedicadas reales cuando se deje atras la
   navegacion por hash.
5. Claude Design: continuar con los siguientes slices solo despues de preservar
   este flujo como referencia minima de no regresion.
