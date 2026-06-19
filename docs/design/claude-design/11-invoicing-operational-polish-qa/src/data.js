/* Mock data for slice 11 — Invoicing Operational Polish QA.
   This slice is a COHERENCE + QA pass over the whole Invoicing frontend
   (slices 02/03/05–10). It does not add product behavior; it unifies the
   existing subviews into one polished workspace shell, maps the operator
   journey end to end, and ships an actionable audit Codex can land in small
   PRs.

   Backend is frozen. No endpoints, mutations, fields, delivery channels, tax
   filing, accounting posting, gateway or reconciliation are invented. Every
   subview and status reuses contracts already shaped in prior slices:
     InvoiceDetailResponse · InvoiceSettlement · ElectronicProfile ·
     ElectronicSignatureInspection · ElectronicSubmission · NumberingResponse.

   THREE INDEPENDENT TRUTHS (carried from slice 10, enforced everywhere):
     - SRI authorizes (Enviado ≠ Autorizado).
     - You deliver the comprobante.
     - The customer pays.
   The UI never lets one imply another.

   window.QA_DATA carries: shell context (reused), the lane SUBVIEWS, one
   SCENARIO per required state, the EXPERIENCE_MAP, the AUDIT findings + PR
   plan, and the MOBILE_QA checklist. */
(function () {
  var ACCESS_KEY = '1706202601179001234500110010010001480123456789';

  function money(cents) {
    var neg = cents < 0; var n = (Math.abs(cents) / 100).toFixed(2).split('.');
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + '$' + n.join('.');
  }

  /* The Invoicing lane — the seven operator subviews, in journey order.
     `slice` ties each back to the Claude Design package it was designed in. */
  var SUBVIEWS = [
    { key: 'summary',   name: 'Resumen',        icon: 'home',       slice: '02', blurb: 'Cartera, cola de facturas y un solo punto de partida.' },
    { key: 'settings',  name: 'Emisor · SRI',   icon: 'shield',     slice: '05', blurb: 'Perfil del emisor, firma, gateway y numeración.' },
    { key: 'customer',  name: 'Cliente',        icon: 'userCheck',  slice: '06', blurb: 'Identifica al cliente y abre el borrador.' },
    { key: 'items',     name: 'Ítems',          icon: 'listPlus',   slice: '07', blurb: 'Líneas, cantidades e IVA de la factura.' },
    { key: 'review',    name: 'Revisión',       icon: 'fileCheck',  slice: '08', blurb: 'Revisa el documento antes de emitir.' },
    { key: 'lifecycle', name: 'SRI',            icon: 'route',       slice: '09', blurb: 'Firma, envío y autorización electrónica.' },
    { key: 'closeout',  name: 'Entrega y cobro', icon: 'coins',     slice: '10', blurb: 'Entrega el comprobante y registra el pago.' }
  ];

  /* Truth vocabularies (shared with slice 10) ------------------------------ */
  var SRI = {
    not_started:        { tone: 'neutral', label: 'Sin configurar', icon: 'shieldAlert' },
    pending_submission: { tone: 'neutral', label: 'Pendiente',      icon: 'clock' },
    submitted:          { tone: 'warning', label: 'Enviado al SRI',  icon: 'refreshCw' },
    authorized:         { tone: 'success', label: 'Autorizado',     icon: 'shieldCheck' },
    rejected:           { tone: 'danger',  label: 'Devuelto',       icon: 'ban' }
  };
  var DELIV = {
    na:      { tone: 'neutral', label: 'No aplica', icon: 'mail' },
    pending: { tone: 'neutral', label: 'Sin enviar', icon: 'mail' },
    sent:    { tone: 'success', label: 'Enviado',   icon: 'checkCircle' }
  };
  var PAY = {
    na:      { tone: 'neutral', label: 'No aplica', icon: 'coins' },
    unpaid:  { tone: 'neutral', label: 'Sin pagos', icon: 'coins' },
    partial: { tone: 'info',    label: 'Pago parcial', icon: 'coins' },
    paid:    { tone: 'success', label: 'Pagada',    icon: 'checkCircle' }
  };

  /* Readiness pillars (slice 02/05) — green / amber / red dots. */
  function pillars(over) {
    var base = {
      emisor:     { tone: 'success', label: 'Perfil del emisor', note: 'RUC 1790012345001 · producción' },
      firma:      { tone: 'success', label: 'Firma electrónica', note: 'Vigente hasta 14 mar 2027' },
      gateway:    { tone: 'success', label: 'Envío / Gateway',   note: 'Conectado al SRI' },
      numeracion: { tone: 'success', label: 'Numeración',        note: '001-001 · siguiente 000149' }
    };
    return Object.assign(base, over || {});
  }

  var user = { name: 'José Quizá Manchuro', email: 'jose@acme-logistica.ec', role: 'owner' };
  var tenant = { name: 'Acme Logística S.A.', slug: 'acme-logistica', ruc: '1790012345001', role: 'Owner', environment: 'production' };

  /* Invoice context skeleton (the summary strip reads this). */
  function invoice(over) {
    return Object.assign({
      number: '001-001-000000148',
      buyerName: 'Comercial Andina S.A.',
      buyerEmail: 'cobranzas@comercialandina.ec',
      documentStatus: 'issued',   // draft | issued
      electronicStatus: 'authorized',
      totalInCents: 230100,
      paidInCents: 0,
      delivery: 'pending',        // na | pending | sent
      itemCount: 1
    }, over || {});
  }

  function payState(inv) {
    if (!inv || inv.documentStatus === 'draft') return 'na';
    if (inv.paidInCents <= 0) return 'unpaid';
    if (inv.paidInCents >= inv.totalInCents) return 'paid';
    return 'partial';
  }

  window.QA_DATA = {
    money: money,
    accessKeyDemo: ACCESS_KEY,
    SUBVIEWS: SUBVIEWS,
    SRI: SRI, DELIV: DELIV, PAY: PAY,
    user: user, tenant: tenant,
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
    moods: [
      { key: 'comfort', label: 'Comfort', desc: 'Balanced, corporate-friendly' },
      { key: 'focus', label: 'Focus', desc: 'Denser, stronger hierarchy' },
      { key: 'calm', label: 'Calm', desc: 'Softer, gentle contrast' },
      { key: 'high-contrast', label: 'High contrast', desc: 'Accessibility-first' },
      { key: 'night', label: 'Night', desc: 'Low-glare dark' }
    ],
    assistant: {
      greeting: 'Hola José — te ayudo a moverte por Invoicing sin perderte: dónde estás, qué sigue y qué está pendiente.',
      disclaimer: 'El asistente explica y sugiere. No envía al SRI, no declara impuestos, no contabiliza ni concilia sin tu aprobación.',
      suggestions: [
        { icon: 'route', tone: 'info', title: 'Un paso seguro a la vez', body: 'Te muestro la única acción recomendada según el estado de la factura. El resto queda secundario para no abrumarte.', action: 'Entendido' },
        { icon: 'layers', tone: 'info', title: 'Tres verdades separadas', body: 'SRI, entrega y pago son cosas distintas. Que envíes el correo no significa que el SRI la autorizó ni que está pagada.', action: 'Entendido' }
      ]
    },

    backendErrorInfo: {
      title: 'No pudimos cargar el espacio de Invoicing',
      message: 'No pudimos consultar el estado de tus facturas y la configuración del SRI (GET /api/invoicing/tenants/acme-logistica/...).',
      correlationId: 'req_e91b4470'
    },

    /* ------------------------------------------------------------------ *
     * SCENARIOS — one per required cross-subview state.                  *
     * Each defines the recommended subview, readiness, current invoice   *
     * context (the summary strip), the one recommended next step, and    *
     * the permission posture.                                            *
     * ------------------------------------------------------------------ */
    scenarios: {
      operating: {
        label: 'Configurado y operando',
        subview: 'summary',
        readiness: pillars(),
        portfolio: { porAutorizar: 2, autorizadasMes: 38, carteraMes: 4218000, porCobrar: 1130400 },
        invoice: null,
        next: { tone: 'primary', pill: 'Listo', icon: 'plus', title: 'Todo en orden — crea la próxima factura', desc: 'El emisor, la firma y el gateway están configurados. Cuando quieras, abre una nueva factura. Hay 2 documentos por autorizar en la cola.', primary: { label: 'Nueva factura', icon: 'plus' }, secondary: { label: 'Ver 2 por autorizar', to: 'lifecycle' } }
      },

      missing_setup: {
        label: 'Falta configurar el emisor / SRI',
        subview: 'settings',
        readiness: pillars({
          emisor: { tone: 'danger', label: 'Perfil del emisor', note: 'Sin completar — falta RUC y dirección' },
          firma:  { tone: 'warning', label: 'Firma electrónica', note: 'Sin certificado cargado' },
          gateway:{ tone: 'neutral', label: 'Envío / Gateway', note: 'Disponible al completar el perfil' }
        }),
        portfolio: null,
        invoice: null,
        blocker: 'Aún no puedes emitir facturas electrónicas: completa el perfil del emisor y carga la firma.',
        next: { tone: 'warning', pill: 'Empieza aquí', icon: 'shieldAlert', title: 'Configura el emisor para poder facturar', desc: 'Antes de crear facturas, el SRI necesita el perfil del emisor y una firma electrónica vigente. Es un paso único. Te guiamos campo por campo.', primary: { label: 'Configurar emisor', icon: 'arrowRight', to: 'settings' }, secondary: { label: 'Cargar firma', to: 'settings' } }
      },

      draft_in_progress: {
        label: 'Borrador en progreso',
        subview: 'items',
        readiness: pillars(),
        invoice: invoice({ number: 'Borrador · 001-001', documentStatus: 'draft', electronicStatus: 'pending_submission', delivery: 'na', totalInCents: 230100, itemCount: 2 }),
        next: { tone: 'info', pill: 'Borrador', icon: 'listPlus', title: 'Agrega los ítems y revisa el documento', desc: 'La factura para Comercial Andina sigue en borrador con 2 líneas. Completa los ítems y pasa a revisión para emitir. Todavía no se envía al SRI.', primary: { label: 'Continuar con ítems', icon: 'arrowRight', to: 'items' }, secondary: { label: 'Ir a revisión', to: 'review' } }
      },

      issued_pending_sri: {
        label: 'Emitida · SRI pendiente',
        subview: 'lifecycle',
        readiness: pillars(),
        invoice: invoice({ documentStatus: 'issued', electronicStatus: 'pending_submission', delivery: 'na' }),
        next: { tone: 'primary', pill: 'Listo para enviar', icon: 'send', title: 'Firma y envía la factura al SRI', desc: 'El documento ya está emitido y listo. Fírmalo y envíalo al SRI para iniciar la autorización. Enviar no es lo mismo que autorizado: la validez legal llega solo con la autorización.', primary: { label: 'Firmar y enviar al SRI', icon: 'send', to: 'lifecycle' }, secondary: { label: 'Ver XML', to: 'review' } }
      },

      submitted_pending: {
        label: 'Enviada · esperando autorización',
        subview: 'lifecycle',
        readiness: pillars(),
        invoice: invoice({ documentStatus: 'issued', electronicStatus: 'submitted', delivery: 'na' }),
        legalNote: 'Enviado NO significa autorizado — la validez legal llega solo con la autorización del SRI.',
        next: { tone: 'warning', pill: 'En seguimiento', icon: 'refreshCw', title: 'Consulta la autorización en el SRI', desc: 'El SRI recibió la factura y la está procesando. Consulta la autorización para saber si quedó autorizada. Aún no la entregues como válida.', primary: { label: 'Consultar autorización', icon: 'refreshCw', to: 'lifecycle' }, secondary: { label: 'Ver historial técnico', to: 'lifecycle' } }
      },

      authorized: {
        label: 'Autorizada por el SRI',
        subview: 'lifecycle',
        readiness: pillars(),
        invoice: invoice({ documentStatus: 'issued', electronicStatus: 'authorized', delivery: 'pending' }),
        next: { tone: 'success', pill: 'Autorizada', icon: 'shieldCheck', title: 'Autorizada — ahora entrégala al cliente', desc: 'El SRI autorizó la factura: ya es válida legalmente. El siguiente paso es entregar el comprobante al cliente. La autorización no implica que la haya recibido ni pagado.', primary: { label: 'Ir a entrega y cobro', icon: 'arrowRight', to: 'closeout' }, secondary: { label: 'Ver XML autorizado', to: 'lifecycle' } }
      },

      rejected: {
        label: 'Devuelta / rechazada por el SRI',
        subview: 'lifecycle',
        readiness: pillars(),
        invoice: invoice({ documentStatus: 'issued', electronicStatus: 'rejected', delivery: 'na' }),
        sriMessage: { code: '45', field: 'identificacionComprador', text: 'El RUC del comprador no es válido para el tipo de identificación 04. Corrige el dato y vuelve a enviar.' },
        next: { tone: 'danger', pill: 'Devuelta', icon: 'ban', title: 'Revisa la observación del SRI y reenvía', desc: 'El SRI devolvió la factura con una observación. Corrige el dato señalado en el documento y vuelve a enviarla. No está autorizada ni se puede entregar como válida.', primary: { label: 'Revisar observación', icon: 'arrowRight', to: 'lifecycle' }, secondary: { label: 'Corregir en el documento', to: 'review' } }
      },

      open_balance: {
        label: 'Autorizada · saldo abierto',
        subview: 'closeout',
        readiness: pillars(),
        invoice: invoice({ documentStatus: 'issued', electronicStatus: 'authorized', delivery: 'sent', paidInCents: 80000 }),
        next: { tone: 'info', pill: 'Saldo pendiente', icon: 'coins', title: 'Registra el pago del saldo restante', desc: 'Ya entregaste el comprobante y el cliente abonó parte. Queda ' + money(230100 - 80000) + ' por cobrar. Registra el pago cuando lo recibas — sin pensar en centavos.', primary: { label: 'Registrar pago', icon: 'coins', to: 'closeout' }, secondary: { label: 'Reenviar al cliente', to: 'closeout' } }
      },

      fully_paid: {
        label: 'Entregada y pagada',
        subview: 'closeout',
        readiness: pillars(),
        invoice: invoice({ documentStatus: 'issued', electronicStatus: 'authorized', delivery: 'sent', paidInCents: 230100 }),
        next: { tone: 'success', pill: 'Cierre completo', icon: 'checkCircle', title: 'Factura cerrada — nada pendiente', desc: 'Autorizada por el SRI, entregada al cliente y pagada en su totalidad. La evidencia queda lista para el futuro traspaso a Tax Compliance EC y Accounting. Aquí no declaramos impuestos ni registramos asientos.', primary: null, secondary: { label: 'Ver evidencia', to: 'closeout' } }
      },

      permission_limited: {
        label: 'Permiso limitado · solo lectura',
        subview: 'summary',
        readiness: pillars(),
        portfolio: { porAutorizar: 2, autorizadasMes: 38, carteraMes: 4218000, porCobrar: 1130400 },
        invoice: null,
        permission: { canManage: false, role: 'Viewer', missingPermission: 'invoicing.manage' },
        next: { tone: 'neutral', pill: 'Solo lectura', icon: 'lock', title: 'Puedes consultar, pero no emitir ni cobrar', desc: 'Tu rol Viewer ve la cartera, el estado del SRI y los pagos, pero no puede crear facturas, enviarlas al SRI ni registrar pagos. Pídele el permiso invoicing.manage al Owner.', primary: null, secondary: { label: 'Ver cartera', to: 'summary' } }
      },

      empty_workspace: {
        label: 'Espacio vacío · sin facturas',
        subview: 'summary',
        readiness: pillars(),
        portfolio: { porAutorizar: 0, autorizadasMes: 0, carteraMes: 0, porCobrar: 0 },
        invoice: null,
        empty: true,
        next: { tone: 'primary', pill: 'Empieza aquí', icon: 'plus', title: 'Crea tu primera factura electrónica', desc: 'El emisor y la firma ya están listos. Crea tu primera factura: elige el cliente, agrega los ítems y nosotros te guiamos hasta la autorización del SRI.', primary: { label: 'Nueva factura', icon: 'plus', to: 'customer' }, secondary: { label: 'Revisar configuración SRI', to: 'settings' } }
      },

      loading: { label: 'Cargando', subview: 'summary', loading: true },
      backend_unavailable: { label: 'Backend no disponible', subview: 'summary', backendError: true }
    },

    /* ------------------------------------------------------------------ *
     * EXPERIENCE MAP — Command Center → … → Closeout.                    *
     * Each stage: where the operator is, the one safe next action, and   *
     * the coherence rule the UI must honor at that step.                 *
     * ------------------------------------------------------------------ */
    experienceMap: {
      intro: 'Cómo debe moverse un operador por Invoicing: contexto que nunca desaparece, una sola acción segura por paso, y la verdad legal siempre explícita.',
      stages: [
        { key: 'command', name: 'Command Center', sub: 'Plataforma', slice: '01', icon: 'dashboard', where: 'El operador ve sus productos activos y entra a Invoicing desde un tile.', action: 'Abrir Invoicing', rule: 'El shell de plataforma (sidebar, tenant, mood) nunca desaparece dentro del producto.', state: 'operating' },
        { key: 'settings', name: 'Configurar SRI', sub: 'Emisor · Firma', slice: '05', icon: 'shield', where: 'Solo la primera vez: perfil del emisor, firma, gateway y numeración.', action: 'Completar emisor', rule: 'Si falta configuración, este es el único punto de partida — no se ofrece "Nueva factura".', state: 'missing_setup' },
        { key: 'customer', name: 'Cliente / Borrador', sub: 'Abrir documento', slice: '06', icon: 'userCheck', where: 'Identifica al cliente (RUC/cédula) y abre un borrador.', action: 'Crear borrador', rule: 'Reutiliza clientes existentes; no obligues a re-capturar datos.', state: 'draft_in_progress' },
        { key: 'items', name: 'Ítems', sub: 'Líneas e IVA', slice: '07', icon: 'listPlus', where: 'Agrega líneas, cantidades e IVA hasta cuadrar el total.', action: 'Revisar documento', rule: 'El total y el IVA se calculan a la vista; el operador nunca suma a mano.', state: 'draft_in_progress' },
        { key: 'review', name: 'Revisión', sub: 'Antes de emitir', slice: '08', icon: 'fileCheck', where: 'Revisa el documento (RIDE) y lo emite.', action: 'Emitir', rule: 'Separa estado del documento (borrador/emitido) del estado electrónico.', state: 'issued_pending_sri' },
        { key: 'lifecycle', name: 'Lifecycle SRI', sub: 'Firma · Envío · Autorización', slice: '09', icon: 'route', where: 'Firma, envía y consulta autorización en el SRI.', action: 'Firmar y enviar · Consultar', rule: 'Enviado ≠ Autorizado. Solo el backend confirma la validez legal.', state: 'submitted_pending' },
        { key: 'closeout', name: 'Entrega y cobro', sub: 'Cierre', slice: '10', icon: 'coins', where: 'Entrega el comprobante, registra el pago y deja evidencia.', action: 'Entregar · Registrar pago', rule: 'SRI, entrega y pago son tres verdades independientes.', state: 'open_balance' }
      ]
    },

    /* ------------------------------------------------------------------ *
     * VISUAL COHERENCE AUDIT — actionable for Codex.                     *
     * severity: usability | mobile | cosmetic                            *
     * match:    partial | mismatch | ok                                  *
     * Each names the exact component/region and the precise fix.         *
     * ------------------------------------------------------------------ */
    audit: {
      summary: { total: 14, usability: 6, mobile: 4, cosmetic: 4 },
      regions: [
        {
          region: 'Shell ↔ Product workspace', component: 'app.tsx · app.module.css',
          findings: [
            { id: 'A1', severity: 'usability', match: 'partial', problem: 'El workspace de Invoicing repite un encabezado propio dentro del shell, duplicando el título "Invoicing" del top bar y empujando el contenido hacia abajo.', fix: 'Eliminar el <h1> duplicado del workspace; dejar solo el breadcrumb del top bar + un product header de una línea con la acción primaria a la derecha.', pr: 1 },
            { id: 'A2', severity: 'cosmetic', match: 'mismatch', problem: 'El <main> usa un max-width distinto por subview (algunas a 1200px, otras a full-bleed), rompiendo el ritmo entre secciones.', fix: 'Fijar un contenedor único de 1040px con var(--gutter) en todas las subviews (igual que slices 08–10).', pr: 1 }
          ]
        },
        {
          region: 'Subview navigation', component: 'workspace-documents.tsx · workspace-commercial.tsx',
          findings: [
            { id: 'A3', severity: 'usability', match: 'mismatch', problem: 'Las subvistas se cambian con enlaces sueltos sin estado activo claro; el operador pierde dónde está en el flujo.', fix: 'Reemplazar por una tira de subview-nav con riel de acento de 3px en la activa (patrón NavItem), en orden de journey: Resumen · Emisor · Cliente · Ítems · Revisión · SRI · Entrega.', pr: 2 },
            { id: 'A4', severity: 'usability', match: 'partial', problem: 'No hay tira de contexto: al entrar a "Entrega" no se ve a qué factura corresponde ni su estado SRI.', fix: 'Añadir un context summary strip persistente (número mono · cliente · total + tríada SRI/Entrega/Pago) sobre la subvista activa.', pr: 2 }
          ]
        },
        {
          region: 'Status & action hierarchy', component: 'closeout.ts · InvoicingElectronicStatusPanel',
          findings: [
            { id: 'A5', severity: 'usability', match: 'mismatch', problem: 'Acciones destructivas y secundarias (Revertir pago, Intervención manual) se renderizan como botones primary, compitiendo con la acción recomendada.', fix: 'Bajar a variant="ghost"/"secondary"; reservar primary para el único "siguiente paso recomendado".', pr: 4 },
            { id: 'A6', severity: 'usability', match: 'partial', problem: 'El estado "submitted" usa un pill verde que se lee como autorizado.', fix: 'Forzar tone="warning" + etiqueta "Enviado al SRI" para submitted; verde solo en authorized confirmado por backend.', pr: 4 },
            { id: 'A7', severity: 'cosmetic', match: 'mismatch', problem: 'Los status pills usan tamaños y radios variados entre paneles.', fix: 'Unificar al componente StatusPill (radius-pill, text-2xs, dot opcional); ningún pill custom inline.', pr: 4 }
          ]
        },
        {
          region: 'SRI Lifecycle', component: 'workspace-electronic.tsx · InvoicingTechnicalTracePanel',
          findings: [
            { id: 'A8', severity: 'usability', match: 'mismatch', problem: 'El historial técnico (eventos + sriDiagnostics) aparece expandido y arriba, dominando una pantalla que debería liderar con la verdad legal.', fix: 'Colapsar el trace en un disclosure secundario al final; liderar con verdict header + stepper + un solo next step.', pr: 4 },
            { id: 'A9', severity: 'cosmetic', match: 'partial', problem: 'La clave de acceso y el nº de autorización no usan IBM Plex Mono y no son copy-friendly.', fix: 'Aplicar var(--font-mono) y un botón copiar; mono reservado a datos técnicos (clave, RUC, XML).', pr: 4 }
          ]
        },
        {
          region: 'Mobile', component: 'app.module.css (responsive) · todas las subvistas',
          findings: [
            { id: 'M1', severity: 'mobile', match: 'mismatch', problem: 'La tríada de cierre (SRI · Entrega · Pago) se muestra en 3 columnas en móvil y se aplasta / desborda horizontalmente.', fix: 'Reducir la grilla de 3 columnas a 1 (apiladas) por debajo de 480px; cada verdad ocupa una fila completa.', pr: 3 },
            { id: 'M2', severity: 'mobile', match: 'mismatch', problem: 'La cola de facturas usa una tabla con scroll horizontal en móvil.', fix: 'Sustituir la tabla por tarjetas de una columna (número · cliente · total · pill); eliminar el overflow horizontal.', pr: 3 },
            { id: 'M3', severity: 'mobile', match: 'partial', problem: 'Los pasos recomendados largos no envuelven y empujan el botón fuera de la pantalla.', fix: 'Aplicar text-wrap a la descripción y fijar la acción primaria al fondo (thumb-reach), no en línea.', pr: 3 },
            { id: 'M4', severity: 'mobile', match: 'partial', problem: 'La barra de subvistas no cabe; los tabs se cortan a la derecha.', fix: 'En móvil, mover la navegación de subvistas a las bottom tabs del shell (Resumen · Facturas · SRI · Más) y un selector compacto para el resto.', pr: 3 }
          ]
        },
        {
          region: 'Moods', component: 'tokens/moods.css (uso)',
          findings: [
            { id: 'C1', severity: 'cosmetic', match: 'partial', problem: 'Algunas tarjetas del workspace usan sombras y fondos hard-coded que no responden al mood (high-contrast sigue mostrando sombra).', fix: 'Cambiar a var(--surface)/var(--border)/var(--shadow-sm); en high-contrast la sombra ya resuelve a none.', pr: 1 },
            { id: 'C2', severity: 'usability', match: 'partial', problem: 'El selector de mood vive en una pantalla de ajustes aparte; el operador no lo descubre.', fix: 'Mover el selector de mood al top bar del shell (icono sliders), consistente con slices 00/02–10.', pr: 2 }
          ]
        }
      ],
      prPlan: [
        { n: 1, title: 'Shell / workspace layout polish', scope: 'Quitar header duplicado, fijar contenedor 1040px, tokens de mood en tarjetas.', findings: ['A1', 'A2', 'C1'], risk: 'low' },
        { n: 2, title: 'Subview navigation + context strip', scope: 'Subview-nav con estado activo, context summary strip persistente, mood en top bar.', findings: ['A3', 'A4', 'C2'], risk: 'medium' },
        { n: 3, title: 'Responsive / mobile fixes', scope: 'Tríada y cola a 1 columna, pasos que envuelven, acción al fondo, subvistas en bottom tabs.', findings: ['M1', 'M2', 'M3', 'M4'], risk: 'medium' },
        { n: 4, title: 'Status / action hierarchy cleanup', scope: 'Pills unificados, destructivas a secundario, "enviado" en ámbar, trace colapsado, mono en datos.', findings: ['A5', 'A6', 'A7', 'A8', 'A9'], risk: 'low' },
        { n: 5, title: 'Vercel QA runbook update', scope: 'Re-correr el runbook (doc 10) en los 5 moods × desktop/móvil tras integrar 1–4.', findings: [], risk: 'low' }
      ]
    },

    /* ------------------------------------------------------------------ *
     * MOBILE-FIRST QA CHECKLIST — verifiable pass/fail items.            *
     * ------------------------------------------------------------------ */
    mobileQa: [
      { id: 'Q1', text: 'Sin desbordamiento horizontal en ninguna subvista', status: 'pass' },
      { id: 'Q2', text: 'La navegación inferior / tabs de producto siguen usables', status: 'pass' },
      { id: 'Q3', text: 'La tríada de cierre se apila limpio (1 columna)', status: 'pass' },
      { id: 'Q4', text: 'Los pasos recomendados largos envuelven', status: 'pass' },
      { id: 'Q5', text: 'Los status pills no aplastan el contenido', status: 'pass' },
      { id: 'Q6', text: 'La acción primaria queda al alcance del pulgar', status: 'pass' },
      { id: 'Q7', text: 'Las trazas técnicas no están al frente', status: 'pass' }
    ]
  };

  /* expose a small helper used by panels */
  window.QA_DATA.payState = payState;
})();
