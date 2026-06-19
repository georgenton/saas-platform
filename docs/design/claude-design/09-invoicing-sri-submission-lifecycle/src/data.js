/* Mock data for slice 09 — Invoicing SRI Submission Lifecycle.
   Refines apps/web-platform/src/features/invoicing/workspace-electronic.tsx
   (exported InvoicingElectronicStatusPanel + InvoicingTechnicalTracePanel).

   Shaped 1:1 to the frozen contracts (apps/web-platform/src/app/types.ts +
   api.ts): InvoiceDetailResponse (incl. electronicEvents + sriDiagnostics),
   ElectronicSandboxReadinessResponse.documentSupport[number], and the local
   derived inputs the panel already receives (canSubmitElectronicDocument,
   documentSupportDetail, actionLoading, the invoice* form fields, the
   presignedInvoice* fields). No endpoints, fields or behaviors invented.

   electronicStatus ∈ 'pending_submission' | 'submitted' | 'authorized' |
   'rejected' (exact union from the component props).

   CRITICAL TRUTH RULE encoded everywhere:
   - "submitted" means the SRI received / is processing — NOT authorized.
   - The verdict / stepper / evidence show "Autorizado" ONLY when
     electronicStatus === 'authorized' (backend-confirmed). Never derived from
     submission alone.
   - The primary lane has ONE recommended action per state; manual
     reconciliation + presigned fallback + technical trace are advanced/secondary.

   window.LIFECYCLE_DATA carries shell context (reused from slices 00/02/05–08)
   plus one SCENARIO per state the handoff names. Each scenario is a full
   snapshot: selectedInvoiceDetail, selectedInvoiceDocumentSupport,
   canSubmitElectronicDocument, documentSupportDetail, the form-field mirrors,
   actionLoading, openManual/openFallback/openTrace flags and permission. */
(function () {
  var ACCESS_KEY = '1706202601179001234500110010010001480123456789';
  function chunk(key) { return key.match(/.{1,7}/g) || []; }

  /* ---- electronic events (InvoiceDetailResponse.electronicEvents) ------ */
  function submissionEvent(over) {
    return Object.assign({
      id: 'evt_sub_1', tenantId: 'ten_acme', invoiceId: 'inv_5a1c',
      eventType: 'submission', provider: 'sri_offline_ws', providerStatus: 'RECEIVED',
      endpoint: 'https://cel.sri.gob.ec/.../RecepcionComprobantesOffline?wsdl',
      soapAction: 'validarComprobante', message: 'El SRI recibió el comprobante para procesamiento.',
      requestPayload: '<soap:Envelope>…</soap:Envelope>', responsePayload: '<respuestaRecepcion><estado>RECIBIDA</estado></respuestaRecepcion>',
      submissionReference: 'SRI-REF-77120', authorizationNumber: null,
      occurredAt: '2026-06-17T12:00:00-05:00', sriDiagnostics: null
    }, over || {});
  }
  function authEvent(over) {
    return Object.assign({
      id: 'evt_auth_1', tenantId: 'ten_acme', invoiceId: 'inv_5a1c',
      eventType: 'authorization', provider: 'sri_offline_ws', providerStatus: 'AUTORIZADO',
      endpoint: 'https://cel.sri.gob.ec/.../AutorizacionComprobantesOffline?wsdl',
      soapAction: 'autorizacionComprobante', message: 'Comprobante autorizado por el SRI.',
      requestPayload: '<soap:Envelope>…</soap:Envelope>', responsePayload: '<autorizacion><estado>AUTORIZADO</estado></autorizacion>',
      submissionReference: 'SRI-REF-77120', authorizationNumber: ACCESS_KEY,
      occurredAt: '2026-06-17T12:05:00-05:00',
      sriDiagnostics: { state: 'AUTORIZADO', authorizationNumber: ACCESS_KEY, authorizationDate: '2026-06-17T12:05:00-05:00', accessKey: ACCESS_KEY, summary: 'Autorizado sin observaciones.', messages: [] }
    }, over || {});
  }
  function rejectionEvent(over) {
    return Object.assign({
      id: 'evt_rej_1', tenantId: 'ten_acme', invoiceId: 'inv_5a1c',
      eventType: 'authorization', provider: 'sri_offline_ws', providerStatus: 'DEVUELTA',
      endpoint: 'https://cel.sri.gob.ec/.../AutorizacionComprobantesOffline?wsdl',
      soapAction: 'autorizacionComprobante', message: 'El SRI devolvió el comprobante con observaciones.',
      requestPayload: '<soap:Envelope>…</soap:Envelope>', responsePayload: '<autorizacion><estado>NO AUTORIZADO</estado></autorizacion>',
      submissionReference: 'SRI-REF-77118', authorizationNumber: null,
      occurredAt: '2026-06-17T12:03:00-05:00',
      sriDiagnostics: { state: 'DEVUELTA', authorizationNumber: null, authorizationDate: null, accessKey: ACCESS_KEY, summary: 'Identificación del comprador no válida para el tipo de documento.',
        messages: [{ identifier: '45', message: 'IDENTIFICACIÓN DEL COMPRADOR NO CUMPLE CON EL TIPO DE COMPROBANTE', additionalInfo: ['Verifica que el RUC/cédula del comprador sea válido para factura.'] }] }
    }, over || {});
  }

  /* ---- invoice detail (the relevant electronic subset) ----------------- */
  function invoice(over) {
    return Object.assign({
      id: 'inv_5a1c', tenantId: 'ten_acme', customerId: 'cus_01',
      number: '001-001-000000148',
      documentCode: '01', establishmentCode: '001', emissionPointCode: '001', sequenceNumber: 148,
      buyerIdentificationType: '04', buyerIdentification: '1791234567001',
      buyerName: 'Comercial Andina S.A.', buyerAddress: 'Av. República del Salvador N35-04, Quito',
      electronicStatus: 'pending_submission', accessKey: null, authorizationNumber: null, authorizedAt: null,
      electronicStatusMessage: null, signedAt: null, submittedAt: null, submissionReference: null,
      status: 'issued', currency: 'USD',
      issuedAt: '2026-06-17T11:20:00-05:00', dueAt: '2026-07-15', notes: 'Servicios de logística junio 2026.',
      createdAt: '2026-06-17T11:20:00-05:00', updatedAt: '2026-06-17T11:40:00-05:00',
      items: [
        { id: 'it_01', position: 1, description: 'Servicio de logística — ruta Quito/Guayaquil', quantity: 1, unitPriceInCents: 120000, lineTotalInCents: 138000, taxRateName: 'IVA', taxRatePercentage: 15, lineTaxInCents: 18000 }
      ],
      payments: [], electronicEvents: [],
      totals: { subtotalInCents: 204000, taxInCents: 26100, totalInCents: 230100 },
      settlement: { paidInCents: 0, balanceDueInCents: 230100, isFullyPaid: false }
    }, over || {});
  }

  /* document support (factura supported) */
  function support(over) {
    return Object.assign({ documentCode: '01', label: 'Factura', numberingConfigured: true, previewAvailable: true, rideAvailable: true, schemaValidationAvailable: true, submitSupported: true, detail: 'Factura lista para emisión electrónica.' }, over || {});
  }

  /* mirror of the panel's editable form fields (controlled inputs) */
  function formFromInvoice(inv) {
    return {
      accessKey: inv.accessKey || '',
      authorizationNumber: inv.authorizationNumber || '',
      authorizedAt: inv.authorizedAt ? inv.authorizedAt.slice(0, 16) : '',
      electronicStatus: inv.electronicStatus || 'pending_submission',
      electronicStatusMessage: inv.electronicStatusMessage || '',
      presignedSignerName: '', presignedXml: ''
    };
  }

  function base() {
    var inv = invoice({});
    return {
      label: '', permission: { canManage: true, role: 'Owner' },
      loading: false, backendError: null,
      invoice: inv,
      documentSupport: support({}),
      canSubmit: true,
      documentSupportDetail: null,
      xmlPreviewLoaded: false,
      openManual: false, openFallback: false, openTrace: false,
      actionLoading: null,
      form: formFromInvoice(inv)
    };
  }

  window.LIFECYCLE_DATA = {
    accessKeyDemo: ACCESS_KEY, chunk: chunk,
    user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },
    tenant: { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' },
    memberships: [
      { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
      { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
    ],
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

    backendErrorInfo: {
      title: 'No pudimos cargar el estado electrónico',
      message: 'No pudimos consultar el ciclo SRI de esta factura (GET /api/invoicing/tenants/acme-logistica/invoices/inv_5a1c).',
      correlationId: 'req_d77a0c51'
    },

    assistant: {
      greeting: 'Hola José — te acompaño en el ciclo SRI de esta factura.',
      disclaimer: 'El asistente explica cada estado legal. No firma, envía ni autoriza nada ante el SRI sin tu acción.',
      suggestions: [
        { icon: 'send', tone: 'info', title: 'Un paso seguro a la vez', value: 'Te muestro la única acción recomendada según el estado actual: ver XML, firmar y enviar, o consultar autorización.', action: 'Entendido' },
        { icon: 'shieldCheck', tone: 'info', title: '"Enviado" no es "autorizado"', value: 'Que el SRI reciba el comprobante no significa que esté autorizado. Solo marcamos autorizado cuando el SRI lo confirma.', action: 'Entendido' }
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
       SCENARIOS
       ------------------------------------------------------------------- */
    scenarios: (function () {
      var S = {};

      /* 1 — no selected invoice */
      S.no_invoice = (function () { var s = base(); s.label = 'Sin factura seleccionada'; s.invoice = null; s.documentSupport = null; return s; })();

      /* 2 — loading */
      S.loading = (function () { var s = base(); s.label = 'Cargando'; s.loading = true; return s; })();

      /* 3 — invoice still in draft (must be issued before SRI lane) */
      S.invoice_draft = (function () {
        var s = base(); s.label = 'Factura en borrador';
        s.invoice = invoice({ status: 'draft', electronicStatus: 'pending_submission' });
        s.canSubmit = false;
        s.documentSupportDetail = 'La factura sigue en borrador. Emítela antes de operar el ciclo electrónico.';
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 4 — readiness blocked (canSubmit false: firma/gateway pendientes) */
      S.readiness_blocked = (function () {
        var s = base(); s.label = 'Preparación bloqueada';
        s.canSubmit = false;
        s.documentSupportDetail = 'El carril electrónico tiene un bloqueo de preparación (firma o gateway del SRI). Resuélvelo en Configuración SRI antes de enviar.';
        return s;
      })();

      /* 5 — unsupported document type */
      S.unsupported_type = (function () {
        var s = base(); s.label = 'Tipo de documento no soportado';
        s.documentSupport = support({ documentCode: '06', label: 'Guía de remisión', submitSupported: false, detail: 'La guía de remisión aún no sigue la ruta automática del SRI en esta versión.' });
        s.invoice = invoice({ documentCode: '06' });
        s.documentSupportDetail = 'La guía de remisión (06) aún no tiene envío automático. Usa el fallback técnico solo si validas sandbox con firma externa.';
        s.openFallback = true;
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 6 — ready to submit */
      S.ready_to_submit = (function () {
        var s = base(); s.label = 'Listo para enviar';
        return s;
      })();

      /* 7 — submitting (action loading) */
      S.submitting = (function () {
        var s = base(); s.label = 'Enviando al SRI';
        s.actionLoading = 'submit-invoice-electronic-document';
        return s;
      })();

      /* 8 — submitted / pending authorization */
      S.submitted_pending = (function () {
        var s = base(); s.label = 'Enviado · pendiente de autorización';
        s.invoice = invoice({ electronicStatus: 'submitted', accessKey: ACCESS_KEY, submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77120', signedAt: '2026-06-17T11:59:00-05:00', electronicEvents: [submissionEvent({})] });
        s.openManual = true; // panel auto-opens manual on submitted
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 9 — checking authorization (action loading) */
      S.checking_authorization = (function () {
        var s = base(); s.label = 'Consultando autorización';
        s.invoice = invoice({ electronicStatus: 'submitted', accessKey: ACCESS_KEY, submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77120', electronicEvents: [submissionEvent({})] });
        s.actionLoading = 'check-invoice-electronic-authorization';
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 10 — authorized */
      S.authorized = (function () {
        var s = base(); s.label = 'Autorizado por el SRI';
        s.invoice = invoice({ status: 'issued', electronicStatus: 'authorized', accessKey: ACCESS_KEY, authorizationNumber: ACCESS_KEY, authorizedAt: '2026-06-17T12:05:00-05:00', submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77120', signedAt: '2026-06-17T11:59:00-05:00', electronicEvents: [submissionEvent({}), authEvent({})] });
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 11 — rejected / returned with SRI message */
      S.rejected = (function () {
        var s = base(); s.label = 'Devuelto por el SRI';
        s.invoice = invoice({ electronicStatus: 'rejected', accessKey: ACCESS_KEY, submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77118',
          electronicStatusMessage: 'IDENTIFICACIÓN DEL COMPRADOR NO CUMPLE CON EL TIPO DE COMPROBANTE (cód. 45). Verifica que el RUC/cédula del comprador sea válido para factura.',
          electronicEvents: [submissionEvent({}), rejectionEvent({})] });
        s.openManual = true;
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 12 — XML preview available (loaded, ready_to_submit context) */
      S.xml_preview = (function () {
        var s = base(); s.label = 'XML preliminar disponible';
        s.xmlPreviewLoaded = true;
        return s;
      })();

      /* 13 — manual reconciliation open */
      S.manual_open = (function () {
        var s = base(); s.label = 'Conciliación manual abierta';
        s.invoice = invoice({ electronicStatus: 'submitted', accessKey: ACCESS_KEY, submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77120', electronicEvents: [submissionEvent({})] });
        s.openManual = true;
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 14 — presigned XML fallback open */
      S.fallback_open = (function () {
        var s = base(); s.label = 'Fallback XML prefirmado abierto';
        s.openFallback = true;
        s.form = Object.assign(formFromInvoice(s.invoice), { presignedSignerName: 'sandbox-signer', presignedXml: '<factura id="comprobante" version="1.1.0">…<ds:Signature>…</ds:Signature></factura>' });
        return s;
      })();

      /* 15 — technical trace expanded */
      S.trace_expanded = (function () {
        var s = base(); s.label = 'Historial técnico expandido';
        s.invoice = invoice({ electronicStatus: 'authorized', accessKey: ACCESS_KEY, authorizationNumber: ACCESS_KEY, authorizedAt: '2026-06-17T12:05:00-05:00', submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77120', electronicEvents: [submissionEvent({}), authEvent({})] });
        s.openTrace = true;
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 16 — permission-limited / read-only */
      S.permission_limited = (function () {
        var s = base(); s.label = 'Permiso limitado';
        s.permission = { canManage: false, role: 'Viewer', missingPermission: 'invoicing.manage' };
        s.invoice = invoice({ electronicStatus: 'submitted', accessKey: ACCESS_KEY, submittedAt: '2026-06-17T12:00:00-05:00', submissionReference: 'SRI-REF-77120', electronicEvents: [submissionEvent({})] });
        s.form = formFromInvoice(s.invoice);
        return s;
      })();

      /* 17 — backend unavailable */
      S.backend_unavailable = (function () { var s = base(); s.label = 'Backend no disponible'; s.backendError = true; return s; })();

      return S;
    })()
  };
})();
