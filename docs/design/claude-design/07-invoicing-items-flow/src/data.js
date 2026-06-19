/* Mock data for slice 07 — Invoicing Items Flow.
   Refines apps/web-platform/src/features/invoicing/workspace-commercial.tsx
   (exported InvoicingInvoiceItemsPanel).

   Shaped 1:1 to the frozen contracts (apps/web-platform/src/app/types.ts +
   api.ts): InvoiceDetailResponse, InvoiceItemResponse, TaxRateResponse,
   InvoiceTotals, InvoiceSettlement, and createInvoiceItem(body) =
   { description, quantity, unitPriceInCents, taxRateId? }.

   IMPORTANT — money is stored in CENTS in the contract (unitPriceInCents,
   lineTotalInCents, lineTaxInCents, totals.*InCents). The design expresses money
   in normal currency terms and maps back to the cents control; see
   integration-plan.md (§ "Precio unitario" → newItemUnitPriceInCents).

   The backend owns position, lineTotalInCents, lineTaxInCents and the invoice
   totals. Any client figure shown before creation is a clearly-labeled PREVIEW.

   window.ITEMS_DATA carries shell context (reused from slices 00/02/05/06) plus
   one SCENARIO per state the handoff names. Each scenario is a full snapshot:
   selectedInvoiceDetail (with items + totals + settlement), taxRates, the
   new-item form, actionLoading, errors and permission. */
(function () {
  /* ---- tax rates (TaxRateResponse[]) — percentage as whole numbers --- */
  function taxRatesActive() {
    return [
      { id: 'tax_iva15', tenantId: 'ten_acme', name: 'IVA', percentage: 15, isActive: true, createdAt: '2024-04-01T00:00:00-05:00', updatedAt: '2024-04-01T00:00:00-05:00' },
      { id: 'tax_iva5', tenantId: 'ten_acme', name: 'IVA reducido', percentage: 5, isActive: true, createdAt: '2024-04-01T00:00:00-05:00', updatedAt: '2024-04-01T00:00:00-05:00' },
      { id: 'tax_iva0', tenantId: 'ten_acme', name: 'Exento', percentage: 0, isActive: true, createdAt: '2024-04-01T00:00:00-05:00', updatedAt: '2024-04-01T00:00:00-05:00' }
    ];
  }

  /* ---- item factory (InvoiceItemResponse) ----------------------------- */
  function item(id, position, description, quantity, unitPriceInCents, taxRate) {
    var lineSub = quantity * unitPriceInCents;
    var pct = taxRate ? taxRate.percentage : null;
    var lineTax = pct != null ? Math.round(lineSub * pct / 100) : 0;
    return {
      id: id, tenantId: 'ten_acme', invoiceId: 'inv_5a1c', position: position,
      description: description, quantity: quantity, unitPriceInCents: unitPriceInCents,
      lineTotalInCents: lineSub + lineTax,
      taxRateId: taxRate ? taxRate.id : null,
      taxRateName: taxRate ? taxRate.name : null,
      taxRatePercentage: pct,
      lineTaxInCents: lineTax,
      createdAt: '2026-06-17T11:40:00-05:00', updatedAt: '2026-06-17T11:40:00-05:00'
    };
  }
  function totalsFrom(items) {
    var sub = 0, tax = 0;
    items.forEach(function (it) { sub += it.quantity * it.unitPriceInCents; tax += it.lineTaxInCents; });
    return { subtotalInCents: sub, taxInCents: tax, totalInCents: sub + tax };
  }

  /* ---- invoice detail (InvoiceDetailResponse) ------------------------- */
  function invoice(over) {
    var items = over && over.items ? over.items : [];
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
      createdAt: '2026-06-17T11:20:00-05:00', updatedAt: '2026-06-17T11:40:00-05:00',
      items: items, payments: [], electronicEvents: [],
      totals: totalsFrom(items),
      settlement: { paidInCents: 0, balanceDueInCents: totalsFrom(items).totalInCents, isFullyPaid: false }
    }, over || {});
  }

  function blankItemForm() { return { description: '', quantity: '1', unitPrice: '', taxRateId: 'tax_iva15' }; }

  var SAMPLE_ITEMS = (function () {
    var t = taxRatesActive();
    return [
      item('it_01', 1, 'Servicio de logística — ruta Quito/Guayaquil', 1, 120000, t[0]),
      item('it_02', 2, 'Almacenaje (m³ · mes)', 12, 4500, t[0]),
      item('it_03', 3, 'Seguro de mercadería', 1, 30000, t[2])
    ];
  })();

  function base() {
    return {
      label: '',
      permission: { canManage: true, role: 'Owner' },
      loading: false,
      backendError: null,
      invoice: invoice({}),
      taxRates: taxRatesActive(),
      itemForm: blankItemForm(),
      actionLoading: null,         // 'create-invoice-item' | null
      itemError: null
    };
  }

  window.ITEMS_DATA = {
    /* GET /api/auth/me + tenant context */
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
      title: 'No pudimos cargar esta factura',
      message: 'No pudimos consultar el detalle de la factura ni sus items (GET /api/invoicing/tenants/acme-logistica/invoices/inv_5a1c).',
      correlationId: 'req_a13c77e0'
    },

    assistant: {
      greeting: 'Hola José — te ayudo a componer esta factura.',
      disclaimer: 'El asistente prepara y explica. No emite, firma ni declara nada ante el SRI sin tu aprobación.',
      suggestions: [
        { icon: 'listPlus', tone: 'info', title: 'Agrega tu primera línea', body: 'Describe el servicio, pon la cantidad y el precio unitario, y elige el impuesto. Yo calculo el subtotal estimado mientras escribes.', action: 'Agregar línea' },
        { icon: 'calculator', tone: 'info', title: 'Cómo se forma el total', body: 'El total es la suma de cada línea (cantidad × precio) más el IVA de cada línea. El backend hace el cálculo oficial al guardar.', action: 'Entendido' }
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

      /* 1 — loading */
      S.loading = (function () { var s = base(); s.label = 'Cargando'; s.loading = true; return s; })();

      /* 2 — draft ready for items (clean entry, zero items) */
      S.draft_ready = (function () {
        var s = base(); s.label = 'Borrador listo para items';
        s.invoice = invoice({ items: [] });
        return s;
      })();

      /* 3 — no items (empty list emphasis — same data, surfaced as empty state) */
      S.no_items = (function () {
        var s = base(); s.label = 'Sin items';
        s.invoice = invoice({ items: [], notes: null });
        return s;
      })();

      /* 4 — with items */
      S.with_items = (function () {
        var s = base(); s.label = 'Con items';
        s.invoice = invoice({ items: SAMPLE_ITEMS.slice() });
        return s;
      })();

      /* 5 — add-item form partially complete */
      S.form_partial = (function () {
        var s = base(); s.label = 'Formulario incompleto';
        s.invoice = invoice({ items: SAMPLE_ITEMS.slice(0, 1) });
        s.itemForm = { description: 'Transporte adicional fin de semana', quantity: '2', unitPrice: '', taxRateId: 'tax_iva15' };
        return s;
      })();

      /* 6 — item creation in progress */
      S.creating_item = (function () {
        var s = base(); s.label = 'Creando item';
        s.invoice = invoice({ items: SAMPLE_ITEMS.slice(0, 1) });
        s.itemForm = { description: 'Transporte adicional fin de semana', quantity: '2', unitPrice: '85.00', taxRateId: 'tax_iva15' };
        s.actionLoading = 'create-invoice-item';
        return s;
      })();

      /* 7 — item creation failed */
      S.create_failed = (function () {
        var s = base(); s.label = 'Error al crear item';
        s.invoice = invoice({ items: SAMPLE_ITEMS.slice(0, 1) });
        s.itemForm = { description: 'Transporte adicional fin de semana', quantity: '2', unitPrice: '85.00', taxRateId: 'tax_iva15' };
        s.itemError = 'No pudimos agregar la línea. El precio unitario debe ser mayor a cero. Revisa el valor e inténtalo de nuevo.';
        return s;
      })();

      /* 8 — no active tax rates */
      S.no_tax_rates = (function () {
        var s = base(); s.label = 'Sin impuestos activos';
        s.invoice = invoice({ items: [] });
        s.taxRates = [
          { id: 'tax_iva15', tenantId: 'ten_acme', name: 'IVA', percentage: 15, isActive: false, createdAt: '2024-04-01T00:00:00-05:00', updatedAt: '2026-05-01T00:00:00-05:00' }
        ];
        s.itemForm = { description: '', quantity: '1', unitPrice: '', taxRateId: '' };
        return s;
      })();

      /* 9 — non-draft invoice: adding items should feel constrained */
      S.non_draft_constrained = (function () {
        var s = base(); s.label = 'Factura no-draft (constrained)';
        var its = SAMPLE_ITEMS.slice();
        s.invoice = invoice({ items: its, status: 'issued', electronicStatus: 'authorized', accessKey: '1706202601179001234500110010010001480123456789', authorizationNumber: '1706202601179001234500110010010001480123456789', authorizedAt: '2026-06-17T12:05:00-05:00' });
        return s;
      })();

      /* 10 — permission-limited / read-only */
      S.permission_limited = (function () {
        var s = base(); s.label = 'Permiso limitado';
        s.permission = { canManage: false, role: 'Viewer', missingPermission: 'invoicing.manage' };
        s.invoice = invoice({ items: SAMPLE_ITEMS.slice() });
        return s;
      })();

      /* 11 — backend unavailable */
      S.backend_unavailable = (function () { var s = base(); s.label = 'Backend no disponible'; s.backendError = true; return s; })();

      return S;
    })()
  };
})();
