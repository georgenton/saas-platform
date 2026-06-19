/* Desktop — Invoicing Payment + Email Delivery Closeout (slice 10).
   A calm front-desk closeout lane, not a finance console. Hierarchy (handoff):
     1 closeout verdict header        — where this invoice stands overall
     2 status triad                   — SRI · entrega · pago (three truths)
     3 one recommended next step      — a single dominant action
     4 delivery card                  — Entrega del comprobante (send-email)
     5 settlement / progress card     — Saldo pendiente
     6 payment form (currency input)  — Registrar pago
     7 payment history                — posted + reversed, Revertir pago
     8 quiet downstream evidence card — Evidencia para impuestos y contabilidad
   CRITICAL: email delivery, payment and SRI authorization are independent. The
   UI never implies authorization from delivery/payment, never posts journals,
   never files declarations. window.Closeout. */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var D = window.CLOSEOUT_DATA;

  var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtDateTime(iso) { if (!iso) return '—'; var m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(iso); if (!m) return iso; return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1] + ' · ' + m[4] + ':' + m[5]; }
  function fmtMoney(cents, currency) {
    var neg = cents < 0; var n = (Math.abs(cents) / 100).toFixed(2).split('.');
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + '$' + n.join('.') + (currency && currency !== 'USD' ? ' ' + currency : '');
  }
  function methodLabel(v) { var m = D.methods.filter(function (x) { return x.value === v; })[0]; return m ? m.label : v; }

  /* ---- derived truths -------------------------------------------------- */
  function deliveryStatus(s) {
    if (!s.invoice || !s.invoice.buyerEmail && !s.delivery.recipientEmail) return 'no_email';
    if (s.actionLoading === 'send-invoice-email') return 'sending';
    if (s.delivery.error) return 'error';
    if (s.delivery.lastSentAt) return 'sent';
    return 'ready';
  }
  function paymentStatus(inv) {
    if (!inv) return 'unpaid';
    if (inv.settlement.isFullyPaid) return 'paid';
    if (inv.settlement.paidInCents > 0) return 'partial';
    return 'unpaid';
  }
  var SRI = {
    authorized: { tone: 'success', label: 'Autorizado', icon: 'shieldCheck' },
    submitted: { tone: 'warning', label: 'Enviado al SRI', icon: 'refreshCw' },
    rejected: { tone: 'danger', label: 'Devuelto', icon: 'ban' },
    pending_submission: { tone: 'neutral', label: 'Pendiente', icon: 'clock' }
  };
  var DELIV = {
    no_email: { tone: 'warning', label: 'Sin correo', icon: 'alert' },
    ready: { tone: 'neutral', label: 'Sin enviar', icon: 'mail' },
    sending: { tone: 'info', label: 'Enviando…', icon: 'refreshCw' },
    sent: { tone: 'success', label: 'Enviado', icon: 'checkCircle' },
    error: { tone: 'danger', label: 'Error', icon: 'alert' }
  };
  var PAY = {
    unpaid: { tone: 'neutral', label: 'Sin pagos', icon: 'coins' },
    partial: { tone: 'info', label: 'Pago parcial', icon: 'coins' },
    paid: { tone: 'success', label: 'Pagada', icon: 'checkCircle' }
  };

  function deriveVerdict(s) {
    var inv = s.invoice;
    var draft = inv.status === 'draft';
    var delivered = deliveryStatus(s) === 'sent';
    var pay = paymentStatus(inv);
    if (draft) return { tone: 'neutral', icon: 'fileText', title: 'Esta factura aún no está lista para entregar', sub: 'Sigue en borrador. Emítela para poder entregarla al cliente y registrar pagos.' };
    if (pay === 'paid' && delivered) return { tone: 'success', icon: 'checkCircle', title: 'Factura cerrada', sub: 'Entregada al cliente y pagada en su totalidad. La evidencia queda lista para impuestos y contabilidad.' };
    if (pay === 'paid' && !delivered) return { tone: 'success', icon: 'coins', title: 'Pagada · falta entregar', sub: 'El saldo ya está cubierto. Envía el comprobante al cliente para completar el cierre.' };
    if (delivered && pay === 'partial') return { tone: 'info', icon: 'route', title: 'Cierre en curso · pago parcial', sub: 'El cliente ya recibió el comprobante. Queda un saldo pendiente por cobrar.' };
    if (delivered && pay === 'unpaid') return { tone: 'info', icon: 'route', title: 'Entregada · pendiente de pago', sub: 'El cliente ya tiene el comprobante. Registra el pago cuando lo recibas.' };
    return { tone: 'primary', icon: 'send', title: 'Lista para cerrar', sub: 'Entrega el comprobante al cliente y registra el pago. Un paso a la vez.' };
  }

  function deriveNextStep(s) {
    var inv = s.invoice;
    var draft = inv.status === 'draft';
    var dStatus = deliveryStatus(s);
    var delivered = dStatus === 'sent';
    var hasEmail = !!(inv.buyerEmail || s.delivery.recipientEmail);
    var pay = paymentStatus(inv);
    var hasBalance = inv.settlement.balanceDueInCents > 0;

    if (draft) return { tone: 'warning', pill: 'Borrador', icon: 'fileText', title: 'Primero emite la factura', desc: 'La factura sigue en borrador. Emítela en revisión del documento antes de entregarla o cobrarla.', primary: { label: 'Ir a revisión del documento', icon: 'arrowRight', kind: 'nav' } };
    if (!delivered && hasEmail) return { tone: 'primary', pill: 'Entrega', icon: 'send', title: 'Envía el comprobante al cliente', desc: 'La factura está lista. Envíala por correo a ' + (inv.buyerEmail || s.delivery.recipientEmail) + '. Esto entrega el documento; no cambia el SRI ni el pago.', primary: { label: 'Enviar al cliente', icon: 'send', handler: 'onSendEmail' }, secondary: hasBalance ? { label: 'Registrar pago', kind: 'focus-payment' } : null };
    if (!delivered && !hasEmail) return { tone: 'warning', pill: 'Falta correo', icon: 'mail', title: 'Agrega un correo para poder entregar', desc: 'No hay correo del cliente, así que aún no podemos entregar el comprobante. ' + (hasBalance ? 'Mientras tanto, puedes registrar el pago.' : 'El saldo ya está cubierto.'), primary: hasBalance ? { label: 'Registrar pago', icon: 'coins', kind: 'focus-payment' } : { label: 'Agregar correo del cliente', icon: 'pencil', kind: 'focus-delivery' }, secondary: { label: 'Agregar correo', kind: 'focus-delivery' } };
    if (delivered && hasBalance) return { tone: 'info', pill: pay === 'partial' ? 'Saldo pendiente' : 'Cobro', icon: 'coins', title: pay === 'partial' ? 'Registra el saldo restante' : 'Registra el pago del cliente', desc: 'El comprobante ya fue entregado. Queda ' + fmtMoney(inv.settlement.balanceDueInCents, inv.currency) + ' por cobrar. Registra el pago sin pensar en centavos.', primary: { label: 'Registrar pago', icon: 'coins', kind: 'focus-payment' }, secondary: { label: 'Reenviar al cliente', handler: 'onSendEmail' } };
    return { tone: 'success', pill: 'Cierre completo', icon: 'checkCircle', title: 'Esta factura ya está cerrada', desc: 'Entregada y pagada. No queda ninguna acción pendiente. La evidencia está disponible para el futuro traspaso a impuestos y contabilidad.', primary: null, secondary: { label: 'Reenviar al cliente', handler: 'onSendEmail' } };
  }

  /* ===================================================== 1 · VERDICT HEADER */
  function VerdictHeader(props) {
    var s = props.s; var inv = s.invoice; var v = deriveVerdict(s);
    var tone = v.tone === 'primary' ? 'info' : v.tone;
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '18px var(--card-pad)', borderLeft: '4px solid var(--' + tone + ')', background: 'var(--' + tone + '-soft)' } },
        React.createElement('span', { style: { width: 48, height: 48, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--' + tone + ')', border: '1px solid var(--' + tone + ')' } }, I({ name: v.icon, size: 24 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow', style: { color: 'var(--on-' + tone + '-soft)' } }, 'Cierre de la factura'),
          React.createElement('h2', { style: { margin: '2px 0 0', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, v.title),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-sm)', color: 'var(--on-' + tone + '-soft)', maxWidth: 600, lineHeight: 'var(--leading-body)' } }, v.sub)),
        React.createElement('div', { style: { flex: 'none', textAlign: 'right' } },
          React.createElement('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap' } }, inv.number),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--on-' + tone + '-soft)', marginTop: 2 } }, inv.buyerName),
          React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', marginTop: 6 } }, fmtMoney(inv.totals.totalInCents, inv.currency)))));
  }

  /* ===================================================== 2 · STATUS TRIAD */
  function TriadCell(props) {
    var meta = props.meta;
    return React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px' } },
      React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + meta.tone + '-soft)', color: 'var(--' + (meta.tone === 'neutral' ? 'text-subtle' : meta.tone) + ')' } }, I({ name: meta.icon, size: 17 })),
      React.createElement('div', { style: { minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.kicker),
        React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, meta.label)));
  }
  function StatusTriad(props) {
    var s = props.s; var inv = s.invoice;
    var sri = SRI[inv.electronicStatus] || SRI.pending_submission;
    var deliv = DELIV[deliveryStatus(s)];
    var pay = PAY[paymentStatus(inv)];
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'stretch' } },
        React.createElement(TriadCell, { kicker: 'SRI', meta: sri }),
        React.createElement('span', { style: { width: 1, background: 'var(--divider)', flex: 'none' } }),
        React.createElement(TriadCell, { kicker: 'Entrega', meta: deliv }),
        React.createElement('span', { style: { width: 1, background: 'var(--divider)', flex: 'none' } }),
        React.createElement(TriadCell, { kicker: 'Pago', meta: pay })),
      React.createElement('div', { style: { padding: '7px 15px', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 6 } },
        I({ name: 'layers', size: 12 }), 'Tres verdades independientes: el SRI autoriza, tú entregas, el cliente paga.'));
  }

  /* ===================================================== 3 · NEXT STEP */
  function NextStep(props) {
    var step = props.step, s = props.s, canManage = props.canManage, run = props.run;
    var tone = step.tone === 'primary' ? 'info' : step.tone;
    var sendLoading = step.primary && step.primary.handler === 'onSendEmail' && s.actionLoading === 'send-invoice-email';
    var primaryLabel = sendLoading ? 'Enviando…' : (step.primary ? step.primary.label : null);
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--' + tone + ')', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '18px var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 } },
        React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', flex: 1 } }, 'Siguiente paso recomendado'),
        React.createElement(Pill, { tone: step.tone === 'primary' ? 'info' : step.tone, dot: true }, step.pill)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14 } },
        React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + (step.tone === 'primary' ? 'primary' : step.tone) + '-soft)', color: 'var(--' + (step.tone === 'primary' ? 'primary' : step.tone) + ')' } }, I({ name: step.icon, size: 19 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, step.title),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', maxWidth: 620 } }, step.desc),
          (step.primary || step.secondary) && React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' } },
            step.primary && (canManage
              ? React.createElement(Btn, { variant: 'primary', leading: sendLoading ? null : step.primary.icon, disabled: !!sendLoading, onClick: function () { run(step.primary); } }, primaryLabel)
              : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura')),
            step.secondary && canManage && React.createElement(Btn, { variant: 'ghost', onClick: function () { run(step.secondary); } }, step.secondary.label)))));
  }

  /* ===================================================== 4 · DELIVERY CARD */
  function fieldLabel(t) { return React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, t); }
  function inputStyle(disabled) { return { height: 'var(--control-h)', padding: '0 12px', background: disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', font: 'inherit', fontSize: 'var(--text-sm)', color: 'var(--text-strong)', outline: 'none', width: '100%', boxSizing: 'border-box' }; }

  function DeliveryCard(props) {
    var s = props.s, canManage = props.canManage;
    var inv = s.invoice;
    var dStatus = deliveryStatus(s);
    var deliv = DELIV[dStatus];
    var ds = useState(s.delivery); var d = ds[0], setDRaw = ds[1];
    function setD(k, v) { var o = {}; o[k] = v; setDRaw(Object.assign({}, d, o)); }
    var sending = dStatus === 'sending';
    var noEmail = !d.recipientEmail;
    var sendDisabled = !canManage || noEmail || sending || inv.status === 'draft';
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'mail', size: 17 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Entrega del comprobante'),
        React.createElement(Pill, { tone: deliv.tone, dot: true }, deliv.label)),
      dStatus === 'sent' && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 'var(--radius-sm)', background: 'var(--success-soft)', color: 'var(--on-success-soft)', marginBottom: 14 } },
        React.createElement('span', { style: { color: 'var(--success)', flex: 'none', display: 'inline-flex' } }, I({ name: 'checkCircle', size: 17 })),
        React.createElement('span', { style: { fontSize: 'var(--text-sm)' } }, 'Enviado a ', React.createElement('strong', null, d.recipientEmail), ' · ', fmtDateTime(s.delivery.lastSentAt))),
      dStatus === 'error' && React.createElement('div', { style: { marginBottom: 14 } }, React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No pudimos enviar el correo' }, s.delivery.error)),
      noEmail && React.createElement('div', { style: { marginBottom: 14 } }, React.createElement(Banner, { tone: 'warning', icon: 'mail', title: 'Falta el correo del cliente' }, 'Agrega una dirección para poder entregar el comprobante. El pago se puede registrar sin correo.')),
      React.createElement('div', { style: { display: 'grid', gap: 14 } },
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Correo del destinatario'),
          React.createElement('input', { type: 'email', value: d.recipientEmail, disabled: !canManage || sending, placeholder: 'correo@cliente.ec', onChange: function (e) { setD('recipientEmail', e.target.value); }, style: inputStyle(!canManage || sending) })),
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Mensaje (opcional)'),
          React.createElement('textarea', { value: d.message, disabled: !canManage || sending, rows: 2, placeholder: 'Acompaña el envío con una nota para el cliente.', onChange: function (e) { setD('message', e.target.value); }, style: Object.assign(inputStyle(!canManage || sending), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }) })),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
          canManage
            ? React.createElement(Btn, { variant: 'primary', leading: sending ? null : (dStatus === 'sent' ? 'refreshCw' : 'send'), disabled: sendDisabled }, sending ? 'Enviando…' : dStatus === 'sent' ? 'Reenviar al cliente' : 'Enviar al cliente')
            : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flex: 1, minWidth: 220, lineHeight: 1.5 } }, 'El envío entrega el comprobante por correo. No cambia el estado en el SRI ni registra el pago.'))));
  }

  /* ===================================================== 5 · SETTLEMENT */
  function Figure(props) {
    return React.createElement('div', { style: { display: 'grid', gap: 3, flex: 1, minWidth: 0 } },
      React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.label),
      React.createElement('span', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: props.color || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, props.value));
  }
  function SettlementCard(props) {
    var inv = props.s.invoice; var st = inv.settlement; var pay = paymentStatus(inv);
    var pct = st.totalGuard ? 0 : Math.min(100, Math.round((st.paidInCents / inv.totals.totalInCents) * 100));
    var barTone = pay === 'paid' ? 'success' : 'info';
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, pay === 'paid' ? 'Saldo pendiente' : 'Saldo pendiente'),
          React.createElement('div', { style: { fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: pay === 'paid' ? 'var(--success)' : 'var(--text-strong)', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' } }, fmtMoney(st.balanceDueInCents, inv.currency))),
        pay === 'paid'
          ? React.createElement(Pill, { tone: 'success', dot: true }, 'Factura pagada')
          : React.createElement(Pill, { tone: pay === 'partial' ? 'info' : 'neutral', dot: true }, pay === 'partial' ? 'Pago parcial' : 'Sin pagos')),
      React.createElement('div', { style: { height: 9, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 6 } },
        React.createElement('div', { style: { width: pct + '%', height: '100%', borderRadius: 999, background: 'var(--' + barTone + ')', transition: 'var(--transition-base)' } })),
      React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginBottom: 14 } }, pct + '% cobrado'),
      React.createElement('div', { style: { display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--divider)' } },
        React.createElement(Figure, { label: 'Total', value: fmtMoney(inv.totals.totalInCents, inv.currency) }),
        React.createElement(Figure, { label: 'Pagado', value: fmtMoney(st.paidInCents, inv.currency), color: 'var(--success)' }),
        React.createElement(Figure, { label: 'Saldo', value: fmtMoney(st.balanceDueInCents, inv.currency), color: st.balanceDueInCents > 0 ? 'var(--text-strong)' : 'var(--success)' })));
  }

  /* ===================================================== 6 · PAYMENT FORM */
  function PaymentForm(props) {
    var s = props.s, canManage = props.canManage;
    var inv = s.invoice; var st = inv.settlement; var paid = st.isFullyPaid;
    var fs = useState(s.paymentForm); var f = fs[0], setFRaw = fs[1];
    function setF(k, v) { var o = {}; o[k] = v; setFRaw(Object.assign({}, f, o)); }
    var loading = s.actionLoading === 'create-invoice-payment';
    var disabled = !canManage || inv.status === 'draft';

    if (paid) {
      return React.createElement('div', { style: { background: 'var(--success-soft)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', padding: 'var(--card-pad)', display: 'flex', alignItems: 'center', gap: 13 } },
        React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--success)', border: '1px solid var(--success)' } }, I({ name: 'checkCircle', size: 19 })),
        React.createElement('div', null,
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Factura pagada'),
          React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-sm)', color: 'var(--on-success-soft)' } }, 'El saldo está en cero. No se requieren más pagos. Si hubo un error, puedes revertir un pago abajo.')));
    }
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'coins', size: 17 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Registrar pago'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } }, 'Saldo ', React.createElement('strong', { style: { color: 'var(--text-strong)' } }, fmtMoney(st.balanceDueInCents, inv.currency)))),
      s.paymentError && React.createElement('div', { style: { marginBottom: 14 } }, React.createElement(Banner, { tone: 'danger', icon: 'alert', title: 'No pudimos registrar el pago' }, s.paymentError)),
      React.createElement('div', { style: { display: 'grid', gap: 14 } },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 } },
          React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Monto'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', height: 'var(--control-h)', padding: '0 12px', background: disabled ? 'var(--surface-sunken)' : 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' } },
              React.createElement('span', { style: { color: 'var(--text-muted)', fontWeight: 700, marginRight: 6 } }, '$'),
              React.createElement('input', { inputMode: 'decimal', value: f.amount, disabled: disabled, placeholder: '0.00', onChange: function (e) { setF('amount', e.target.value); }, style: { flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }),
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontWeight: 600 } }, inv.currency))),
          React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Método'),
            React.createElement('select', { value: f.method, disabled: disabled, onChange: function (e) { setF('method', e.target.value); }, style: inputStyle(disabled) },
              D.methods.map(function (m) { return React.createElement('option', { key: m.value, value: m.value }, m.label); })))),
        React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          [{ k: 'full', label: 'Saldo total · ' + fmtMoney(st.balanceDueInCents, inv.currency), v: (st.balanceDueInCents / 100).toFixed(2) }, { k: 'half', label: '50%', v: (st.balanceDueInCents / 200).toFixed(2) }].map(function (q) {
            return React.createElement('button', { key: q.k, type: 'button', className: 'ds-focusable', disabled: disabled, onClick: function () { setF('amount', q.v); }, style: { padding: '5px 11px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: 'var(--surface-sunken)', color: 'var(--text)', fontSize: 'var(--text-2xs)', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer' } }, q.label);
          })),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 } },
          React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Referencia (opcional)'),
            React.createElement('input', { value: f.reference, disabled: disabled, placeholder: 'No. transferencia / recibo', onChange: function (e) { setF('reference', e.target.value); }, style: inputStyle(disabled) })),
          React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Fecha de pago'),
            React.createElement('input', { type: 'datetime-local', value: f.paidAt, disabled: disabled, onChange: function (e) { setF('paidAt', e.target.value); }, style: inputStyle(disabled) }))),
        React.createElement('label', { style: { display: 'grid', gap: 6 } }, fieldLabel('Notas (opcional)'),
          React.createElement('textarea', { value: f.notes, disabled: disabled, rows: 2, placeholder: 'Detalle interno del pago.', onChange: function (e) { setF('notes', e.target.value); }, style: Object.assign(inputStyle(disabled), { height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }) })),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
          canManage
            ? React.createElement(Btn, { variant: 'primary', leading: loading ? null : 'plus', disabled: disabled || loading }, loading ? 'Registrando…' : 'Registrar pago')
            : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura'),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', flex: 1, minWidth: 220, lineHeight: 1.5 } }, 'Registrar un pago actualiza el saldo. No genera asientos contables ni concilia con el banco.'))));
  }

  /* ===================================================== 7 · PAYMENT HISTORY */
  function PaymentRow(props) {
    var p = props.p, s = props.s, canManage = props.canManage;
    var inv = s.invoice;
    var reversed = p.status === 'reversed';
    var reverseLoading = s.actionLoading === 'reverse-invoice-payment' && s.reverseTargetId === p.id;
    return React.createElement('div', { style: { border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '13px 14px', background: reversed ? 'var(--surface-sunken)' : 'var(--surface)', opacity: reversed ? 0.92 : 1 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
        React.createElement('span', { style: { width: 34, height: 34, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: reversed ? 'var(--surface)' : 'var(--success-soft)', color: reversed ? 'var(--text-subtle)' : 'var(--success)', border: reversed ? '1px solid var(--border)' : 'none' } }, I({ name: reversed ? 'refresh' : 'coins', size: 16 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' } },
            React.createElement('span', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', textDecoration: reversed ? 'line-through' : 'none', fontVariantNumeric: 'tabular-nums' } }, fmtMoney(p.amountInCents, p.currency)),
            reversed ? React.createElement(Pill, { tone: 'danger', dot: true }, 'Revertido') : React.createElement(Pill, { tone: 'success', dot: true }, 'Registrado')),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 3, display: 'flex', gap: 10, flexWrap: 'wrap' } },
            React.createElement('span', null, methodLabel(p.method)),
            p.reference && React.createElement('span', { style: { fontFamily: 'var(--font-mono)' } }, p.reference),
            React.createElement('span', null, fmtDateTime(p.paidAt))),
          p.notes && React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text)', lineHeight: 1.45 } }, p.notes)),
        !reversed && canManage && React.createElement(Btn, { variant: 'ghost', size: 'sm', leading: reverseLoading ? null : 'refresh', disabled: reverseLoading }, reverseLoading ? 'Revirtiendo…' : 'Revertir pago')),
      reversed && React.createElement('div', { style: { marginTop: 10, padding: '9px 11px', borderRadius: 'var(--radius-xs)', background: 'var(--danger-soft)', color: 'var(--on-danger-soft)' } },
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' } }, 'Revertido · ' + fmtDateTime(p.reversedAt)),
        p.reversalReason && React.createElement('p', { style: { margin: '3px 0 0', fontSize: 'var(--text-xs)', lineHeight: 1.45 } }, p.reversalReason)));
  }
  function PaymentHistory(props) {
    var s = props.s, canManage = props.canManage;
    var payments = s.invoice.payments || [];
    return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: payments.length ? 14 : 0 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'history', size: 17 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Historial de pagos'),
        React.createElement(Pill, { tone: 'neutral' }, payments.length + (payments.length === 1 ? ' pago' : ' pagos'))),
      payments.length === 0
        ? React.createElement('div', { style: { textAlign: 'center', padding: '28px 16px', color: 'var(--text-muted)' } },
            React.createElement('span', { style: { display: 'inline-flex', color: 'var(--text-subtle)', marginBottom: 8 } }, I({ name: 'coins', size: 24 })),
            React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)' } }, 'Aún no hay pagos registrados. Al registrar uno aparecerá aquí.'))
        : React.createElement('div', { style: { display: 'grid', gap: 10 } }, payments.map(function (p) { return React.createElement(PaymentRow, { key: p.id, p: p, s: s, canManage: canManage }); })));
  }

  /* ===================================================== 8 · DOWNSTREAM EVIDENCE */
  function EvidenceCard(props) {
    var inv = props.s.invoice; var authorized = inv.electronicStatus === 'authorized';
    return React.createElement('div', { style: { background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: 'var(--card-pad)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 13 } },
        React.createElement('span', { style: { width: 36, height: 36, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' } }, I({ name: 'layers', size: 18 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Evidencia para impuestos y contabilidad'),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', maxWidth: 640 } }, 'Este cierre conserva la autorización del SRI, la entrega al cliente y los pagos como evidencia ordenada. Más adelante servirá para el traspaso a Tax Compliance EC y Accounting. Aquí no declaramos impuestos ni registramos asientos: eso vive en sus propios módulos.'),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' } },
            React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' } }, I({ name: 'tax', size: 13 }), 'Tax Compliance EC', React.createElement('span', { style: { color: 'var(--text-subtle)' } }, '· futuro')),
            React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' } }, I({ name: 'accounting', size: 13 }), 'Accounting', React.createElement('span', { style: { color: 'var(--text-subtle)' } }, '· futuro')),
            authorized && React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-muted)' } }, I({ name: 'shieldCheck', size: 13 }), 'Clave de acceso guardada')))));
  }

  /* ===================================================== EMPTY / PAGE */
  function NoInvoice() {
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center', padding: '80px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' } },
        React.createElement('span', { style: { width: 60, height: 60, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--surface-sunken)', color: 'var(--text-subtle)' } }, I({ name: 'receipt', size: 26 })),
        React.createElement('div', { style: { maxWidth: 420 } },
          React.createElement('h2', { style: { margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Selecciona una factura'),
          React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.55 } }, 'Elige una factura emitida para cerrarla: entregarla al cliente, registrar el pago y dejar evidencia ordenada.'))));
  }

  function DesktopCloseout(props) {
    var s = props.s;
    var canManage = s.permission.canManage;
    if (!s.invoice) return React.createElement(NoInvoice, null);

    var step = deriveNextStep(s);
    function run() { /* handlers (onSendEmail / focus-payment / nav) are no-ops in the prototype */ }

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 18, flexWrap: 'wrap' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Cierre'),
          React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Entrega y cobro'),
          React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 620, lineHeight: 'var(--leading-body)' } }, 'Después de emitir, cierra la factura con calma: entrégala al cliente, registra el pago y entiende el saldo. Un paso recomendado a la vez.')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, React.createElement(Btn, { variant: 'ghost', leading: 'help' }, 'Guía de cierre'))),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede ver la entrega, el saldo y los pagos, pero no enviar correos, registrar ni revertir pagos. Falta el permiso ',
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontWeight: 600 } }, s.permission.missingPermission), '.')),

      s.actionMessage && canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: s.actionMessage.tone, icon: s.actionMessage.tone === 'success' ? 'checkCircle' : 'alert' }, s.actionMessage.text)),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' } },
        React.createElement('div', { style: { display: 'grid', gap: 16, minWidth: 0 } },
          React.createElement(VerdictHeader, { s: s }),
          React.createElement(StatusTriad, { s: s }),
          React.createElement(NextStep, { step: step, s: s, canManage: canManage, run: run }),
          React.createElement(DeliveryCard, { s: s, canManage: canManage }),
          React.createElement(EvidenceCard, { s: s })),
        React.createElement('div', { style: { display: 'grid', gap: 16, minWidth: 0, position: 'sticky', top: 'var(--gutter)' } },
          React.createElement(SettlementCard, { s: s }),
          React.createElement(PaymentForm, { s: s, canManage: canManage }),
          React.createElement(PaymentHistory, { s: s, canManage: canManage }))));
  }

  window.Closeout = {
    DesktopCloseout: DesktopCloseout,
    deriveVerdict: deriveVerdict, deriveNextStep: deriveNextStep,
    deliveryStatus: deliveryStatus, paymentStatus: paymentStatus,
    fmtMoney: fmtMoney, fmtDateTime: fmtDateTime, methodLabel: methodLabel,
    SRI: SRI, DELIV: DELIV, PAY: PAY,
    DeliveryCard: DeliveryCard, SettlementCard: SettlementCard, PaymentForm: PaymentForm, PaymentRow: PaymentRow, fieldLabel: fieldLabel, inputStyle: inputStyle
  };
})();
