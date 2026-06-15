/* Product Command Center — inlined mock data so the prototype runs standalone.
   Mirrors ./mock-data/*.json (one block per endpoint). In production, replace
   CC_DATA with fetches to the endpoints noted on each block — see
   integration-plan.md. The Command Center is COMPOSED from these tenancy
   endpoints; per-product readiness signals come from each product's own summary
   surface (documented as a contract to harden, or an optional BFF aggregate
   GET /api/tenancy/tenants/{slug}/command-center). */
window.CC_DATA = {
  // GET /api/auth/me
  user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' },

  // GET /api/tenancy/tenants/{slug}  (tenant summary)
  tenant: {
    name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001',
    role: 'Owner', environment: 'production', environmentLabel: 'Producción',
    members: 6, since: '2024'
  },
  memberships: [
    { name: 'Acme Logística S.A.', slug: 'acme-logistica', role: 'Owner' },
    { name: 'Andes Salud', slug: 'andes-salud', role: 'Operator' }
  ],

  // GET /api/tenancy/tenants/{slug}/subscription
  subscription: {
    planKey: 'growth', planName: 'Growth', status: 'active',
    priceDisplay: '$49 / mes', renewsAt: '14 jul 2026', seats: { used: 6, included: 10 }
  },

  // GET /api/platform/plans
  plans: [
    { key: 'starter', name: 'Starter', price: '$19 / mes' },
    { key: 'growth', name: 'Growth', price: '$49 / mes', current: true },
    { key: 'scale', name: 'Scale', price: '$129 / mes' }
  ],

  /* Derived from /products + /entitlements + permissions — the access model the
     workspace makes explicit. Counts drive the overview card + legend. */
  accessOverview: {
    total: 8,
    counts: [
      { state: 'enabled', label: 'Activos', value: 3, tone: 'success' },
      { state: 'permission_limited', label: 'Permiso limitado', value: 2, tone: 'warning' },
      { state: 'blocked_by_plan', label: 'Requiere plan', value: 1, tone: 'info' },
      { state: 'available', label: 'Disponibles', value: 1, tone: 'primary' },
      { state: 'disabled', label: 'No habilitados', value: 1, tone: 'neutral' }
    ]
  },

  // Domain grouping (operational, not alphabetical)
  domains: [
    { key: 'finance', name: 'Finanzas y Cumplimiento', short: 'Finanzas', icon: 'invoicing' },
    { key: 'commerce', name: 'Crecimiento y Comercio', short: 'Comercio', icon: 'growth' },
    { key: 'ai', name: 'IA y Automatización', short: 'IA', icon: 'ai' },
    { key: 'clinics', name: 'Clínicas', short: 'Clínicas', icon: 'medical' }
  ],

  /* GET /api/tenancy/tenants/{slug}/products  (+ per-product summary surfaces).
     accessState ∈ enabled | permission_limited | blocked_by_plan | available | disabled
     readiness[].tone ∈ success | warning | neutral
     Each card: purpose · accessState · evidence (last known activity/source) ·
     readiness indicators · blocker (when access is constrained) · actions. */
  products: [
    {
      key: 'invoicing', name: 'Electronic Invoicing EC', domain: 'finance', icon: 'invoicing',
      accessState: 'enabled', route: '/invoicing',
      purpose: 'Emisión electrónica SRI: factura, NC/ND, guía y retención.',
      evidence: { label: 'Factura 001-001-000142 autorizada', source: 'SRI · ambiente producción', when: 'hace 12 min', mono: '001-001-000142' },
      readiness: [
        { label: 'Emisor', value: 'Habilitado', tone: 'success' },
        { label: 'Modo SRI', value: 'Producción', tone: 'success' },
        { label: 'Por autorizar', value: '7', tone: 'warning' }
      ],
      primary: { label: 'Entrar', action: 'enter' },
      secondary: { label: 'Ver evidencia', action: 'evidence' }
    },
    {
      key: 'tax-compliance-ec', name: 'Tax Compliance EC', domain: 'finance', icon: 'tax',
      accessState: 'permission_limited', route: '/tax-compliance-ec',
      purpose: 'Prepara IVA, renta y retenciones; explica y entrega al contador.',
      evidence: { label: '2 evidencias por revisar', source: 'Período fiscal junio 2026', when: 'hace 2 h' },
      readiness: [
        { label: 'Período', value: 'IVA junio', tone: 'neutral' },
        { label: 'Evidencias', value: '8 / 10', tone: 'warning' },
        { label: 'Revisión contador', value: 'Pendiente', tone: 'warning' }
      ],
      blocker: { tone: 'warning', text: 'Solo lectura — necesitas el permiso tax.manage para editar declaraciones.' },
      primary: { label: 'Entrar (solo lectura)', action: 'enter' },
      secondary: { label: 'Solicitar tax.manage', action: 'request-permission' }
    },
    {
      key: 'accounting', name: 'Full Accounting', domain: 'finance', icon: 'accounting',
      accessState: 'blocked_by_plan', route: '/accounting', requiresPlan: 'scale',
      purpose: 'Libros formales, conciliación y cierre con límite del contador.',
      includes: ['Cierre contable mensual', 'Conciliación bancaria', 'Límite y handoff al contador'],
      blocker: { tone: 'info', text: 'Incluido en el plan Scale. Tu plan actual es Growth.' },
      primary: { label: 'Ver plan Scale', action: 'upgrade' },
      secondary: { label: 'Comparar planes', action: 'compare-plans' }
    },
    {
      key: 'growth', name: 'Growth', domain: 'commerce', icon: 'growth',
      accessState: 'enabled', route: '/growth',
      purpose: 'Conversaciones de WhatsApp, captación y CRM ligero.',
      evidence: { label: '3 conversaciones esperan respuesta', source: 'WhatsApp Business', when: 'hace 26 min' },
      readiness: [
        { label: 'WhatsApp', value: 'Conectado', tone: 'success' },
        { label: 'Conversaciones abiertas', value: '3', tone: 'warning' },
        { label: 'Casos sin asignar', value: '1', tone: 'neutral' }
      ],
      primary: { label: 'Entrar', action: 'enter' },
      secondary: { label: 'Invitar equipo', action: 'invite' }
    },
    {
      key: 'ecommerce', name: 'Ecommerce', domain: 'commerce', icon: 'ecommerce',
      accessState: 'enabled', route: '/ecommerce',
      purpose: 'Catálogo, tienda, pedidos y operación post-venta.',
      evidence: { label: '5 pedidos listos para facturar', source: 'Handoff a Invoicing', when: 'hace 40 min' },
      readiness: [
        { label: 'Tienda', value: 'Publicada', tone: 'success' },
        { label: 'Pedidos por procesar', value: '5', tone: 'warning' },
        { label: 'Handoff a facturación', value: 'Activo', tone: 'success' }
      ],
      primary: { label: 'Entrar', action: 'enter' },
      secondary: { label: 'Ver pedidos', action: 'orders' }
    },
    {
      key: 'ai-console', name: 'AI Console', domain: 'ai', icon: 'ai',
      accessState: 'permission_limited', route: '/ai-console',
      purpose: 'Sugerir, aprobar y ejecutar con guardas. Nunca actúa solo.',
      evidence: { label: 'Sugerencia preparada para revisión', source: 'invoice-document-assistant', when: 'hace 1 h' },
      readiness: [
        { label: 'Aprobaciones pendientes', value: '2', tone: 'warning' },
        { label: 'Ejecución protegida', value: 'Activa', tone: 'success' },
        { label: 'Asistente', value: 'Listo', tone: 'success' }
      ],
      blocker: { tone: 'warning', text: 'Puedes ver sugerencias; aprobar y ejecutar está restringido para tu rol.' },
      primary: { label: 'Entrar', action: 'enter' },
      secondary: { label: 'Solicitar aprobaciones', action: 'request-permission' }
    },
    {
      key: 'medical', name: 'Medical Clinics', domain: 'clinics', icon: 'medical',
      accessState: 'available', route: '/medical', addonPrice: '$39 / mes',
      purpose: 'Pacientes, citas y paquetes de encuentro clínico.',
      includes: ['Pacientes y citas', 'Paquetes de encuentro clínico', 'Agenda y expedientes'],
      blocker: { tone: 'primary', text: 'Disponible como add-on. Se activa como módulo independiente.' },
      primary: { label: 'Activar add-on', action: 'add' },
      secondary: { label: 'Ver detalle', action: 'detail' }
    },
    {
      key: 'psychology', name: 'Psychology Clinics', domain: 'clinics', icon: 'psychology',
      accessState: 'disabled', route: '/psychology', addonPrice: '$29 / mes',
      purpose: 'Terapeutas, sesiones y notas con revisión previa.',
      includes: ['Terapeutas y sesiones', 'Notas con revisión previa', 'Agenda y expedientes'],
      blocker: { tone: 'neutral', text: 'No habilitado para esta empresa. Visible para que sepas que existe.' },
      primary: { label: 'Ver en Marketplace', action: 'marketplace' },
      secondary: null
    }
  ],

  // Environment + backend error example (GET /api/tenancy/tenants/{slug}/environment)
  env: { label: 'Local / dev environment', apiBaseUrl: 'http://127.0.0.1:3000/api' },
  backendError: {
    title: 'No pudimos cargar tu espacio de trabajo',
    message: 'No hubo respuesta de la API de la plataforma (GET /api/tenancy/tenants/acme-logistica/products).',
    correlationId: 'req_3f7c1a9e'
  },

  // Empty workspace (new tenant, nothing activated yet)
  empty: {
    title: 'Tu espacio de trabajo está listo para crecer',
    message: 'Aún no has activado productos. La plataforma es modular: agrega Facturación, Tax, Growth, Clínicas y más como módulos, según tu plan y permisos.'
  },

  // AI assistant — copilot presence (suggestion / review, never autonomous)
  assistant: {
    greeting: 'Hola José — preparé algunas cosas para tu revisión.',
    disclaimer: 'El asistente sugiere y explica. No envía, firma ni declara nada sin tu aprobación.',
    suggestions: [
      { icon: 'invoicing', tone: 'info', title: '7 facturas por autorizar', body: 'Revisa el lote de junio antes de enviarlo al SRI.', action: 'Revisar lote' },
      { icon: 'tax', tone: 'warning', title: 'IVA de junio: faltan 2 evidencias', body: 'Te muestro qué comprobantes faltan antes de declarar.', action: 'Ver evidencias' },
      { icon: 'growth', tone: 'neutral', title: '3 conversaciones sin responder', body: 'Tengo borradores de respuesta listos para tu aprobación.', action: 'Abrir borradores' }
    ]
  },

  // Sidebar product nav (the shell chrome — mirrors the platform-shell kit)
  nav: [
    { key: 'command-center', name: 'Command Center', group: 'Core', icon: 'home', state: 'enabled' },
    { key: 'dashboard', name: 'Dashboard', group: 'Core', icon: 'dashboard', state: 'enabled' },
    { key: 'invoicing', name: 'Invoicing', group: 'Finance', icon: 'invoicing', state: 'enabled', badge: 7 },
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

  // Frontend-only — moods (no backend endpoint)
  moods: [
    { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
    { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
    { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
    { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
    { key: 'night', label: 'Night', desc: 'Low-glare dark' }
  ]
};
