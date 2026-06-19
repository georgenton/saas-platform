/* Mock data for slice 10 — Invoicing Payment + Email Delivery Closeout.
   Continues the post-issue lane after slice 08 (document review) and slice 09
   (SRI submission lifecycle). Targets the real component boundaries:
     apps/web-platform/src/features/invoicing/workspace-documents.tsx
     apps/web-platform/src/features/invoicing/workspace-commercial.tsx
   → InvoicingNotificationsPanel + InvoicingPaymentsPanel.

   Shaped 1:1 to the frozen contracts (apps/web-platform/src/app/types.ts +
   api.ts):
     InvoiceDetailResponse  — number, status, electronicStatus, buyer*,
                              currency, totals, settlement, payments[]
     InvoiceSettlement      — paidInCents, balanceDueInCents, isFullyPaid
     PaymentResponse        — amountInCents, currency, status, method,
                              reference, paidAt, notes, reversedAt, reversalReason
   Plus the local derived inputs the panels already receive: the email form
   fields (recipientEmail / message), the payment form fields, actionLoading,
   permission, and the parent action message / error pattern.

   ONLY these endpoint surfaces are used by this slice:
     POST  /api/invoicing/tenants/{slug}/invoices/{invoiceId}/send-email
     POST  /api/invoicing/tenants/{slug}/invoices/{invoiceId}/payments
     POST  /api/invoicing/tenants/{slug}/invoices/{invoiceId}/payments/{paymentId}/reverse
     GET   /api/invoicing/tenants/{slug}/invoices/{invoiceId}   (refresh)
   No gateway, reconciliation, WhatsApp, delivery tracking, resend history,
   receipt PDF, accounting journal or tax filing is invented.

   CRITICAL TRUTH RULE encoded everywhere:
   - Email delivery, payment and SRI authorization are THREE INDEPENDENT truths.
     The UI never implies legal authorization from delivery or payment, never
     implies payment from authorization, and never posts journals or files
     declarations automatically. The downstream card is an evidence hint only.

   window.CLOSEOUT_DATA carries shell context (reused from slices 00/02/05–09)
   plus one SCENARIO per state the handoff names. */
(function () {
  var ACCESS_KEY = '1706202601179001234500110010010001480123456789';
  var AUTH_AT = '2026-06-17T12:05:00-05:00';

  /* ---- PaymentResponse factory --------------------------------------- */
  function payment(over) {
    return Object.assign({
      id: 'pay_0001', tenantId: 'ten_acme', invoiceId: 'inv_5a1c',
      amountInCents: 115050, currency: 'USD', status: 'posted',
      method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00',
      notes: '', reversedAt: null, reversalReason: null,
      createdAt: '2026-06-17T15:20:30-05:00'
    }, over || {});
  }

  /* ---- InvoiceDetailResponse (the closeout-relevant subset) ----------- */
  function invoice(over) {
    var base = {
      id: 'inv_5a1c', tenantId: 'ten_acme', customerId: 'cus_01',
      number: '001-001-000000148',
      documentCode: '01', establishmentCode: '001', emissionPointCode: '001', sequenceNumber: 148,
      buyerIdentificationType: '04', buyerIdentification: '1791234567001',
      buyerName: 'Comercial Andina S.A.', buyerEmail: 'cobranzas@comercialandina.ec',
      buyerAddress: 'Av. República del Salvador N35-04, Quito',
      status: 'issued', currency: 'USD',
      electronicStatus: 'authorized', accessKey: ACCESS_KEY, authorizationNumber: ACCESS_KEY, authorizedAt: AUTH_AT,
      issuedAt: '2026-06-17T11:20:00-05:00', dueAt: '2026-07-15', notes: 'Servicios de logística junio 2026.',
      createdAt: '2026-06-17T11:20:00-05:00', updatedAt: '2026-06-17T15:20:00-05:00',
      items: [
        { id: 'it_01', position: 1, description: 'Servicio de logística — ruta Quito/Guayaquil', quantity: 1, unitPriceInCents: 200000, lineTotalInCents: 200000, taxRateName: 'IVA', taxRatePercentage: 15, lineTaxInCents: 30000 }
      ],
      payments: [],
      totals: { subtotalInCents: 200000, taxInCents: 30100, totalInCents: 230100 },
      settlement: { paidInCents: 0, balanceDueInCents: 230100, isFullyPaid: false }
    };
    var inv = Object.assign(base, over || {});
    return inv;
  }

  /* recompute settlement from a payments array (posted payments only) */
  function settle(inv) {
    var paid = (inv.payments || []).reduce(function (sum, p) { return p.status === 'posted' ? sum + p.amountInCents : sum; }, 0);
    var total = inv.totals.totalInCents;
    var balance = Math.max(0, total - paid);
    inv.settlement = { paidInCents: paid, balanceDueInCents: balance, isFullyPaid: balance === 0 && total > 0 };
    return inv;
  }

  /* delivery state mirror (InvoicingNotificationsPanel local form + result) */
  function delivery(over) {
    return Object.assign({ recipientEmail: '', message: '', lastSentAt: null, sending: false, error: null }, over || {});
  }

  /* payment form mirror (InvoicingPaymentsPanel controlled inputs) */
  function paymentForm(inv) {
    return {
      amount: inv && inv.settlement ? (inv.settlement.balanceDueInCents / 100).toFixed(2) : '',
      method: 'transfer', reference: '', paidAt: '2026-06-17T15:30', notes: ''
    };
  }

  function base() {
    var inv = invoice({});
    return {
      label: '', permission: { canManage: true, role: 'Owner' },
      loading: false, backendError: null,
      invoice: inv,
      delivery: delivery({ recipientEmail: inv.buyerEmail }),
      paymentForm: paymentForm(inv),
      actionLoading: null,       // 'send-invoice-email' | 'create-invoice-payment' | 'reverse-invoice-payment'
      reverseTargetId: null,     // payment id being reversed
      paymentError: null,
      actionMessage: null        // parent success message pattern
    };
  }

  window.CLOSEOUT_DATA = {
    accessKeyDemo: ACCESS_KEY,
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
      title: 'No pudimos cargar el cierre de la factura',
      message: 'No pudimos consultar entrega y pagos de esta factura (GET /api/invoicing/tenants/acme-logistica/invoices/inv_5a1c).',
      correlationId: 'req_e91b4470'
    },

    /* payment method vocabulary (LATAM/Ecuador-friendly labels) */
    methods: [
      { value: 'transfer', label: 'Transferencia' },
      { value: 'cash', label: 'Efectivo' },
      { value: 'card', label: 'Tarjeta' },
      { value: 'check', label: 'Cheque' },
      { value: 'other', label: 'Otro' }
    ],

    assistant: {
      greeting: 'Hola José — te acompaño a cerrar esta factura: entregarla, cobrarla y dejar evidencia ordenada.',
      disclaimer: 'El asistente explica el cierre. No declara impuestos, no contabiliza ni concilia con el banco. Esas son áreas separadas.',
      suggestions: [
        { icon: 'send', tone: 'info', title: 'Una acción a la vez', value: 'Te muestro el único paso recomendado según el estado: enviar al cliente o registrar el pago. Sin abrumarte.', action: 'Entendido' },
        { icon: 'layers', tone: 'info', title: 'Tres verdades separadas', value: 'Autorización del SRI, entrega al cliente y pago son cosas distintas. Que envíes el correo no significa que esté pagada ni autorizada.', action: 'Entendido' }
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
       SCENARIOS — each is a full snapshot the panels consume directly.
       ------------------------------------------------------------------- */
    scenarios: (function () {
      var S = {};

      /* 1 — no selected invoice */
      S.no_invoice = (function () { var s = base(); s.label = 'Sin factura seleccionada'; s.invoice = null; s.delivery = delivery({}); return s; })();

      /* 2 — loading */
      S.loading = (function () { var s = base(); s.label = 'Cargando'; s.loading = true; return s; })();

      /* 3 — draft invoice (cannot be delivered or settled yet) */
      S.invoice_draft = (function () {
        var s = base(); s.label = 'Factura en borrador';
        s.invoice = settle(invoice({ status: 'draft', electronicStatus: 'pending_submission', accessKey: null, authorizationNumber: null, authorizedAt: null }));
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail });
        s.paymentForm = paymentForm(s.invoice);
        return s;
      })();

      /* 4 — issued invoice with open balance (the entry point) */
      S.issued_open = (function () {
        var s = base(); s.label = 'Emitida · saldo abierto';
        return s;
      })();

      /* 5 — issued without customer email (delivery blocked) */
      S.no_email = (function () {
        var s = base(); s.label = 'Sin correo del cliente';
        s.invoice = settle(invoice({ buyerEmail: null }));
        s.delivery = delivery({ recipientEmail: '' });
        s.paymentForm = paymentForm(s.invoice);
        return s;
      })();

      /* 6 — email ready to send */
      S.email_ready = (function () {
        var s = base(); s.label = 'Correo listo para enviar';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, message: 'Estimados, adjuntamos su factura electrónica autorizada. Quedamos atentos. Saludos, Acme Logística.' });
        return s;
      })();

      /* 7 — email sending */
      S.email_sending = (function () {
        var s = base(); s.label = 'Enviando correo';
        s.actionLoading = 'send-invoice-email';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, message: 'Estimados, adjuntamos su factura electrónica autorizada.' });
        return s;
      })();

      /* 8 — email sent success */
      S.email_sent = (function () {
        var s = base(); s.label = 'Correo enviado';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.actionMessage = { tone: 'success', text: 'Enviamos el comprobante a ' + s.invoice.buyerEmail + '.' };
        return s;
      })();

      /* 9 — email send error */
      S.email_error = (function () {
        var s = base(); s.label = 'Error al enviar correo';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, error: 'El servidor de correo rechazó el envío (550). Verifica la dirección e inténtalo de nuevo.' });
        return s;
      })();

      /* 10 — unpaid invoice (delivered, no payments) */
      S.unpaid = (function () {
        var s = base(); s.label = 'Entregada · sin pagos';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        return s;
      })();

      /* 11 — partial payment */
      S.partial = (function () {
        var s = base(); s.label = 'Pago parcial';
        var inv = invoice({ payments: [payment({ amountInCents: 80000, method: 'cash', reference: 'REC-0042', paidAt: '2026-06-17T15:10:00-05:00', notes: 'Abono inicial en oficina.' })] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 12 — fully paid invoice */
      S.fully_paid = (function () {
        var s = base(); s.label = 'Factura pagada';
        var inv = invoice({ payments: [
          payment({ id: 'pay_0001', amountInCents: 115050, method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00' }),
          payment({ id: 'pay_0002', amountInCents: 115050, method: 'transfer', reference: 'TRF-0099120', paidAt: '2026-06-18T09:05:00-05:00', notes: 'Saldo final.' })
        ] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 13 — payment creation loading */
      S.payment_loading = (function () {
        var s = base(); s.label = 'Registrando pago';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.actionLoading = 'create-invoice-payment';
        s.paymentForm = { amount: '2301.00', method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:30', notes: '' };
        return s;
      })();

      /* 14 — payment creation error */
      S.payment_error = (function () {
        var s = base(); s.label = 'Error al registrar pago';
        s.delivery = delivery({ recipientEmail: s.invoice.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentError = 'El monto supera el saldo pendiente. Ajusta el valor: no puedes registrar más de $2,301.00.';
        s.paymentForm = { amount: '3000.00', method: 'transfer', reference: '', paidAt: '2026-06-17T15:30', notes: '' };
        return s;
      })();

      /* 15 — one posted payment */
      S.one_payment = (function () {
        var s = base(); s.label = 'Un pago registrado';
        var inv = invoice({ payments: [payment({ amountInCents: 115050, method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00' })] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 16 — multiple payments */
      S.multiple_payments = (function () {
        var s = base(); s.label = 'Varios pagos';
        var inv = invoice({ payments: [
          payment({ id: 'pay_0001', amountInCents: 115050, method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00' }),
          payment({ id: 'pay_0002', amountInCents: 80000, method: 'cash', reference: 'REC-0042', paidAt: '2026-06-18T09:05:00-05:00', notes: 'Abono en oficina.' })
        ] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 17 — reversed payment */
      S.reversed_payment = (function () {
        var s = base(); s.label = 'Pago revertido';
        var inv = invoice({ payments: [
          payment({ id: 'pay_0001', amountInCents: 115050, method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00' }),
          payment({ id: 'pay_0002', amountInCents: 80000, method: 'cash', reference: 'REC-0042', paidAt: '2026-06-17T16:00:00-05:00', status: 'reversed', reversedAt: '2026-06-17T17:30:00-05:00', reversalReason: 'Cheque sin fondos — el abono no se concretó.' })
        ] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 18 — reverse payment loading */
      S.reverse_loading = (function () {
        var s = base(); s.label = 'Revirtiendo pago';
        var inv = invoice({ payments: [
          payment({ id: 'pay_0001', amountInCents: 115050, method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00' }),
          payment({ id: 'pay_0002', amountInCents: 80000, method: 'cash', reference: 'REC-0042', paidAt: '2026-06-18T09:05:00-05:00' })
        ] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.actionLoading = 'reverse-invoice-payment';
        s.reverseTargetId = 'pay_0002';
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 19 — permission-limited / read-only */
      S.permission_limited = (function () {
        var s = base(); s.label = 'Permiso limitado';
        s.permission = { canManage: false, role: 'Viewer', missingPermission: 'invoicing.manage' };
        var inv = invoice({ payments: [payment({ amountInCents: 115050, method: 'transfer', reference: 'TRF-0098341', paidAt: '2026-06-17T15:20:00-05:00' })] });
        settle(inv);
        s.invoice = inv;
        s.delivery = delivery({ recipientEmail: inv.buyerEmail, lastSentAt: '2026-06-17T14:02:00-05:00' });
        s.paymentForm = paymentForm(inv);
        return s;
      })();

      /* 20 — backend unavailable */
      S.backend_unavailable = (function () { var s = base(); s.label = 'Backend no disponible'; s.backendError = true; return s; })();

      return S;
    })()
  };
})();
