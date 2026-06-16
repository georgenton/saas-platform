/* Inlined mock data for the Invoicing workspace slice. Each block notes the
   endpoint it mirrors (see docs/frontend-handoff/02-invoicing.md). In
   production, replace INV_DATA with fetches; mock-data/*.json carries the same
   shapes one-per-endpoint. Money is in cents to match the backend contract. */
window.INV_DATA = {
  /* GET /api/auth/me  +  /api/tenancy/tenants/{slug} */
  user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },
  tenant: { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' },
  memberships: [
    { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
    { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
  ],

  /* GET /api/tenancy/tenants/{slug}/subscription */
  subscription: { planName: 'Growth', priceDisplay: '$49 / mo', renewsAt: '14 jul 2026', seats: { used: 6, included: 10 } },

  /* GET /api/tenancy/tenants/{slug}/products  — drives the sidebar nav */
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

  env: { label: 'Local / dev environment', apiBaseUrl: 'http://127.0.0.1:3000/api' },
  backendError: { title: 'No pudimos cargar Invoicing', message: 'No pudimos conectar con la API de facturación (GET /api/invoicing/tenants/acme-logistica/reports/summary).', correlationId: 'req_8c41ad20' },

  /* GET /api/invoicing/tenants/{slug}/electronic-profile
     +  /electronic-signature/inspection  +  /electronic-submission  +  /numbering/invoice
     Composed into the readiness summary. `ready` is derived, not assumed. */
  electronic: {
    ready: true,
    issuer: {
      legalName: 'Acme Logística S.A.',
      tradeName: 'Acme Logística',
      ruc: '1790012345001',
      environment: 'production',          // production | sandbox
      address: 'Av. Amazonas N34-451, Quito',
      obligadoContabilidad: true,
      complete: true
    },
    signature: {
      status: 'valid',                    // valid | expiring | expired | missing
      subject: 'ACME LOGISTICA S.A.',
      issuer: 'Security Data C.A.',
      validUntil: '2026-11-08',
      daysToExpiry: 145,
      inspected: true
    },
    submission: {
      gatewayConfigured: true,
      isActive: true,
      environment: 'production',
      lastCheckedAt: 'hace 8 min'
    },
    numbering: {
      establishment: '001',
      emissionPoint: '001',
      nextNumber: '001-001-000148',
      sequentialRemaining: 99852
    }
  },

  /* GET /api/invoicing/tenants/{slug}/reports/summary */
  portfolio: {
    currency: 'USD',
    pendingAuthorization: 3,
    authorizedThisMonth: 64,
    rejectedThisMonth: 1,
    draftCount: 2,
    portfolioTotalInCents: 4928640,      // $49,286.40
    outstandingInCents: 1184500,         // $11,845.00 por cobrar
    period: 'junio 2026'
  },

  /* GET /api/invoicing/tenants/{slug}/invoices  (list)
     status: draft | issued ; electronic: none | generated | submitted | authorized | rejected */
  invoices: [
    {
      id: 'inv_0148', number: '001-001-000148', customer: 'Comercial Andina Cía. Ltda.', customerRuc: '0992345678001',
      issuedAt: '16 jun 2026', dueLabel: 'Borrador', status: 'draft', electronic: 'none',
      totalInCents: 268800, subtotalInCents: 240000, ivaInCents: 28800, currency: 'USD', items: 4,
      accessKey: null, authorizationNumber: null, authorizedAt: null, rejection: null
    },
    {
      id: 'inv_0147', number: '001-001-000147', customer: 'Distribuidora El Sol S.A.', customerRuc: '1791234567001',
      issuedAt: '16 jun 2026', dueLabel: 'Borrador', status: 'draft', electronic: 'none',
      totalInCents: 95200, subtotalInCents: 85000, ivaInCents: 10200, currency: 'USD', items: 2,
      accessKey: null, authorizationNumber: null, authorizedAt: null, rejection: null
    },
    {
      id: 'inv_0146', number: '001-001-000146', customer: 'Talleres Pichincha', customerRuc: '1722334455001',
      issuedAt: '16 jun 2026', dueLabel: 'Generado', status: 'issued', electronic: 'generated',
      totalInCents: 156800, subtotalInCents: 140000, ivaInCents: 16800, currency: 'USD', items: 3,
      accessKey: '1606202601179001234500110010000146...', authorizationNumber: null, authorizedAt: null, rejection: null
    },
    {
      id: 'inv_0145', number: '001-001-000145', customer: 'Importadora Costa Verde', customerRuc: '0990012345001',
      issuedAt: '16 jun 2026', dueLabel: 'En el SRI', status: 'issued', electronic: 'submitted',
      totalInCents: 504000, subtotalInCents: 450000, ivaInCents: 54000, currency: 'USD', items: 6,
      accessKey: '1606202601179001234500110010000145129384756', authorizationNumber: null, authorizedAt: null, rejection: null
    },
    {
      id: 'inv_0144', number: '001-001-000144', customer: 'Ferretería Los Andes', customerRuc: '1712233445001',
      issuedAt: '15 jun 2026', dueLabel: 'Rechazada', status: 'issued', electronic: 'rejected',
      totalInCents: 78400, subtotalInCents: 70000, ivaInCents: 8400, currency: 'USD', items: 1,
      accessKey: '1506202601179001234500110010000144558372910', authorizationNumber: null, authorizedAt: null,
      rejection: { code: '43', message: 'El RUC del comprador no es válido para el régimen.', field: 'identificacionComprador', detail: 'Verifica el RUC 1712233445001 con la Parte y vuelve a generar el documento.' }
    },
    {
      id: 'inv_0143', number: '001-001-000143', customer: 'Hotel Quitumbe', customerRuc: '1790567890001',
      issuedAt: '15 jun 2026', dueLabel: 'Autorizada', status: 'issued', electronic: 'authorized',
      totalInCents: 940800, subtotalInCents: 840000, ivaInCents: 100800, currency: 'USD', items: 8,
      accessKey: '1506202601179001234500110010000143847261093', authorizationNumber: '1506202601179001234500110010000143847261093', authorizedAt: '15 jun 2026 · 14:32', rejection: null
    },
    {
      id: 'inv_0142', number: '001-001-000142', customer: 'Supermercados Mi Tienda', customerRuc: '0991122334001',
      issuedAt: '14 jun 2026', dueLabel: 'Autorizada', status: 'issued', electronic: 'authorized',
      totalInCents: 1318000, subtotalInCents: 1176786, ivaInCents: 141214, currency: 'USD', items: 11,
      accessKey: '1406202601179001234500110010000142193847562', authorizationNumber: '1406202601179001234500110010000142193847562', authorizedAt: '14 jun 2026 · 09:11', rejection: null
    }
  ],

  /* Per-status copy for the document lifecycle stepper + detail panel.
     Distinguishes preview / generated / submitted / authorized / rejected. */
  electronicSteps: ['none', 'generated', 'submitted', 'authorized'],

  /* AI assistant — suggestion-first copilot presence (never autonomous). */
  assistant: {
    greeting: 'Hola José — revisé tu cola de facturación de hoy.',
    disclaimer: 'El asistente prepara y explica. No genera, envía ni autoriza ningún documento sin tu aprobación.',
    suggestions: [
      { icon: 'fileCheck', tone: 'info', title: '2 borradores listos para generar', body: 'Revisé los borradores 147 y 148: totales e IVA cuadran. Puedo prepararlos para que los generes.', action: 'Revisar borradores' },
      { icon: 'fileX', tone: 'warning', title: 'Factura 144 rechazada por el SRI', body: 'El RUC del comprador fue observado (código 43). Te muestro qué corregir antes de volver a generar.', action: 'Ver observación' },
      { icon: 'tax', tone: 'neutral', title: 'IVA de junio para Tax Compliance', body: 'Las 64 facturas autorizadas suman el IVA del período. Preparo el resumen para el handoff a Tax Compliance.', action: 'Preparar resumen' }
    ]
  },

  /* Frontend-only — moods (no backend endpoint). */
  moods: [
    { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
    { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
    { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
    { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
    { key: 'night', label: 'Night', desc: 'Low-glare dark' }
  ]
};
