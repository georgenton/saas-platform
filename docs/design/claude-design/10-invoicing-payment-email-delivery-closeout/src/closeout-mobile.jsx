/* Mobile — Invoicing Payment + Email Delivery Closeout (slice 10). Purpose-built,
   not a shrunk desk: a fixed legal/closeout verdict with the saldo always
   visible at top, a compact three-truth triad, one thumb-friendly primary
   action pinned at the bottom, and delivery / payment / reverse behind bottom
   sheets. Payment history reads as cards, never a tiny table. Reversal is a
   secondary, clearly exceptional path. window.MobileCloseout. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var Chrome = window.Chrome;
  var MobileTopBar = Chrome.MobileTopBar, BottomTabs = Chrome.BottomTabs, Sheet = Chrome.Sheet;
  var D = window.CLOSEOUT_DATA;
  var C = window.Closeout;
  var fmtMoney = C.fmtMoney, fmtDateTime = C.fmtDateTime, methodLabel = C.methodLabel,
      deliveryStatus = C.deliveryStatus, paymentStatus = C.paymentStatus,
      deriveVerdict = C.deriveVerdict, deriveNextStep = C.deriveNextStep,
      SRI = C.SRI, DELIV = C.DELIV, PAY = C.PAY;

  function field(label, node) { return React.createElement('label', { style: { display: 'grid', gap: 6 } }, React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, label), node); }
  function inStyle(d) { return { height: 44, padding: '0 12px', background: d ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--text-body)', color: 'var(--text-strong)', outline: 'none', width: '100%', boxSizing: 'border-box' }; }

  function MTriadCell(props) {
    var meta = props.meta;
    return React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'grid', gap: 4, justifyItems: 'center', textAlign: 'center', padding: '10px 6px' } },
      React.createElement('span', { style: { width: 30, height: 30, borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + meta.tone + '-soft)', color: 'var(--' + (meta.tone === 'neutral' ? 'text-subtle' : meta.tone) + ')' } }, I({ name: meta.icon, size: 15 })),
      React.createElement('span', { style: { fontSize: 9, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.kicker),
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.2 } }, meta.label));
  }

  /* ---- delivery sheet ---- */
  function DeliverySheet(props) {
    var s = props.s; var inv = s.invoice;
    var ds = useState(s.delivery); var d = ds[0], setDRaw = ds[1];
    function setD(k, v) { var o = {}; o[k] = v; setDRaw(Object.assign({}, d, o)); }
    var dStatus = deliveryStatus(s);
    var disabled = !s.permission.canManage || !d.recipientEmail || dStatus === 'sending';
    return React.createElement('div', { style: { display: 'grid', gap: 13, paddingBottom: 4 } },
      dStatus === 'sent' && React.createElement('div', { style: { display: 'flex', gap: 9, padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--success-soft)', color: 'var(--on-success-soft)' } },
        React.createElement('span', { style: { color: 'var(--success)', flex: 'none', display: 'inline-flex' } }, I({ name: 'checkCircle', size: 16 })),
        React.createElement('span', { style: { fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, 'Enviado a ', React.createElement('strong', null, d.recipientEmail), ' · ', fmtDateTime(s.delivery.lastSentAt))),
      dStatus === 'error' && React.createElement('div', { style: { padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)' } },
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' } }, 'No se envió'),
        React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, s.delivery.error)),
      field('Correo del destinatario', React.createElement('input', { type: 'email', value: d.recipientEmail, disabled: !s.permission.canManage, placeholder: 'correo@cliente.ec', onChange: function (e) { setD('recipientEmail', e.target.value); }, style: inStyle(!s.permission.canManage) })),
      field('Mensaje (opcional)', React.createElement('textarea', { value: d.message, disabled: !s.permission.canManage, rows: 3, placeholder: 'Nota para el cliente.', onChange: function (e) { setD('message', e.target.value); }, style: Object.assign(inStyle(!s.permission.canManage), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }) })),
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.5 } }, 'El envío entrega el comprobante. No cambia el SRI ni registra el pago.'),
      React.createElement(Btn, { variant: 'primary', full: true, leading: dStatus === 'sending' ? null : 'send', disabled: disabled }, dStatus === 'sending' ? 'Enviando…' : dStatus === 'sent' ? 'Reenviar al cliente' : 'Enviar al cliente'));
  }

  /* ---- payment sheet ---- */
  function PaymentSheet(props) {
    var s = props.s; var inv = s.invoice; var st = inv.settlement;
    var fs = useState(s.paymentForm); var f = fs[0], setFRaw = fs[1];
    function setF(k, v) { var o = {}; o[k] = v; setFRaw(Object.assign({}, f, o)); }
    var loading = s.actionLoading === 'create-invoice-payment';
    var disabled = !s.permission.canManage;
    return React.createElement('div', { style: { display: 'grid', gap: 13, paddingBottom: 4 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)' } },
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-subtle)' } }, 'Saldo pendiente'),
        React.createElement('span', { style: { fontSize: 'var(--text-h2)', fontWeight: 800, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, fmtMoney(st.balanceDueInCents, inv.currency))),
      s.paymentError && React.createElement('div', { style: { padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)' } },
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' } }, 'No se registró'),
        React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, s.paymentError)),
      field('Monto', React.createElement('div', { style: { display: 'flex', alignItems: 'center', height: 48, padding: '0 12px', background: disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' } },
        React.createElement('span', { style: { color: 'var(--text-muted)', fontWeight: 700, marginRight: 6, fontSize: 'var(--text-h3)' } }, '$'),
        React.createElement('input', { inputMode: 'decimal', value: f.amount, disabled: disabled, placeholder: '0.00', onChange: function (e) { setF('amount', e.target.value); }, style: { flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 'var(--text-h2)', fontWeight: 800, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontWeight: 600 } }, inv.currency))),
      React.createElement('button', { type: 'button', className: 'ds-focusable', disabled: disabled, onClick: function () { setF('amount', (st.balanceDueInCents / 100).toFixed(2)); }, style: { justifySelf: 'start', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: 'var(--surface-sunken)', color: 'var(--text)', fontSize: 'var(--text-2xs)', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer' } }, 'Usar saldo total · ' + fmtMoney(st.balanceDueInCents, inv.currency)),
      field('Método', React.createElement('select', { value: f.method, disabled: disabled, onChange: function (e) { setF('method', e.target.value); }, style: inStyle(disabled) }, D.methods.map(function (m) { return React.createElement('option', { key: m.value, value: m.value }, m.label); }))),
      field('Referencia (opcional)', React.createElement('input', { value: f.reference, disabled: disabled, placeholder: 'No. transferencia / recibo', onChange: function (e) { setF('reference', e.target.value); }, style: inStyle(disabled) })),
      field('Fecha de pago', React.createElement('input', { type: 'datetime-local', value: f.paidAt, disabled: disabled, onChange: function (e) { setF('paidAt', e.target.value); }, style: inStyle(disabled) })),
      field('Notas (opcional)', React.createElement('textarea', { value: f.notes, disabled: disabled, rows: 2, placeholder: 'Detalle interno.', onChange: function (e) { setF('notes', e.target.value); }, style: Object.assign(inStyle(disabled), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }) })),
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', lineHeight: 1.5 } }, 'Actualiza el saldo. No genera asientos contables ni concilia con el banco.'),
      React.createElement(Btn, { variant: 'primary', full: true, leading: loading ? null : 'plus', disabled: disabled || loading }, loading ? 'Registrando…' : 'Registrar pago'));
  }

  /* ---- history sheet ---- */
  function HistorySheet(props) {
    var s = props.s; var canManage = s.permission.canManage; var payments = s.invoice.payments || [];
    if (!payments.length) return React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' } }, 'Aún no hay pagos registrados.');
    return React.createElement('div', { style: { display: 'grid', gap: 10, paddingBottom: 4 } },
      payments.map(function (p) {
        var reversed = p.status === 'reversed';
        var reverseLoading = s.actionLoading === 'reverse-invoice-payment' && s.reverseTargetId === p.id;
        return React.createElement('div', { key: p.id, style: { border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 13px', background: reversed ? 'var(--surface-sunken)' : 'var(--surface)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', textDecoration: reversed ? 'line-through' : 'none', flex: 1, fontVariantNumeric: 'tabular-nums' } }, fmtMoney(p.amountInCents, p.currency)),
            reversed ? React.createElement(Pill, { tone: 'danger', dot: true }, 'Revertido') : React.createElement(Pill, { tone: 'success', dot: true }, 'Registrado')),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap' } },
            React.createElement('span', null, methodLabel(p.method)),
            p.reference && React.createElement('span', { style: { fontFamily: 'var(--font-mono)' } }, p.reference),
            React.createElement('span', null, fmtDateTime(p.paidAt))),
          p.notes && React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.45 } }, p.notes),
          reversed && React.createElement('div', { style: { marginTop: 9, padding: '8px 10px', borderRadius: 'var(--radius-xs)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)' } },
            React.createElement('div', { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' } }, 'Revertido · ' + fmtDateTime(p.reversedAt)),
            p.reversalReason && React.createElement('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.4 } }, p.reversalReason)),
          !reversed && canManage && React.createElement('div', { style: { marginTop: 10 } }, React.createElement(Btn, { variant: 'secondary', size: 'sm', full: true, leading: reverseLoading ? null : 'refresh', disabled: reverseLoading }, reverseLoading ? 'Revirtiendo…' : 'Revertir pago')));
      }));
  }

  function summaryRow(opts) {
    return React.createElement('button', { key: opts.key, className: 'ds-focusable', onClick: opts.onClick,
      style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' } },
      React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + opts.tone + '-soft)', color: 'var(--' + (opts.tone === 'neutral' ? 'text-subtle' : opts.tone) + ')' } }, I({ name: opts.icon, size: 16 })),
      React.createElement('span', { style: { flex: 1, minWidth: 0, display: 'grid', gap: 2 } },
        React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, opts.title),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, opts.sub)),
      opts.pill || React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', display: 'inline-flex' } }, I({ name: 'chevronRight', size: 16 })));
  }

  function MobileCloseoutScreen(props) {
    var s = props.s, mood = props.mood, onMood = props.onMood;
    var canManage = s.permission.canManage;
    var sheetState = useState(null); var sheet = sheetState[0], setSheet = sheetState[1];
    var moodState = useState(false); var moodOpen = moodState[0], setMoodOpen = moodState[1];

    if (!s.invoice) {
      return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
        React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),
        React.createElement('div', { style: { flex: 1, display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' } },
          React.createElement('div', { style: { display: 'grid', gap: 12, justifyItems: 'center' } },
            React.createElement('span', { style: { width: 52, height: 52, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-subtle)' } }, I({ name: 'receipt', size: 25 })),
            React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Selecciona una factura'),
            React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'Elige una factura emitida para cerrarla.'))),
        React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),
        moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } }, React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
    }

    var inv = s.invoice; var st = inv.settlement;
    var v = deriveVerdict(s); var vtone = v.tone === 'primary' ? 'info' : v.tone;
    var step = deriveNextStep(s);
    var dStatus = deliveryStatus(s); var deliv = DELIV[dStatus];
    var pay = paymentStatus(inv);
    var sri = SRI[inv.electronicStatus] || SRI.pending_submission;
    var pct = Math.min(100, Math.round((st.paidInCents / inv.totals.totalInCents) * 100));
    var sendLoading = step.primary && step.primary.handler === 'onSendEmail' && s.actionLoading === 'send-invoice-email';

    function runPrimary() {
      if (!step.primary) return;
      if (step.primary.handler === 'onSendEmail' || step.primary.kind === 'focus-delivery') setSheet('delivery');
      else if (step.primary.kind === 'focus-payment') setSheet('payment');
      /* nav is a no-op in the prototype */
    }

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: function () { setMoodOpen(true); }, onAssistant: function () {} }),

      /* fixed verdict + saldo (settlement always visible) */
      React.createElement('div', { style: { flex: 'none', padding: '13px 14px', background: 'var(--' + vtone + '-soft)', borderBottom: '1px solid var(--border)', borderLeft: '4px solid var(--' + vtone + ')' } },
        React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-' + vtone + '-soft)' } }, 'Cierre de la factura'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 } },
          React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--' + vtone + ')', border: '1px solid var(--' + vtone + ')' } }, I({ name: v.icon, size: 17 })),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('h1', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1.2 } }, v.title),
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--on-' + vtone + '-soft)' } }, inv.number))),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 11, paddingTop: 11, borderTop: '1px solid var(--border)' } },
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--on-' + vtone + '-soft)' } }, 'Saldo pendiente'),
            React.createElement('div', { style: { fontSize: 'var(--text-h1)', fontWeight: 800, color: pay === 'paid' ? 'var(--success)' : 'var(--text-strong)', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' } }, fmtMoney(st.balanceDueInCents, inv.currency))),
          pay === 'paid' ? React.createElement(Pill, { tone: 'success', dot: true }, 'Pagada') : React.createElement(Pill, { tone: pay === 'partial' ? 'info' : 'neutral', dot: true }, pay === 'partial' ? pct + '% cobrado' : 'Sin pagos')),
        React.createElement('div', { style: { height: 7, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden', marginTop: 8 } },
          React.createElement('div', { style: { width: pct + '%', height: '100%', borderRadius: 999, background: 'var(--' + (pay === 'paid' ? 'success' : 'info') + ')' } }))),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 12, alignContent: 'start' } },
        !canManage && React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' }, 'Tu rol ' + s.permission.role + ' no puede entregar ni registrar pagos.'),

        /* three-truth triad */
        React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'stretch' } },
            React.createElement(MTriadCell, { kicker: 'SRI', meta: sri }),
            React.createElement('span', { style: { width: 1, background: 'var(--divider)' } }),
            React.createElement(MTriadCell, { kicker: 'Entrega', meta: deliv }),
            React.createElement('span', { style: { width: 1, background: 'var(--divider)' } }),
            React.createElement(MTriadCell, { kicker: 'Pago', meta: PAY[pay] })),
          React.createElement('div', { style: { padding: '6px 12px', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', fontSize: 9, color: 'var(--text-subtle)', textAlign: 'center' } }, 'Tres verdades independientes')),

        /* next step (text; action lives at bottom) */
        React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--' + (step.tone === 'primary' ? 'primary' : step.tone) + ')', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 14 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
            React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', flex: 1 } }, 'Siguiente paso'),
            React.createElement(Pill, { tone: step.tone === 'primary' ? 'info' : step.tone, dot: true }, step.pill)),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, step.title),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 } }, step.desc)),

        /* delivery summary row */
        summaryRow({ key: 'delivery', icon: deliv.icon, tone: deliv.tone, title: 'Entrega del comprobante', sub: dStatus === 'sent' ? ('Enviado · ' + fmtDateTime(s.delivery.lastSentAt)) : dStatus === 'no_email' ? 'Falta correo del cliente' : dStatus === 'error' ? 'Error al enviar' : (inv.buyerEmail || 'Listo para enviar'), onClick: function () { setSheet('delivery'); }, pill: React.createElement(Pill, { tone: deliv.tone, dot: true }, deliv.label) }),

        /* payment summary row */
        summaryRow({ key: 'payment', icon: 'coins', tone: PAY[pay].tone, title: pay === 'paid' ? 'Factura pagada' : 'Registrar pago', sub: pay === 'paid' ? 'Saldo en cero' : ('Saldo ' + fmtMoney(st.balanceDueInCents, inv.currency)), onClick: function () { if (pay !== 'paid') setSheet('payment'); else setSheet('history'); }, pill: pay !== 'paid' ? React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: 'chevronRight', size: 16 })) : React.createElement(Pill, { tone: 'success', dot: true }, 'Pagada') }),

        /* payment history (cards, tappable to sheet) */
        summaryRow({ key: 'history', icon: 'history', tone: 'neutral', title: 'Historial de pagos', sub: (inv.payments.length || 'Sin') + (inv.payments.length === 1 ? ' pago registrado' : ' pagos registrados'), onClick: function () { setSheet('history'); } }),

        /* quiet downstream evidence */
        React.createElement('div', { style: { background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 14 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 } },
            React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'layers', size: 15 })),
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Evidencia para impuestos y contabilidad')),
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.5 } }, 'El cierre conserva autorización, entrega y pagos para el futuro traspaso a Tax Compliance EC y Accounting. Aquí no se declara ni se contabiliza.'))),

      /* sticky thumb-friendly primary action */
      React.createElement('div', { style: { flex: 'none', background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: 14 } },
        !canManage
          ? React.createElement(Btn, { variant: 'secondary', full: true, leading: 'lock', disabled: true }, 'Solo lectura')
          : step.primary
            ? React.createElement(Btn, { variant: 'primary', full: true, leading: sendLoading ? null : step.primary.icon, disabled: !!sendLoading, onClick: runPrimary }, sendLoading ? 'Enviando…' : step.primary.label)
            : React.createElement(Btn, { variant: 'secondary', full: true, leading: 'checkCircle', disabled: true }, 'Cierre completo')),

      React.createElement(BottomTabs, { active: 'queue', onTab: function () {} }),

      sheet === 'delivery' && React.createElement(Sheet, { title: 'Entrega del comprobante', onClose: function () { setSheet(null); } }, React.createElement(DeliverySheet, { s: s })),
      sheet === 'payment' && React.createElement(Sheet, { title: 'Registrar pago', onClose: function () { setSheet(null); } }, React.createElement(PaymentSheet, { s: s })),
      sheet === 'history' && React.createElement(Sheet, { title: 'Historial de pagos', onClose: function () { setSheet(null); } }, React.createElement(HistorySheet, { s: s })),
      moodOpen && React.createElement(Sheet, { title: 'Modo de diseño', onClose: function () { setMoodOpen(false); } }, React.createElement(UI.MoodMenu, { value: mood, onChange: function (m) { onMood(m); }, moods: D.moods })));
  }

  window.MobileCloseout = { MobileCloseoutScreen: MobileCloseoutScreen };
})();
