/* Mock data for slice 06 — Invoicing Customer + Draft Invoice Flow.
   Refines apps/web-platform/src/features/invoicing/workspace-customer-draft-flow.tsx.

   Shaped 1:1 to the frozen contracts (apps/web-platform/src/app/types.ts +
   api.ts): CustomerResponse, createCustomer() body, createInvoice() form,
   InvoiceNumberingSettingsResponse.previewNumber, InvoiceSummaryResponse.
   No endpoints, fields or behaviors are invented. This flow creates the
   commercial/fiscal starting point only — NOT SRI submission/authorization.

   window.FLOW_DATA carries shell context (reused from slices 00/02/03/05) plus
   one SCENARIO per state the handoff asks us to design explicitly. Each scenario
   is a full snapshot: customers[], the selected buyer, the customer form draft,
   the invoice draft form, actionLoading, errors, permission and which step the
   guided lane should rest on. */
(function () {
  /* ---- buyer identification types exposed by the UI (es-EC friendly) ---- */
  var ID_TYPES = [
    { code: '04', short: 'RUC', label: 'RUC', hint: 'Empresa o negocio con RUC', placeholder: '1790012345001', len: 13 },
    { code: '05', short: 'Cédula', label: 'Cédula', hint: 'Persona natural ecuatoriana', placeholder: '0102030405', len: 10 },
    { code: '06', short: 'Pasaporte', label: 'Pasaporte', hint: 'Extranjero con pasaporte', placeholder: 'AB1234567', len: null },
    { code: '07', short: 'Consumidor final', label: 'Consumidor final', hint: 'Venta sin identificar al comprador', placeholder: '9999999999999', len: 13 },
    { code: '08', short: 'Exterior', label: 'Exterior', hint: 'Cliente fuera de Ecuador', placeholder: 'EXT-000123', len: null }
  ];

  /* ---- CustomerResponse fixtures --------------------------------------- */
  function customer(id, name, email, idType, identification, addr, createdAt) {
    return { id: id, tenantId: 'ten_acme', name: name, email: email, taxId: idType === '04' ? identification : null, identificationType: idType, identification: identification, billingAddress: addr, createdAt: createdAt, updatedAt: createdAt };
  }
  var DIRECTORY = [
    customer('cus_01', 'Comercial Andina S.A.', 'pagos@andina.ec', '04', '1791234567001', 'Av. República del Salvador N35-04, Quito', '2026-02-11T10:02:00-05:00'),
    customer('cus_02', 'María Fernanda Salazar', 'mf.salazar@gmail.com', '05', '1709988776', 'Cdla. Las Garzas, Mz 4 Villa 12, Guayaquil', '2026-03-04T14:20:00-05:00'),
    customer('cus_03', 'Northwind Trading LLC', 'ap@northwind.com', '08', 'EXT-558120', '1209 Brickell Ave, Miami, FL', '2026-04-22T09:45:00-05:00'),
    customer('cus_04', 'Carlos Eduardo Pérez', 'ceperez@outlook.com', '06', 'X8842156', 'Hostal Sucre, Cuenca', '2026-05-09T16:30:00-05:00')
  ];

  /* ---- the customer creation form (createCustomer body shape) ---------- */
  function blankCustomerForm() {
    return { name: '', email: '', identificationType: '04', taxId: '', billingAddress: '' };
  }
  /* ---- the invoice draft form (createInvoice body shape) --------------- */
  function blankInvoiceForm(customerId) {
    return { customerId: customerId || '', number: '', currency: 'USD', status: 'draft', dueAt: '', notes: '' };
  }

  function base() {
    return {
      label: '',
      permission: { canManage: true, role: 'Owner' },
      loading: false,
      backendError: null,
      customers: DIRECTORY.slice(),
      selectedCustomerId: null,
      customerForm: blankCustomerForm(),
      invoiceForm: blankInvoiceForm(null),
      actionLoading: null,            // 'create-customer' | 'create-invoice' | null
      customerError: null,
      invoiceError: null,
      lastCreatedInvoice: null,       // InvoiceSummaryResponse-ish after success
      step: 'buyer'                   // 'buyer' | 'identity' | 'draft'
    };
  }

  window.FLOW_DATA = {
    idTypes: ID_TYPES,

    /* GET /api/auth/me + tenant context */
    user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },
    tenant: { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' },
    memberships: [
      { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
      { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
    ],

    /* GET /api/tenancy/tenants/{slug}/products — sidebar nav (Invoicing active) */
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

    /* numbering suggestion — InvoiceNumberingSettingsResponse.previewNumber (01) */
    numbering: { documentCode: '01', previewNumber: '001-001-000000148', configured: true },

    backendErrorInfo: {
      title: 'No pudimos cargar tus compradores',
      message: 'No pudimos consultar el directorio de compradores ni las facturas (GET /api/invoicing/tenants/acme-logistica/customers).',
      correlationId: 'req_8fd1c044'
    },

    /* AI assistant — suggestion-first, never autonomous, never SRI here */
    assistant: {
      greeting: 'Hola José — te acompaño a crear tu primera factura.',
      disclaimer: 'El asistente prepara y explica. No emite, firma ni declara nada ante el SRI sin tu aprobación.',
      suggestions: [
        { icon: 'userPlus', tone: 'info', title: 'Empieza por el comprador', body: 'Un borrador necesita un comprador con datos fiscales. Puedo abrirte el formulario con el tipo de identificación correcto para Ecuador.', action: 'Crear comprador' },
        { icon: 'fileText', tone: 'info', title: 'El borrador no se envía al SRI', body: 'Crear el borrador solo arma el documento. Los items, la firma y el envío al SRI vienen después, en sus propias pantallas.', action: 'Entendido' }
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
       SCENARIOS — one per state the handoff asks us to design explicitly.
       ------------------------------------------------------------------- */
    scenarios: (function () {
      var S = {};

      /* 1 — loading customers / invoices */
      S.loading = (function () { var s = base(); s.label = 'Cargando'; s.loading = true; s.customers = []; return s; })();

      /* 2 — no customers yet (strong empty state for the first buyer) */
      S.no_customers = (function () {
        var s = base(); s.label = 'Sin compradores'; s.customers = []; s.selectedCustomerId = null;
        s.invoiceForm = blankInvoiceForm(null); s.step = 'buyer';
        return s;
      })();

      /* 3 — customers available (directory, none selected yet) */
      S.customers_available = (function () {
        var s = base(); s.label = 'Compradores disponibles'; s.selectedCustomerId = null; s.step = 'buyer';
        return s;
      })();

      /* 4 — buyer selected (identity confirmation step) */
      S.buyer_selected = (function () {
        var s = base(); s.label = 'Comprador seleccionado'; s.selectedCustomerId = 'cus_01'; s.step = 'identity';
        s.invoiceForm = blankInvoiceForm('cus_01');
        return s;
      })();

      /* 5 — buyer form partially complete (new buyer being typed) */
      S.buyer_form_partial = (function () {
        var s = base(); s.label = 'Formulario incompleto'; s.step = 'buyer'; s.selectedCustomerId = null;
        s.customerForm = { name: 'Distribuidora El Oro', email: '', identificationType: '04', taxId: '0790', billingAddress: '' };
        s.customerError = null;
        return s;
      })();

      /* 6 — customer creation in progress */
      S.customer_creating = (function () {
        var s = base(); s.label = 'Creando comprador'; s.step = 'buyer'; s.selectedCustomerId = null;
        s.customerForm = { name: 'Distribuidora El Oro', email: 'compras@eloro.ec', identificationType: '04', taxId: '0790123456001', billingAddress: 'Av. 25 de Junio, Machala' };
        s.actionLoading = 'create-customer';
        return s;
      })();

      /* 7 — customer creation failed */
      S.customer_failed = (function () {
        var s = base(); s.label = 'Error al crear comprador'; s.step = 'buyer'; s.selectedCustomerId = null;
        s.customerForm = { name: 'Distribuidora El Oro', email: 'compras@eloro.ec', identificationType: '04', taxId: '0790123456001', billingAddress: 'Av. 25 de Junio, Machala' };
        s.customerError = 'El RUC ingresado ya pertenece a otro comprador de este tenant. Revisa la identificación e inténtalo de nuevo.';
        return s;
      })();

      /* 8 — invoice draft disabled because no buyer exists */
      S.invoice_disabled_no_buyer = (function () {
        var s = base(); s.label = 'Borrador bloqueado · sin comprador'; s.customers = []; s.selectedCustomerId = null;
        s.invoiceForm = blankInvoiceForm(null); s.step = 'draft';
        return s;
      })();

      /* 9 — invoice draft ready (buyer chosen, form prefilled) */
      S.invoice_ready = (function () {
        var s = base(); s.label = 'Borrador listo'; s.selectedCustomerId = 'cus_01'; s.step = 'draft';
        s.invoiceForm = { customerId: 'cus_01', number: '', currency: 'USD', status: 'draft', dueAt: '2026-07-15', notes: 'Servicios de logística junio 2026.' };
        return s;
      })();

      /* 10 — invoice creation in progress */
      S.invoice_creating = (function () {
        var s = base(); s.label = 'Creando factura'; s.selectedCustomerId = 'cus_01'; s.step = 'draft';
        s.invoiceForm = { customerId: 'cus_01', number: '', currency: 'USD', status: 'draft', dueAt: '2026-07-15', notes: 'Servicios de logística junio 2026.' };
        s.actionLoading = 'create-invoice';
        return s;
      })();

      /* 11 — invoice creation failed */
      S.invoice_failed = (function () {
        var s = base(); s.label = 'Error al crear factura'; s.selectedCustomerId = 'cus_01'; s.step = 'draft';
        s.invoiceForm = { customerId: 'cus_01', number: '001-001-000000148', currency: 'USD', status: 'draft', dueAt: '2026-07-15', notes: 'Servicios de logística junio 2026.' };
        s.invoiceError = 'Ese número de factura ya existe para el tenant. Deja el campo vacío para autogenerar el siguiente, o usa otro número.';
        return s;
      })();

      /* 12 — invoice created (success — clear distinction from "buyer saved") */
      S.invoice_created = (function () {
        var s = base(); s.label = 'Borrador creado'; s.selectedCustomerId = 'cus_01'; s.step = 'draft';
        s.invoiceForm = blankInvoiceForm('cus_01');
        s.lastCreatedInvoice = { id: 'inv_5a1c', number: '001-001-000000148', status: 'draft', currency: 'USD', customerName: 'Comercial Andina S.A.', issuedAt: '2026-06-17', dueAt: '2026-07-15', itemCount: 0 };
        return s;
      })();

      /* 13 — permission-limited (view only) */
      S.permission_limited = (function () {
        var s = base(); s.label = 'Permiso limitado'; s.selectedCustomerId = 'cus_01'; s.step = 'identity';
        s.permission = { canManage: false, role: 'Viewer', missingPermission: 'invoicing.manage' };
        s.invoiceForm = blankInvoiceForm('cus_01');
        return s;
      })();

      /* 14 — backend unavailable */
      S.backend_unavailable = (function () { var s = base(); s.label = 'Backend no disponible'; s.backendError = true; return s; })();

      return S;
    })()
  };
})();
