/* Mock data for slice 08 — Invoicing Document Review.
   Refines apps/web-platform/src/features/invoicing/workspace-documents.tsx
   (exported InvoicingDocumentPreviewPanel).

   Shaped 1:1 to the frozen contracts (apps/web-platform/src/app/types.ts +
   api.ts): InvoiceDocumentResponse, InvoiceRideResponse,
   InvoiceElectronicArtifactsResponse, and the fetch/download functions. No
   endpoints, fields or behaviors invented. This is the REVIEW desk before
   XML/RIDE/SRI lifecycle: it reads + opens + downloads artifacts only — it never
   generates, signs, submits, authorizes, regenerates, certifies or files.

   Truth rules encoded in the data:
   - "Autorizado" is shown ONLY when ride.canBePrintedAsAuthorized === true AND
     invoice.electronicStatus indicates authorization. Otherwise RIDE is
     referencial / pendiente.
   - artifacts.canDownloadRide / canDownloadXml gate the download actions.
   - electronicStatus is quiet context, never an action here.

   window.REVIEW_DATA carries shell context (reused from slices 00/02/05/06/07)
   plus one SCENARIO per state the handoff names. Each scenario is a full
   snapshot: selectedInvoiceDocument, selectedInvoiceRide, selectedInvoiceArtifacts
   (any may be null), actionLoading, permission. */
(function () {
  function money(cents) { return cents; } // stored cents; formatting in the view

  /* ---- issuer block (InvoiceDocumentResponse.issuer) ------------------- */
  function issuerFull() {
    return {
      tenantId: 'ten_acme', tenantName: 'Acme Logística', tenantSlug: 'acme-logistica',
      legalName: 'Acme Logística S.A.', commercialName: 'Acme Logística',
      taxId: '1790012345001', environment: 'production', emissionType: 'normal',
      accountingObligated: true, specialTaxpayerCode: '5368', rimpeTaxpayerType: null,
      matrixAddress: 'Av. Amazonas N34-120 y Av. Atahualpa, Quito',
      establishmentAddress: 'Av. Amazonas N34-120, local 3, Quito'
    };
  }
  function customerFull() {
    return {
      name: 'Comercial Andina S.A.', email: 'pagos@andina.ec', taxId: '1791234567001',
      identificationType: '04', identification: '1791234567001',
      billingAddress: 'Av. República del Salvador N35-04, Quito'
    };
  }

  /* ---- invoice block --------------------------------------------------- */
  function invoiceBlock(over) {
    return Object.assign({
      id: 'inv_5a1c', tenantId: 'ten_acme', customerId: 'cus_01',
      number: '001-001-000000148',
      documentCode: '01', establishmentCode: '001', emissionPointCode: '001', sequenceNumber: 148,
      buyerIdentificationType: '04', buyerIdentification: '1791234567001',
      buyerName: 'Comercial Andina S.A.', buyerAddress: 'Av. República del Salvador N35-04, Quito',
      electronicStatus: null, accessKey: null, authorizationNumber: null, authorizedAt: null,
      electronicStatusMessage: null, signedAt: null, submittedAt: null, submissionReference: null,
      status: 'draft', currency: 'USD',
      issuedAt: '2026-06-17T11:20:00-05:00', dueAt: '2026-07-15', notes: 'Servicios de logística junio 2026.',
      createdAt: '2026-06-17T11:20:00-05:00', updatedAt: '2026-06-17T11:40:00-05:00'
    }, over || {});
  }

  /* ---- lines (InvoiceDocumentResponse.lines) --------------------------- */
  function linesFull() {
    return [
      { id: 'it_01', position: 1, description: 'Servicio de logística — ruta Quito/Guayaquil', quantity: 1, unitPriceInCents: 120000, lineSubtotalInCents: 120000, taxRateId: 'tax_iva15', taxRateName: 'IVA', taxRatePercentage: 15, lineTaxInCents: 18000, lineTotalInCents: 138000 },
      { id: 'it_02', position: 2, description: 'Almacenaje (m³ · mes)', quantity: 12, unitPriceInCents: 4500, lineSubtotalInCents: 54000, taxRateId: 'tax_iva15', taxRateName: 'IVA', taxRatePercentage: 15, lineTaxInCents: 8100, lineTotalInCents: 62100 },
      { id: 'it_03', position: 3, description: 'Seguro de mercadería', quantity: 1, unitPriceInCents: 30000, lineSubtotalInCents: 30000, taxRateId: 'tax_iva0', taxRateName: 'Exento', taxRatePercentage: 0, lineTaxInCents: 0, lineTotalInCents: 30000 }
    ];
  }
  function totalsFrom(lines) {
    var sub = 0, tax = 0; lines.forEach(function (l) { sub += l.lineSubtotalInCents; tax += l.lineTaxInCents; });
    return { subtotalInCents: sub, taxInCents: tax, totalInCents: sub + tax };
  }

  function documentResponse(over) {
    over = over || {};
    var lines = over.lines || linesFull();
    return {
      issuer: over.issuer || issuerFull(),
      customer: over.customer || customerFull(),
      invoice: over.invoice || invoiceBlock({}),
      lines: lines,
      totals: over.totals || totalsFrom(lines)
    };
  }

  /* ---- RIDE response (InvoiceRideResponse) ----------------------------- */
  var ACCESS_KEY = '1706202601179001234500110010010001480123456789';
  function chunk(key) { return key.match(/.{1,7}/g) || []; }
  function rideResponse(over) {
    over = over || {};
    var doc = over.doc || documentResponse({});
    return {
      issuer: doc.issuer, customer: doc.customer, invoice: doc.invoice, lines: doc.lines, totals: doc.totals,
      ride: Object.assign({
        documentLabel: 'Factura', environmentLabel: 'Producción', emissionTypeLabel: 'Normal',
        sequenceDisplay: '001-001-000000148', electronicStatusLabel: 'Borrador',
        canBePrintedAsAuthorized: false,
        accessKey: null, accessKeyChunks: [],
        authorizationNumber: null, authorizedAt: null, authorizationMessage: null,
        additionalInfoFields: [
          { label: 'Forma de pago', value: 'Transferencia (20 días)' },
          { label: 'Guía de remisión', value: 'No aplica' }
        ]
      }, over.ride || {})
    };
  }

  /* ---- artifacts (InvoiceElectronicArtifactsResponse) ------------------ */
  function artifacts(over) {
    return Object.assign({
      fileBaseName: 'factura-001-001-000000148',
      rideHtmlFileName: 'factura-001-001-000000148-ride.html',
      xmlFileName: 'factura-001-001-000000148.xml',
      accessKey: null, electronicStatus: null,
      canDownloadRide: false, canDownloadXml: false
    }, over || {});
  }

  function base() {
    return {
      label: '', permission: { canManage: true, role: 'Owner' },
      loading: false, backendError: null,
      document: documentResponse({}), ride: rideResponse({}), artifacts: artifacts({}),
      actionLoading: null
    };
  }

  window.REVIEW_DATA = {
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
      title: 'No pudimos cargar la revisión del documento',
      message: 'No pudimos consultar el documento ni sus artefactos (GET /api/invoicing/tenants/acme-logistica/invoices/inv_5a1c/document).',
      correlationId: 'req_c92f01a4'
    },

    assistant: {
      greeting: 'Hola José — revisemos esta factura antes de cualquier paso electrónico.',
      disclaimer: 'El asistente prepara y explica. No emite, firma ni declara nada ante el SRI sin tu aprobación.',
      suggestions: [
        { icon: 'scan', tone: 'info', title: 'Revisa antes de generar artefactos', value: 'Confirma emisor, comprador, numeración, líneas y totales. Revisar el documento no lo envía al SRI.', action: 'Entendido' },
        { icon: 'fileText', tone: 'info', title: 'RIDE y XML son preliminares aquí', value: 'En esta pantalla el RIDE y el XML son para previsualizar y descargar. La autorización aparece solo cuando el SRI la confirma.', action: 'Entendido' }
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

      /* 1 — no document selected */
      S.no_document = (function () { var s = base(); s.label = 'Sin documento'; s.document = null; s.ride = null; s.artifacts = null; return s; })();

      /* 2 — loading */
      S.loading = (function () { var s = base(); s.label = 'Cargando'; s.loading = true; return s; })();

      /* 3 — draft / pre-submission ready (no electronic artifacts yet) */
      S.draft_ready = (function () {
        var s = base(); s.label = 'Borrador / pre-envío listo';
        s.ride = null; s.artifacts = null; // not generated yet — review only
        return s;
      })();

      /* 4 — missing issuer fiscal data */
      S.missing_issuer = (function () {
        var s = base(); s.label = 'Falta data fiscal del emisor';
        var iss = issuerFull(); iss.taxId = null; iss.matrixAddress = null; iss.environment = null;
        s.document = documentResponse({ issuer: iss }); s.ride = null; s.artifacts = null;
        return s;
      })();

      /* 5 — missing buyer fiscal data */
      S.missing_buyer = (function () {
        var s = base(); s.label = 'Falta data fiscal del comprador';
        var cus = customerFull(); cus.identificationType = null; cus.identification = null; cus.taxId = null; cus.billingAddress = null;
        var inv = invoiceBlock({ buyerIdentificationType: null, buyerIdentification: null, buyerAddress: null });
        s.document = documentResponse({ customer: cus, invoice: inv }); s.ride = null; s.artifacts = null;
        return s;
      })();

      /* 6 — invoice has no items */
      S.no_items = (function () {
        var s = base(); s.label = 'Factura sin items';
        s.document = documentResponse({ lines: [], totals: { subtotalInCents: 0, taxInCents: 0, totalInCents: 0 } });
        s.ride = null; s.artifacts = null;
        return s;
      })();

      /* 7 — totals available (full, healthy review; still pre-electronic) */
      S.totals_available = (function () {
        var s = base(); s.label = 'Totales disponibles';
        s.ride = null; s.artifacts = null;
        return s;
      })();

      /* 8 — RIDE unavailable (artifacts present but cannot download) */
      S.ride_unavailable = (function () {
        var s = base(); s.label = 'RIDE no disponible';
        s.ride = null;
        s.artifacts = artifacts({ canDownloadRide: false, canDownloadXml: false, electronicStatus: 'draft' });
        return s;
      })();

      /* 9 — RIDE available but not authorized (referencial) */
      S.ride_referential = (function () {
        var s = base(); s.label = 'RIDE disponible · no autorizado';
        var inv = invoiceBlock({ electronicStatus: 'signed', signedAt: '2026-06-17T11:50:00-05:00', submittedAt: null });
        var doc = documentResponse({ invoice: inv });
        s.document = doc;
        s.ride = rideResponse({ doc: doc, ride: {
          electronicStatusLabel: 'Firmado · referencial', canBePrintedAsAuthorized: false,
          accessKey: ACCESS_KEY, accessKeyChunks: chunk(ACCESS_KEY),
          authorizationNumber: null, authorizedAt: null,
          authorizationMessage: 'Documento firmado, aún sin autorización del SRI. El RIDE es referencial.'
        } });
        s.artifacts = artifacts({ accessKey: ACCESS_KEY, electronicStatus: 'signed', canDownloadRide: true, canDownloadXml: true });
        return s;
      })();

      /* 10 — RIDE authorized / printable as authorized */
      S.ride_authorized = (function () {
        var s = base(); s.label = 'RIDE autorizado';
        var inv = invoiceBlock({ status: 'issued', electronicStatus: 'authorized',
          accessKey: ACCESS_KEY, authorizationNumber: ACCESS_KEY,
          authorizedAt: '2026-06-17T12:05:00-05:00', signedAt: '2026-06-17T11:50:00-05:00', submittedAt: '2026-06-17T12:00:00-05:00',
          submissionReference: 'SRI-REF-77120' });
        var doc = documentResponse({ invoice: inv });
        s.document = doc;
        s.ride = rideResponse({ doc: doc, ride: {
          electronicStatusLabel: 'Autorizado', canBePrintedAsAuthorized: true,
          accessKey: ACCESS_KEY, accessKeyChunks: chunk(ACCESS_KEY),
          authorizationNumber: ACCESS_KEY, authorizedAt: '2026-06-17T12:05:00-05:00',
          authorizationMessage: 'Autorizado por el SRI el 17 jun 2026 12:05.'
        } });
        s.artifacts = artifacts({ accessKey: ACCESS_KEY, electronicStatus: 'authorized', canDownloadRide: true, canDownloadXml: true });
        return s;
      })();

      /* 11 — XML available for preview/download (focus on XML artifact) */
      S.xml_available = (function () {
        var s = base(); s.label = 'XML disponible';
        var inv = invoiceBlock({ electronicStatus: 'signed', signedAt: '2026-06-17T11:50:00-05:00', accessKey: ACCESS_KEY });
        var doc = documentResponse({ invoice: inv });
        s.document = doc;
        s.ride = rideResponse({ doc: doc, ride: { electronicStatusLabel: 'Firmado · referencial', canBePrintedAsAuthorized: false, accessKey: ACCESS_KEY, accessKeyChunks: chunk(ACCESS_KEY), authorizationMessage: 'XML preliminar disponible para previsualizar y descargar.' } });
        s.artifacts = artifacts({ accessKey: ACCESS_KEY, electronicStatus: 'signed', canDownloadRide: false, canDownloadXml: true });
        return s;
      })();

      /* 12 — artifacts unavailable (document fine, artifacts null) */
      S.artifacts_unavailable = (function () {
        var s = base(); s.label = 'Artefactos no disponibles';
        s.ride = null; s.artifacts = null;
        return s;
      })();

      /* 13 — permission-limited / read-only */
      S.permission_limited = (function () {
        var s = base(); s.label = 'Permiso limitado';
        s.permission = { canManage: false, role: 'Viewer', missingPermission: 'invoicing.read' };
        var inv = invoiceBlock({ electronicStatus: 'signed', accessKey: ACCESS_KEY, signedAt: '2026-06-17T11:50:00-05:00' });
        var doc = documentResponse({ invoice: inv });
        s.document = doc;
        s.ride = rideResponse({ doc: doc, ride: { electronicStatusLabel: 'Firmado · referencial', canBePrintedAsAuthorized: false, accessKey: ACCESS_KEY, accessKeyChunks: chunk(ACCESS_KEY) } });
        s.artifacts = artifacts({ accessKey: ACCESS_KEY, electronicStatus: 'signed', canDownloadRide: true, canDownloadXml: true });
        return s;
      })();

      /* 14 — backend unavailable */
      S.backend_unavailable = (function () { var s = base(); s.label = 'Backend no disponible'; s.backendError = true; return s; })();

      return S;
    })()
  };
})();
