/* Mock data for slice 03 — Invoicing SRI progressive disclosure.
   This slice refines the Ecuador SRI control area inside an invoice's detail
   (the surface implemented in
   apps/web-platform/src/features/invoicing/workspace-electronic.tsx).

   window.SRI_DATA carries:
   - shell context (user / tenant / products / moods) reused from slice 02 so
     the SRI panel always renders inside real Platform Shell chrome;
   - one SCENARIO per designed state. Each scenario is the composition the panel
     reads: the invoice, derived readiness, document-support, fallback presence
     and the technical event trace. `ready` is DERIVED — never assumed.

   Money is in cents. Each block notes the endpoint it mirrors; see
   docs/frontend-handoff/03-invoicing-sri-progressive-disclosure.md. */
(function () {
  /* --- four readiness pillars, healthy baseline ------------------------- */
  const ISSUER = {
    legalName: 'Acme Logística S.A.', ruc: '1790012345001', environment: 'production',
    establishment: '001', emissionPoint: '001', nextNumber: '001-001-000148'
  };
  function pillarsHealthy() {
    return [
      { key: 'issuer', label: 'Emisor', icon: 'building', value: 'Acme Logística S.A.', sub: 'Producción · RUC 1790012345001', tone: 'success' },
      { key: 'signature', label: 'Firma electrónica', icon: 'key', value: 'Vigente', sub: 'Hasta 08 nov 2026 · Security Data', tone: 'success' },
      { key: 'gateway', label: 'Gateway SRI', icon: 'server', value: 'Conectado', sub: 'Producción · verificado hace 8 min', tone: 'success' },
      { key: 'numbering', label: 'Numeración', icon: 'hash', value: '001-001-000148', sub: 'Estab. 001 · Pto. 001', tone: 'success' }
    ];
  }
  function pillarsSignatureExpired() {
    const p = pillarsHealthy();
    p[1] = { key: 'signature', label: 'Firma electrónica', icon: 'key', value: 'Caducada', sub: 'Venció el 30 may 2026', tone: 'danger' };
    return p;
  }

  /* --- 49-digit access keys (clave de acceso) --------------------------- */
  const K = {
    ready:      '1606202601179001234500120010010000001461234567819',
    submitted:  '1606202601179001234500120010010000001452938475610',
    authorized: '1506202601179001234500120010010000001438472610934',
    rejected:   '1506202601179001234500120010010000001445583729107',
    unsupported:'1606202601179001234500120010060000002013948572611'
  };

  /* --- technical event traces (electronic-document events) -------------- */
  const submissionEvent = {
    id: 'evt_sub_01', type: 'submission', provider: 'SRI · Recepción', providerStatus: 'RECIBIDA',
    occurredAt: '16 jun 2026 · 09:41:22', message: 'Comprobante recibido por el SRI. En proceso de validación.',
    soapAction: 'validarComprobante', endpoint: 'recepcion.sri.gob.ec/...?wsdl', submissionReference: 'REC-7f3a91',
    sriDiagnostics: { summary: 'Recepción aceptada sin observaciones.', messages: [] }
  };
  const authCheckPending = {
    id: 'evt_auth_01', type: 'authorization-check', provider: 'SRI · Autorización', providerStatus: 'EN PROCESAMIENTO',
    occurredAt: '16 jun 2026 · 09:48:10', message: 'El SRI aún no devuelve autorización. Reintentar más tarde.',
    soapAction: 'autorizacionComprobante', endpoint: 'autorizacion.sri.gob.ec/...?wsdl', submissionReference: 'REC-7f3a91',
    sriDiagnostics: { summary: 'Sin número de autorización todavía.', messages: [] }
  };
  const authCheckAuthorized = {
    id: 'evt_auth_ok', type: 'authorization-check', provider: 'SRI · Autorización', providerStatus: 'AUTORIZADO',
    occurredAt: '15 jun 2026 · 14:32:07', message: 'Comprobante autorizado por el SRI.',
    soapAction: 'autorizacionComprobante', endpoint: 'autorizacion.sri.gob.ec/...?wsdl', submissionReference: 'REC-2a18c0',
    authorizationNumber: '1506202601179001234500120010010000001438472610934',
    sriDiagnostics: { summary: 'Autorizado en ambiente de producción.', messages: [] }
  };
  const rejectionEvent = {
    id: 'evt_rej_01', type: 'authorization-check', provider: 'SRI · Autorización', providerStatus: 'NO AUTORIZADO',
    occurredAt: '15 jun 2026 · 16:05:44', message: 'Comprobante devuelto con observaciones.',
    soapAction: 'autorizacionComprobante', endpoint: 'autorizacion.sri.gob.ec/...?wsdl', submissionReference: 'REC-91b4de',
    sriDiagnostics: {
      summary: 'Una observación bloqueante (cód. 43).',
      messages: [{ identifier: '43', message: 'IDENTIFICACION DEL COMPRADOR', additionalInfo: ['El RUC del comprador no es válido para el régimen seleccionado.'] }]
    }
  };

  /* --- base invoice header (varies per scenario) ------------------------ */
  function inv(over) {
    return Object.assign({
      number: '001-001-000146', customer: 'Talleres Pichincha Cía. Ltda.', customerRuc: '1722334455001',
      issuedAt: '16 jun 2026', items: 3, currency: 'USD',
      subtotalInCents: 140000, ivaInCents: 16800, totalInCents: 156800,
      documentStatus: 'issued', electronicStatus: 'pending_submission',
      accessKey: null, accessKeyReady: false, authorizationNumber: null, authorizedAt: null, rejection: null
    }, over);
  }

  window.SRI_DATA = {
    /* GET /api/auth/me + /api/tenancy/tenants/{slug} */
    user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },
    tenant: { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' },
    memberships: [
      { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
      { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
    ],
    issuer: ISSUER,

    /* GET /api/tenancy/tenants/{slug}/products — sidebar nav */
    products: [
      { key: 'dashboard', name: 'Dashboard', group: 'Core', icon: 'dashboard', state: 'enabled' },
      { key: 'invoicing', name: 'Invoicing', group: 'Finance', icon: 'invoicing', state: 'enabled', badge: 3 },
      { key: 'tax-compliance-ec', name: 'Tax Compliance EC', group: 'Finance', icon: 'tax', state: 'limited', note: 'View only — needs tax.manage' },
      { key: 'accounting', name: 'Accounting', group: 'Finance', icon: 'accounting', state: 'locked', note: 'Available on Scale' },
      { key: 'ecommerce', name: 'Ecommerce', group: 'Commerce', icon: 'ecommerce', state: 'enabled' },
      { key: 'growth', name: 'Growth', group: 'Commerce', icon: 'growth', state: 'enabled', badge: 3 },
      { key: 'ai-console', name: 'AI Console', group: 'Platform', icon: 'ai', state: 'limited', note: 'Approvals restricted' },
      { key: 'parties', name: 'Parties', group: 'Platform', icon: 'parties', state: 'enabled' },
      { key: 'medical', name: 'Medical Clinics', group: 'Clinics', icon: 'medical', state: 'available', note: '$39 / mo add-on' },
      { key: 'psychology', name: 'Psychology Clinics', group: 'Clinics', icon: 'psychology', state: 'disabled', note: 'Not enabled' },
      { key: 'settings', name: 'Settings', group: 'Platform', icon: 'settings', state: 'enabled' }
    ],

    backendError: { title: 'No pudimos cargar el estado del SRI', message: 'No pudimos consultar la autorización electrónica (GET /api/invoicing/tenants/acme-logistica/electronic-document/readiness).', correlationId: 'req_8c41ad20' },

    /* AI assistant — suggestion-first, never autonomous */
    assistant: {
      greeting: 'Hola José — revisé el carril electrónico de esta factura.',
      disclaimer: 'El asistente prepara y explica. No genera, envía ni autoriza ningún documento ante el SRI sin tu aprobación.',
      suggestions: [
        { icon: 'send', tone: 'info', title: 'Lista para enviar al SRI', body: 'La firma, el gateway y la numeración están en orden. Puedo dejar el comprobante listo para que tú confirmes el envío.', action: 'Preparar envío' },
        { icon: 'history', tone: 'neutral', title: 'Resumen del historial técnico', body: 'Hay 2 eventos SRI en esta factura. Preparo un resumen legible para soporte si lo necesitas.', action: 'Resumir historial' }
      ]
    },

    moods: [
      { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
      { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
      { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
      { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
      { key: 'night', label: 'Night', desc: 'Low-glare dark' }
    ],

    /* -------------------------------------------------------------------
       SCENARIOS — one per state the brief asks us to design explicitly.
       readiness.ready and blockers are computed from the pillar signals.
       ------------------------------------------------------------------- */
    scenarios: {
      // healthy / ready — base usable, nothing urgent, compact by default
      ready: {
        label: 'Healthy / ready',
        invoice: inv({ electronicStatus: 'pending_submission', accessKey: null, accessKeyReady: false }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        events: []
      },

      // blocked by readiness — signature expired, submit disabled
      blocked: {
        label: 'Bloqueado por readiness',
        invoice: inv({ electronicStatus: 'pending_submission', accessKey: null, accessKeyReady: false }),
        readiness: {
          ready: false,
          blocker: {
            pillar: 'Firma electrónica',
            title: 'Tu firma electrónica caducó',
            body: 'El certificado venció el 30 may 2026. No podemos firmar ni enviar este comprobante al SRI hasta que lo renueves.',
            fix: 'Renovar firma'
          },
          pillars: pillarsSignatureExpired()
        },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        events: []
      },

      // pending submission — access key prepared, ready to sign + send
      pending: {
        label: 'Pendiente de envío',
        invoice: inv({ number: '001-001-000146', electronicStatus: 'pending_submission', accessKey: K.ready, accessKeyReady: true }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        events: []
      },

      // submitted / waiting SRI — never light "Autorizado"
      submitted: {
        label: 'Enviado · esperando SRI',
        invoice: inv({ number: '001-001-000145', customer: 'Importadora Costa Verde', customerRuc: '0990012345001', items: 6, subtotalInCents: 450000, ivaInCents: 54000, totalInCents: 504000, electronicStatus: 'submitted', accessKey: K.submitted, accessKeyReady: true }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        lastCheckedLabel: 'hace 8 min',
        events: [submissionEvent, authCheckPending]
      },

      // authorized — show clave + nº autorización + handoff, copy affordances
      authorized: {
        label: 'Autorizada',
        invoice: inv({ number: '001-001-000143', customer: 'Hotel Quitumbe S.A.', customerRuc: '1790567890001', items: 8, subtotalInCents: 840000, ivaInCents: 100800, totalInCents: 940800, documentStatus: 'issued', electronicStatus: 'authorized', accessKey: K.authorized, accessKeyReady: true, authorizationNumber: K.authorized, authorizedAt: '15 jun 2026 · 14:32' }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        events: [submissionEvent, authCheckAuthorized]
      },

      // rejected — SRI returned observations; intervention auto-opens
      rejected: {
        label: 'Rechazada',
        invoice: inv({ number: '001-001-000144', customer: 'Ferretería Los Andes', customerRuc: '1712233445001', items: 1, subtotalInCents: 70000, ivaInCents: 8400, totalInCents: 78400, electronicStatus: 'rejected', accessKey: K.rejected, accessKeyReady: true, rejection: { code: '43', field: 'identificacionComprador', message: 'El RUC del comprador no es válido para el régimen.', fix: 'Verifica el RUC 1712233445001 con la Parte y vuelve a generar el documento.' } }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        events: [{ ...submissionEvent, occurredAt: '15 jun 2026 · 15:58:10' }, rejectionEvent]
      },

      // unsupported document path — submitSupported false
      unsupported: {
        label: 'Tipo de documento no soportado',
        invoice: inv({ number: '001-001-000201', customer: 'Constructora del Litoral', customerRuc: '0991238888001', items: 5, subtotalInCents: 320000, ivaInCents: 38400, totalInCents: 358400, electronicStatus: 'pending_submission', accessKey: null, accessKeyReady: false }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: false, label: 'Liquidación de compra (03)', detail: 'El envío automático para liquidaciones de compra aún no está habilitado en este producto. Puedes generar el RIDE y usar el puente de XML prefirmado si necesitas probar el SRI con este tipo de comprobante.' },
        fallbackXmlReady: false,
        events: []
      },

      // fallback XML bridge available — presigned XML staged (still secondary)
      fallback: {
        label: 'Puente XML disponible',
        invoice: inv({ number: '001-001-000146', electronicStatus: 'pending_submission', accessKey: K.ready, accessKeyReady: true }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: true,
        presigned: { signerName: 'sandbox-signer-ext', xmlPreview: '<factura id="comprobante" version="1.1.0"><ds:Signature Id="Signature123">…</ds:Signature></factura>' },
        events: []
      },

      // technical trace with events — rich diagnostics, panel emphasis on trace
      trace: {
        label: 'Historial técnico con eventos',
        invoice: inv({ number: '001-001-000143', customer: 'Hotel Quitumbe S.A.', customerRuc: '1790567890001', items: 8, subtotalInCents: 840000, ivaInCents: 100800, totalInCents: 940800, electronicStatus: 'authorized', accessKey: K.authorized, accessKeyReady: true, authorizationNumber: K.authorized, authorizedAt: '15 jun 2026 · 14:32' }),
        readiness: { ready: true, blocker: null, pillars: pillarsHealthy() },
        support: { submitSupported: true, label: 'Factura (01)', detail: null },
        fallbackXmlReady: false,
        events: [
          { ...submissionEvent, occurredAt: '15 jun 2026 · 14:28:51', submissionReference: 'REC-2a18c0',
            requestPayload: '<soap:Envelope><soap:Body><ec:validarComprobante><xml>…(base64)…</xml></ec:validarComprobante></soap:Body></soap:Envelope>',
            responsePayload: '<RespuestaRecepcionComprobante><estado>RECIBIDA</estado></RespuestaRecepcionComprobante>' },
          { ...authCheckAuthorized,
            requestPayload: '<soap:Envelope><soap:Body><ec:autorizacionComprobante><claveAccesoComprobante>1506…0934</claveAccesoComprobante></ec:autorizacionComprobante></soap:Body></soap:Envelope>',
            responsePayload: '<RespuestaAutorizacionComprobante><autorizaciones><autorizacion><estado>AUTORIZADO</estado><numeroAutorizacion>1506…0934</numeroAutorizacion></autorizacion></autorizaciones></RespuestaAutorizacionComprobante>' }
        ]
      }
    }
  };
})();
