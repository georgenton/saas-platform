/* Mock data for slice 04 — Access / Login Gateway. The signed-out entry that
   precedes the Platform Shell (slice 00) and Command Center (slice 01).

   Backend truth (docs/frontend-handoff/00-access-login-gateway.md): the API
   exposes session inspection, current-tenancy selection and invitation
   accept/detail — but NO public web credential login (email/password, magic
   link, SSO, reset). Those appear only as non-interactive future structure.

   window.ACCESS_DATA carries brand/trust context + the session scenarios the
   gateway resolves into. Shapes mirror the real endpoints; harden against
   openapi.json on integration. */
window.ACCESS_DATA = {
  product: {
    name: 'SaaS Platform',
    tagline: 'La plataforma operativa para tu empresa en Ecuador',
    lede: 'Facturación electrónica, contabilidad y operaciones — en un solo lugar, listo para el SRI.',
    region: 'Ecuador · LATAM'
  },

  /* Non-interactive context only — "what kind of work the platform supports".
     NOT clickable products; this is trust/orientation, not a marketplace. */
  capabilities: [
    { icon: 'invoicing', label: 'Facturación electrónica SRI' },
    { icon: 'accounting', label: 'Contabilidad' },
    { icon: 'tax', label: 'Tax Compliance EC' },
    { icon: 'ecommerce', label: 'Ecommerce' },
    { icon: 'growth', label: 'Growth · WhatsApp' },
    { icon: 'medical', label: 'Clínicas' }
  ],

  /* Future auth providers — rendered as structure ONLY (disabled, "Próximamente").
     The backend exposes no credential submit, magic link or SSO today. */
  futureMethods: [
    { key: 'email', icon: 'mail', label: 'Continuar con correo electrónico' },
    { key: 'magic', icon: 'zap', label: 'Enviar enlace de acceso' },
    { key: 'sso', icon: 'globe', label: 'Inicio de sesión SSO corporativo' }
  ],

  /* GET /api/auth/me — the session the gateway inspects.
     currentTenancy present → hand off to Command Center. */
  session: {
    user: { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec' },
    currentTenancy: {
      slug: 'acme-logistica', name: 'Acme Logística S.A.', ruc: '1790012345001',
      role: 'Owner', environment: 'production', members: 6
    }
  },

  /* Session with several memberships and NO current tenancy → workspace picker.
     (GET /api/auth/me → tenancies[]; PUT /api/auth/me/current-tenancy to choose.) */
  tenancies: [
    { slug: 'acme-logistica', name: 'Acme Logística S.A.', ruc: '1790012345001', role: 'Owner', environment: 'production', members: 6, products: 7 },
    { slug: 'andes-salud', name: 'Andes Salud', ruc: '1791112223001', role: 'Operator', environment: 'production', members: 12, products: 4 },
    { slug: 'costa-verde', name: 'Importadora Costa Verde', ruc: '0990012345001', role: 'Contador', environment: 'staging', members: 3, products: 2 }
  ],

  /* GET /api/auth/invitations/{invitationId} — pending invitation review.
     POST /api/auth/invitations/{invitationId}/accept to join. */
  invitation: {
    id: 'inv_2f9c41',
    tenantName: 'Andes Salud',
    tenantRuc: '1791112223001',
    role: 'Operator',
    invitedByName: 'María Fernanda Cobos',
    invitedByEmail: 'mf.cobos@andes-salud.ec',
    email: 'jose@acme-logistica.ec',
    expiresAt: '20 jun 2026',
    expiresInLabel: 'en 4 días'
  },

  /* Session resolved but no tenant available — explain what's missing,
     never dump the full product shell. */
  noTenant: {
    title: 'Tu sesión está activa, pero aún no perteneces a un espacio de trabajo',
    body: 'Necesitas una invitación de una empresa o crear un nuevo espacio para empezar. Pídele al Owner que te invite con este correo.',
    email: 'jose@acme-logistica.ec'
  },

  backendError: {
    title: 'No pudimos verificar tu sesión',
    message: 'No pudimos conectar con el servicio de identidad (GET /api/auth/me). Revisa tu conexión e inténtalo de nuevo.',
    correlationId: 'req_8c41ad20'
  },

  tokenError: {
    title: 'Ese token no es válido o expiró',
    message: 'El token de acceso avanzado no pudo verificarse contra GET /api/auth/me. Pega un token vigente o usa el acceso normal.',
    code: '401 · token_invalid'
  },

  env: { label: 'Entorno local / dev', apiBaseUrl: 'http://127.0.0.1:3000/api' },

  moods: [
    { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
    { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
    { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
    { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
    { key: 'night', label: 'Night', desc: 'Low-glare dark' }
  ]
};
