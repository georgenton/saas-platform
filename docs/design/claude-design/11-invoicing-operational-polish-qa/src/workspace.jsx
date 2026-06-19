/* Desktop — Final Polished Invoicing Shell (slice 11).
   The coherence layer: one product workspace that unifies every Invoicing
   subview (slices 02/05–10) under a single rhythm.

   Layout:
     ProductHeader   one line — product + breadcrumb + primary action (no dup <h1>)
     SubviewNav      the seven-stage lane with a 3px active rail (NavItem pattern)
     ContextStrip    persistent context — invoice number/buyer/total + the SRI ·
                     Entrega · Pago triad (three independent truths), or portfolio
     NextStep        exactly one recommended next action for the current state
     SubviewFocus    a distilled, on-brand view of the active subview
     Readiness       the four SRI pillars (when relevant)

   window.Workspace */
(function () {
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var D = window.QA_DATA;
  var money = D.money;

  function card(extra) { return Object.assign({ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }, extra || {}); }
  function eyebrow(t) { return React.createElement('div', { className: 'ds-eyebrow' }, t); }
  function mono(t, style) { return React.createElement('span', { style: Object.assign({ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }, style || {}) }, t); }

  /* ----------------------------------------------------- 1 · PRODUCT HEADER */
  function ProductHeader(props) {
    var sub = props.activeSubview;
    var s = props.s;
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' } },
      React.createElement('span', { style: { width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)' } }, I({ name: 'invoicing', size: 21 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontWeight: 600 } },
          'Invoicing', I({ name: 'chevronRight', size: 12 }), React.createElement('span', { style: { color: 'var(--text-muted)' } }, sub.name)),
        React.createElement('h1', { style: { margin: '1px 0 0', fontSize: 'var(--text-h1)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, sub.name === 'Resumen' ? 'Facturación electrónica' : sub.name),
        React.createElement('p', { style: { margin: '2px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' } }, sub.blurb)),
      props.canManage && s.next && s.next.primary && React.createElement(Btn, { variant: 'primary', leading: s.next.primary.icon }, s.next.primary.label));
  }

  /* ------------------------------------------------------- 2 · SUBVIEW NAV */
  function SubviewNav(props) {
    return React.createElement('div', { style: card({ padding: 5, marginBottom: 16, display: 'flex', gap: 2, overflowX: 'auto' }) },
      D.SUBVIEWS.map(function (v) {
        var active = v.key === props.active;
        return React.createElement('button', {
          key: v.key, className: 'ds-focusable',
          onClick: function () { props.onNav(v.key); },
          'aria-current': active ? 'page' : undefined,
          style: { position: 'relative', flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', fontSize: 'var(--text-sm)', fontWeight: active ? 700 : 500, color: active ? 'var(--on-primary-soft)' : 'var(--text)', background: active ? 'var(--primary-soft)' : 'transparent', transition: 'var(--transition-base)' }
        },
          active && React.createElement('span', { style: { position: 'absolute', left: 6, top: 8, bottom: 8, width: 3, borderRadius: 3, background: 'var(--primary)' } }),
          React.createElement('span', { style: { display: 'inline-flex', marginLeft: active ? 6 : 0 } }, I({ name: v.icon, size: 16 })),
          v.name);
      }));
  }

  /* --------------------------------------------------- 3 · CONTEXT STRIP */
  function TruthCell(props) {
    var meta = props.meta;
    return React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' } },
      React.createElement('span', { style: { width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + meta.tone + '-soft)', color: 'var(--' + (meta.tone === 'neutral' ? 'text-subtle' : meta.tone) + ')' } }, I({ name: meta.icon, size: 16 })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, props.kicker),
        React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, meta.label)));
  }
  function ContextStrip(props) {
    var s = props.s; var inv = s.invoice;
    if (!inv) {
      var p = s.portfolio;
      if (!p) return null;
      var metrics = [
        { label: 'Por autorizar', value: p.porAutorizar, tone: p.porAutorizar > 0 ? 'warning' : 'neutral' },
        { label: 'Autorizadas (mes)', value: p.autorizadasMes, tone: 'success' },
        { label: 'Cartera del mes', value: money(p.carteraMes), tone: 'neutral' },
        { label: 'Por cobrar', value: money(p.porCobrar), tone: 'info' }
      ];
      return React.createElement('div', { style: card({ display: 'flex', alignItems: 'stretch', marginBottom: 16, overflow: 'hidden' }) },
        metrics.map(function (m, i) {
          return React.createElement('div', { key: i, style: { flex: 1, padding: '13px 16px', borderLeft: i ? '1px solid var(--divider)' : 'none' } },
            React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-subtle)' } }, m.label),
            React.createElement('div', { style: { fontSize: 'var(--text-h2)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: m.tone === 'neutral' ? 'var(--text-strong)' : 'var(--' + m.tone + ')', fontVariantNumeric: 'tabular-nums', marginTop: 2 } }, m.value));
        }));
    }
    var sri = D.SRI[inv.electronicStatus] || D.SRI.pending_submission;
    var deliv = D.DELIV[inv.documentStatus === 'draft' ? 'na' : inv.delivery] || D.DELIV.pending;
    var pay = D.PAY[D.payState(inv)];
    return React.createElement('div', { style: card({ marginBottom: 16, overflow: 'hidden' }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: '1px solid var(--divider)' } },
        React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: 'receipt', size: 17 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          mono(inv.number, { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginLeft: 10 } }, inv.buyerName)),
        React.createElement('div', { style: { textAlign: 'right' } },
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' } }, inv.documentStatus === 'draft' ? 'Total (borrador)' : 'Total'),
          React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 800, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, money(inv.totalInCents)))),
      React.createElement('div', { style: { display: 'flex', alignItems: 'stretch' } },
        React.createElement(TruthCell, { kicker: 'SRI', meta: sri }),
        React.createElement('span', { style: { width: 1, background: 'var(--divider)', flex: 'none' } }),
        React.createElement(TruthCell, { kicker: 'Entrega', meta: deliv }),
        React.createElement('span', { style: { width: 1, background: 'var(--divider)', flex: 'none' } }),
        React.createElement(TruthCell, { kicker: 'Pago', meta: pay })),
      React.createElement('div', { style: { padding: '7px 16px', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 6 } },
        I({ name: 'layers', size: 12 }), 'Tres verdades independientes: el SRI autoriza, tú entregas, el cliente paga.'));
  }

  /* ----------------------------------------------------------- 4 · NEXT STEP */
  function NextStep(props) {
    var step = props.step, canManage = props.canManage, onNav = props.onNav;
    if (!step) return null;
    var t = step.tone === 'primary' ? 'primary' : step.tone;
    var lt = t === 'neutral' ? 'text-subtle' : t;
    return React.createElement('div', { style: card({ borderLeft: '4px solid var(--' + (t === 'neutral' ? 'border-strong' : t) + ')', padding: '18px var(--card-pad)', marginBottom: 16 }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 } },
        React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', flex: 1 } }, 'Siguiente paso recomendado'),
        React.createElement(Pill, { tone: step.tone === 'primary' ? 'primary' : step.tone, dot: true }, step.pill)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 14 } },
        React.createElement('span', { style: { width: 38, height: 38, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + (t === 'neutral' ? 'surface-sunken' : t + '-soft') + ')', color: 'var(--' + lt + ')' } }, I({ name: step.icon, size: 19 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, step.title),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', maxWidth: 640, textWrap: 'pretty' } }, step.desc),
          (step.primary || step.secondary) && React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' } },
            step.primary && (canManage
              ? React.createElement(Btn, { variant: 'primary', leading: step.primary.icon, onClick: function () { step.primary.to && onNav(step.primary.to); } }, step.primary.label)
              : React.createElement(Btn, { variant: 'secondary', leading: 'lock', disabled: true }, 'Solo lectura')),
            step.secondary && React.createElement(Btn, { variant: 'ghost', onClick: function () { step.secondary.to && onNav(step.secondary.to); } }, step.secondary.label)))));
  }

  /* ------------------------------------------------------- 5 · SUBVIEW FOCUS */
  function CardHead(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: props.flush ? 0 : 14 } },
      React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: props.icon, size: 17 })),
      React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, props.title),
      props.right);
  }
  function Row(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: props.first ? 'none' : '1px solid var(--divider)' } },
      React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-muted)', flex: 1 } }, props.label),
      React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' } }, props.value));
  }

  function ReadinessRibbon(props) {
    var r = props.readiness; if (!r) return null;
    var keys = ['emisor', 'firma', 'gateway', 'numeracion'];
    return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
      React.createElement(CardHead, { icon: 'shield', title: 'Configuración SRI', right: React.createElement('a', { href: '#', onClick: function (e) { e.preventDefault(); props.onNav('settings'); }, style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' } }, 'Abrir ajustes →') }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
        keys.map(function (k) {
          var p = r[k];
          return React.createElement('div', { key: k, style: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)' } },
            React.createElement('span', { style: { width: 9, height: 9, marginTop: 4, flex: 'none', borderRadius: 999, background: 'var(--' + (p.tone === 'neutral' ? 'text-subtle' : p.tone) + ')' } }),
            React.createElement('div', { style: { minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, p.label),
              React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 1 } }, p.note)));
        })));
  }

  function MiniStepper(props) {
    var es = props.electronicStatus;
    var steps = [
      { k: 'prep', label: 'Preparado' },
      { k: 'sent', label: 'Enviado al SRI' },
      { k: 'auth', label: 'Autorizado' }
    ];
    var done = { pending_submission: 0, submitted: 1, authorized: 3, rejected: 1 }[es];
    var rejected = es === 'rejected';
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 0, margin: '4px 0 2px' } },
      steps.map(function (st, i) {
        var complete = done > i;
        var current = done === i + 1 && !complete;
        var isRej = rejected && i === 1;
        var tone = isRej ? 'danger' : complete ? 'success' : current ? 'warning' : 'neutral';
        return React.createElement(React.Fragment, { key: st.k },
          i > 0 && React.createElement('span', { style: { flex: 1, height: 2, background: (done > i || (done === i)) ? 'var(--' + (rejected && i === 1 ? 'danger' : 'success') + ')' : 'var(--divider)', minWidth: 18 } }),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 'none' } },
            React.createElement('span', { style: { width: 26, height: 26, borderRadius: 999, display: 'grid', placeItems: 'center', background: tone === 'neutral' ? 'var(--surface-sunken)' : 'var(--' + tone + '-soft)', color: 'var(--' + (tone === 'neutral' ? 'text-subtle' : tone) + ')', border: '1px solid var(--' + (tone === 'neutral' ? 'border' : tone) + ')' } }, I({ name: isRej ? 'x' : complete ? 'check' : current ? 'clock' : 'circleDot', size: 14 })),
            React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, color: tone === 'neutral' ? 'var(--text-subtle)' : 'var(--text-strong)', whiteSpace: 'nowrap' } }, isRej ? 'Devuelto' : st.label)));
      }));
  }

  function SubviewFocus(props) {
    var key = props.active, s = props.s, inv = s.invoice;
    var onNav = props.onNav;

    if (key === 'summary') {
      var p = s.portfolio || { porAutorizar: 0, autorizadasMes: 0, carteraMes: 0, porCobrar: 0 };
      var queue = s.empty ? [] : [
        { n: '001-001-000000148', c: 'Comercial Andina S.A.', t: 230100, st: 'authorized' },
        { n: '001-001-000000147', c: 'Distribuidora Sur Cía. Ltda.', t: 144900, st: 'submitted' },
        { n: '001-001-000000146', c: 'Tecno Insumos S.A.', t: 89900, st: 'pending_submission' },
        { n: 'Borrador · 001-001', c: 'Servicios Pacífico', t: 56000, st: 'draft' }
      ];
      return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
        React.createElement(CardHead, { icon: 'invoicing', title: 'Cola de facturas', right: React.createElement(Pill, { tone: 'neutral' }, queue.length + ' documentos') }),
        s.empty
          ? React.createElement('div', { style: { textAlign: 'center', padding: '44px 16px', color: 'var(--text-muted)' } },
              React.createElement('span', { style: { display: 'inline-flex', color: 'var(--text-subtle)', marginBottom: 10 } }, I({ name: 'receipt', size: 28 })),
              React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-strong)' } }, 'Todavía no hay facturas'),
              React.createElement('p', { style: { margin: '6px 0 0', fontSize: 'var(--text-sm)' } }, 'Cuando emitas tu primera factura aparecerá aquí, con su estado en el SRI.'))
          : React.createElement('div', { style: { display: 'grid', gap: 8 } },
              queue.map(function (q, i) {
                var meta = D.SRI[q.st] || D.SRI.pending_submission;
                var draft = q.st === 'draft';
                return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' } },
                  mono(q.n, { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', flex: 'none', width: 150 }),
                  React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, q.c),
                  React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', flex: 'none', width: 90, textAlign: 'right' } }, money(q.t)),
                  React.createElement('span', { style: { flex: 'none', width: 130, display: 'flex', justifyContent: 'flex-end' } }, React.createElement(Pill, { tone: draft ? 'neutral' : meta.tone, dot: true }, draft ? 'Borrador' : meta.label)));
              })));
    }

    if (key === 'settings') {
      return React.createElement(ReadinessRibbon, { readiness: s.readiness, onNav: onNav });
    }

    if (key === 'customer') {
      return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
        React.createElement(CardHead, { icon: 'userCheck', title: 'Cliente del documento', right: React.createElement(Pill, { tone: 'success', dot: true }, 'Identificado') }),
        React.createElement('div', { style: { display: 'grid', gap: 0 } },
          React.createElement(Row, { first: true, label: 'Razón social', value: (inv && inv.buyerName) || 'Comercial Andina S.A.' }),
          React.createElement(Row, { label: 'Identificación (RUC)', value: mono('1791234567001') }),
          React.createElement(Row, { label: 'Correo', value: (inv && inv.buyerEmail) || 'cobranzas@comercialandina.ec' }),
          React.createElement(Row, { label: 'Documento', value: 'Factura · borrador abierto' })));
    }

    if (key === 'items') {
      var items = [
        { d: 'Servicio de logística — ruta Quito/Guayaquil', q: 1, pu: 200000, iva: 15 },
        { d: 'Recargo por manejo especial', q: 1, pu: 0, iva: 15 }
      ];
      return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
        React.createElement(CardHead, { icon: 'listPlus', title: 'Ítems de la factura', right: React.createElement(Pill, { tone: 'neutral' }, items.length + ' líneas') }),
        React.createElement('div', { style: { display: 'grid', gap: 8, marginBottom: 12 } },
          items.map(function (it, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' } },
              React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', color: 'var(--text-strong)' } }, it.d),
              React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', flex: 'none' } }, 'IVA ' + it.iva + '%'),
              React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', flex: 'none', width: 90, textAlign: 'right' } }, money(it.pu * it.q)));
          })),
        React.createElement('div', { style: { display: 'grid', gap: 0, paddingTop: 4, borderTop: '1px solid var(--divider)' } },
          React.createElement(Row, { first: true, label: 'Subtotal', value: money(200000) }),
          React.createElement(Row, { label: 'IVA 15%', value: money(30100) }),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0 0', borderTop: '1px solid var(--divider)' } },
            React.createElement('span', { style: { fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', flex: 1 } }, 'Total'),
            React.createElement('span', { style: { fontSize: 'var(--text-h2)', fontWeight: 800, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, money(230100)))));
    }

    if (key === 'review') {
      return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
        React.createElement(CardHead, { icon: 'fileCheck', title: 'Revisión del documento', right: React.createElement(Pill, { tone: inv && inv.documentStatus === 'issued' ? 'info' : 'neutral', dot: true }, inv && inv.documentStatus === 'issued' ? 'Emitida' : 'Borrador') }),
        React.createElement('p', { style: { margin: '0 0 14px', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)' } }, 'Confirma los datos antes de emitir. El estado del documento (borrador / emitida) es distinto del estado electrónico en el SRI.'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
          [['Emisor', 'Acme Logística S.A.'], ['Cliente', (inv && inv.buyerName) || 'Comercial Andina S.A.'], ['Numeración', mono('001-001-000000148')], ['Total', money(230100)]].map(function (r, i) {
            return React.createElement('div', { key: i, style: { padding: '11px 13px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)' } },
              React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)' } }, r[0]),
              React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', marginTop: 3 } }, r[1]));
          })));
    }

    if (key === 'lifecycle') {
      var es = (inv && inv.electronicStatus) || 'pending_submission';
      var meta = D.SRI[es];
      var rej = s.sriMessage;
      return React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
          React.createElement(CardHead, { icon: 'route', title: 'Estado electrónico (SRI)', right: React.createElement(Pill, { tone: meta.tone, dot: true }, meta.label) }),
          s.legalNote && React.createElement(Banner, { tone: 'warning', icon: 'alert', style: { marginBottom: 14 } }, s.legalNote),
          React.createElement(MiniStepper, { electronicStatus: es }),
          React.createElement('div', { style: { display: 'grid', gap: 0, marginTop: 16, paddingTop: 4, borderTop: '1px solid var(--divider)' } },
            es === 'authorized' && React.createElement(Row, { first: true, label: 'No. de autorización', value: mono(D.accessKeyDemo, { fontSize: 'var(--text-2xs)' }) }),
            React.createElement(Row, { first: es !== 'authorized', label: 'Clave de acceso', value: mono(D.accessKeyDemo, { fontSize: 'var(--text-2xs)' }) }))),
        rej && React.createElement('div', { style: card({ padding: 'var(--card-pad)', borderLeft: '4px solid var(--danger)' }) },
          React.createElement(CardHead, { icon: 'ban', title: 'Observación del SRI', right: React.createElement(Pill, { tone: 'danger' }, 'Código ' + rej.code) }),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', marginBottom: 6 } }, 'campo: ' + rej.field),
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 'var(--leading-body)' } }, rej.text)));
    }

    if (key === 'closeout') {
      var paid = inv ? inv.paidInCents : 0;
      var total = inv ? inv.totalInCents : 230100;
      var balance = Math.max(0, total - paid);
      var pct = Math.min(100, Math.round((paid / total) * 100));
      var paidFull = balance === 0;
      return React.createElement('div', { style: { display: 'grid', gap: 16 } },
        React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 12 } },
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)' } }, 'Saldo pendiente'),
              React.createElement('div', { style: { fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: paidFull ? 'var(--success)' : 'var(--text-strong)', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' } }, money(balance))),
            React.createElement(Pill, { tone: paidFull ? 'success' : paid > 0 ? 'info' : 'neutral', dot: true }, paidFull ? 'Pagada' : paid > 0 ? 'Pago parcial' : 'Sin pagos')),
          React.createElement('div', { style: { height: 9, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 12 } },
            React.createElement('div', { style: { width: pct + '%', height: '100%', borderRadius: 999, background: 'var(--' + (paidFull ? 'success' : 'info') + ')', transition: 'var(--transition-base)' } })),
          React.createElement('div', { style: { display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--divider)' } },
            [['Total', money(total), 'text-strong'], ['Pagado', money(paid), 'success'], ['Saldo', money(balance), balance > 0 ? 'text-strong' : 'success']].map(function (f, i) {
              return React.createElement('div', { key: i, style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)' } }, f[0]),
                React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--' + f[2] + ')', fontVariantNumeric: 'tabular-nums', marginTop: 2 } }, f[1]));
            }))),
        React.createElement('div', { style: card({ background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)', boxShadow: 'none', padding: 'var(--card-pad)' }) },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 } },
            React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex', marginTop: 1 } }, I({ name: 'layers', size: 18 })),
            React.createElement('div', null,
              React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Evidencia para impuestos y contabilidad'),
              React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)' } }, 'El cierre conserva autorización, entrega y pagos como evidencia para el futuro traspaso a Tax Compliance EC y Accounting. Aquí no declaramos impuestos ni registramos asientos.')))));
    }

    return null;
  }

  /* --------------------------------------------------------------- PAGE */
  function DesktopWorkspace(props) {
    var s = props.s;
    var canManage = !(s.permission && s.permission.canManage === false);
    var active = props.subview || s.subview;

    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto' } },
      React.createElement(ProductHeader, { activeSubview: D.SUBVIEWS.filter(function (v) { return v.key === active; })[0], s: s, canManage: canManage }),
      React.createElement(SubviewNav, { active: active, onNav: props.onNav }),

      !canManage && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' },
          'Tu rol ' + s.permission.role + ' puede consultar la cartera, el estado del SRI y los pagos, pero no emitir ni cobrar. Falta el permiso ',
          mono(s.permission.missingPermission, { fontWeight: 600 }), '.')),

      s.blocker && React.createElement('div', { style: { marginBottom: 16 } },
        React.createElement(Banner, { tone: 'warning', icon: 'shieldAlert', title: 'Configuración incompleta' }, s.blocker)),

      React.createElement(ContextStrip, { s: s }),
      React.createElement(NextStep, { step: s.next, canManage: canManage, onNav: props.onNav }),
      React.createElement(SubviewFocus, { active: active, s: s, onNav: props.onNav }),

      (active !== 'settings' && active !== 'summary' && s.readiness) && React.createElement('div', { style: { marginTop: 16 } },
        React.createElement(ReadinessRibbon, { readiness: s.readiness, onNav: props.onNav })));
  }

  window.Workspace = { DesktopWorkspace: DesktopWorkspace, SubviewFocus: SubviewFocus, ContextStrip: ContextStrip, MiniStepper: MiniStepper, ReadinessRibbon: ReadinessRibbon, card: card, CardHead: CardHead, Row: Row };
})();
