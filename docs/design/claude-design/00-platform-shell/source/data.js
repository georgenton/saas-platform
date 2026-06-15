/* Inlined mock data mirroring ui_kits/platform-shell/mock-data/*.json so the
   prototype runs standalone. In production, replace SHELL_DATA with fetches to
   the endpoints noted on each block. */
window.SHELL_DATA = {
  // GET /api/auth/me
  user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },
  tenant: { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' },
  memberships: [
    { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
    { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
  ],

  // GET /api/tenancy/tenants/{slug}/subscription
  subscription: { planName: 'Growth', priceDisplay: '$49 / mo', renewsAt: '14 jul 2026', seats: { used: 6, included: 10 } },

  // GET /api/tenancy/tenants/{slug}/products  (accessState drives the nav)
  products: [
    { key: 'dashboard', name: 'Dashboard', group: 'Core', icon: 'dashboard', state: 'enabled' },
    { key: 'invoicing', name: 'Invoicing', group: 'Finance', icon: 'invoicing', state: 'enabled', badge: 12 },
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

  // GET /api/platform/products  (catalog for the marketplace)
  catalog: [
    { key: 'medical', name: 'Medical Clinics', group: 'Clinics', icon: 'medical', summary: 'Patients, appointments and clinical encounter packets.', price: '$39 / mo', cta: 'add' },
    { key: 'psychology', name: 'Psychology Clinics', group: 'Clinics', icon: 'psychology', summary: 'Therapists, sessions and review-first note drafts.', price: '$29 / mo', cta: 'add' },
    { key: 'accounting', name: 'Accounting', group: 'Finance', icon: 'accounting', summary: 'Chart of accounts, journals, ledgers and closeout.', price: 'Scale plan', cta: 'upgrade' },
    { key: 'tax-compliance-ec', name: 'Tax Compliance EC', group: 'Finance', icon: 'tax', summary: 'VAT, income tax & withholding readiness with accountant handoff.', price: 'Included', cta: 'open' }
  ],

  // GET /api/platform/plans
  plans: [
    { key: 'starter', name: 'Starter', price: '$19 / mo' },
    { key: 'growth', name: 'Growth', price: '$49 / mo', current: true },
    { key: 'scale', name: 'Scale', price: '$129 / mo' }
  ],

  // Environment + backend error example
  env: { label: 'Local / dev environment', apiBaseUrl: 'http://127.0.0.1:3000/api' },
  backendError: { title: 'Backend no disponible', message: 'No pudimos conectar con la API de la plataforma (GET /api/auth/me).', correlationId: 'req_3f7c1a9e' },

  // Dashboard sample content
  kpis: [
    { label: 'Facturas / mes', value: '142', delta: '+8%', tone: 'up', hint: 'vs. mayo' },
    { label: 'Por autorizar (SRI)', value: '7', delta: '3 nuevas', tone: 'neutral', hint: 'pendientes' },
    { label: 'Conversaciones', value: '38', delta: '+12', tone: 'up', hint: 'WhatsApp activas' },
    { label: 'IVA estimado', value: '$1,860', delta: 'período jun', tone: 'neutral', hint: 'borrador' }
  ],
  activity: [
    { who: 'Invoicing', what: 'Factura 001-001-000142 autorizada por el SRI', when: 'hace 12 min', tone: 'success', icon: 'invoicing' },
    { who: 'Growth', what: '3 conversaciones de WhatsApp esperan respuesta', when: 'hace 26 min', tone: 'warning', icon: 'growth' },
    { who: 'AI Console', what: 'Sugerencia preparada para revisión — invoice-document-assistant', when: 'hace 1 h', tone: 'info', icon: 'ai' },
    { who: 'Tax Compliance EC', what: 'Período IVA junio: 2 evidencias por revisar', when: 'hace 2 h', tone: 'neutral', icon: 'tax' }
  ],

  // AI assistant — copilot presence (suggestion / review, never autonomous)
  assistant: {
    greeting: 'Hola José — preparé algunas cosas para tu revisión.',
    disclaimer: 'El asistente sugiere y explica. No envía, firma ni declara nada sin tu aprobación.',
    suggestions: [
      { icon: 'invoicing', tone: 'info', title: '3 facturas listas para autorizar', body: 'Revisa el lote de junio antes de enviarlo al SRI.', action: 'Revisar lote' },
      { icon: 'tax', tone: 'warning', title: 'IVA de junio: faltan 2 evidencias', body: 'Te muestro qué comprobantes faltan antes de declarar.', action: 'Ver evidencias' },
      { icon: 'growth', tone: 'neutral', title: '3 conversaciones sin responder', body: 'Tengo borradores de respuesta listos para tu aprobación.', action: 'Abrir borradores' }
    ]
  },

  // Frontend-only — moods (no backend endpoint)
  moods: [
    { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
    { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
    { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
    { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
    { key: 'night', label: 'Night', desc: 'Low-glare dark' }
  ]
};
