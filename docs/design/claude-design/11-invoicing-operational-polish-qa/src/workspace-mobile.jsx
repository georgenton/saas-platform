/* Mobile — purpose-built Invoicing compact flow (slice 11).
   Not a shrunk desktop. Demonstrates the mobile QA fixes the audit calls for:
     · the SRI/Entrega/Pago triad stacks to ONE column (M1)
     · the queue is single-column cards, never a horizontal table (M2)
     · long recommended steps wrap; the primary action is pinned for the thumb (M3)
     · the subview strip scrolls horizontally without clipping (M4)
     · technical traces stay collapsed / secondary
   window.MobileWorkspace */
(function () {
  var I = window.Icon;
  var UI = window.UI;
  var Btn = UI.Btn, Pill = UI.Pill, Banner = UI.Banner;
  var Chrome = window.Chrome;
  var MobileTopBar = Chrome.MobileTopBar, BottomTabs = Chrome.BottomTabs;
  var D = window.QA_DATA;
  var money = D.money;
  var WS = window.Workspace;

  function card(extra) { return Object.assign({ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }, extra || {}); }
  function mono(t, style) { return React.createElement('span', { style: Object.assign({ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }, style || {}) }, t); }

  function SubviewChips(props) {
    return React.createElement('div', { style: { display: 'flex', gap: 7, overflowX: 'auto', padding: '10px 12px', WebkitOverflowScrolling: 'touch' } },
      D.SUBVIEWS.map(function (v) {
        var active = v.key === props.active;
        return React.createElement('button', { key: v.key, className: 'ds-focusable', onClick: function () { props.onNav(v.key); },
          style: { flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border-strong)'), background: active ? 'var(--primary-soft)' : 'var(--surface)', color: active ? 'var(--on-primary-soft)' : 'var(--text)', fontFamily: 'inherit', fontSize: 'var(--text-xs)', fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap' } },
          I({ name: v.icon, size: 14 }), v.name);
      }));
  }

  /* Stacked context — number/buyer/total + triad as ONE column (M1 fix) */
  function MobileContext(props) {
    var s = props.s, inv = s.invoice;
    if (!inv) {
      var p = s.portfolio; if (!p) return null;
      var metrics = [['Por autorizar', p.porAutorizar, p.porAutorizar > 0 ? 'warning' : 'neutral'], ['Autorizadas (mes)', p.autorizadasMes, 'success'], ['Cartera del mes', money(p.carteraMes), 'neutral'], ['Por cobrar', money(p.porCobrar), 'info']];
      return React.createElement('div', { style: card({ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }) },
        metrics.map(function (m, i) {
          return React.createElement('div', { key: i, style: { padding: '12px 13px', borderTop: i > 1 ? '1px solid var(--divider)' : 'none', borderLeft: i % 2 ? '1px solid var(--divider)' : 'none' } },
            React.createElement('div', { style: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)' } }, m[0]),
            React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 800, color: m[2] === 'neutral' ? 'var(--text-strong)' : 'var(--' + m[2] + ')', fontVariantNumeric: 'tabular-nums', marginTop: 2 } }, m[1]));
        }));
    }
    var truths = [
      { kicker: 'SRI', meta: D.SRI[inv.electronicStatus] || D.SRI.pending_submission },
      { kicker: 'Entrega', meta: D.DELIV[inv.documentStatus === 'draft' ? 'na' : inv.delivery] || D.DELIV.pending },
      { kicker: 'Pago', meta: D.PAY[D.payState(inv)] }
    ];
    return React.createElement('div', { style: card({ overflow: 'hidden' }) },
      React.createElement('div', { style: { padding: '12px 14px', borderBottom: '1px solid var(--divider)' } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: 'receipt', size: 15 })),
          mono(inv.number, { fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-strong)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
          React.createElement('span', { style: { fontSize: 'var(--text-h3)', fontWeight: 800, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, money(inv.totalInCents))),
        React.createElement('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 3 } }, inv.buyerName)),
      truths.map(function (t, i) {
        var lt = t.meta.tone === 'neutral' ? 'text-subtle' : t.meta.tone;
        return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderTop: i ? '1px solid var(--divider)' : 'none' } },
          React.createElement('span', { style: { width: 30, height: 30, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + t.meta.tone + '-soft)', color: 'var(--' + lt + ')' } }, I({ name: t.meta.icon, size: 15 })),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)', width: 64, flex: 'none' } }, t.kicker),
          React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', flex: 1 } }, t.meta.label));
      }),
      React.createElement('div', { style: { padding: '7px 14px', borderTop: '1px solid var(--divider)', background: 'var(--surface-sunken)', fontSize: 10, color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 6 } },
        I({ name: 'layers', size: 11 }), 'Tres verdades independientes'));
  }

  function MobileNextStep(props) {
    var step = props.step; if (!step) return null;
    var t = step.tone === 'primary' ? 'primary' : step.tone;
    var lt = t === 'neutral' ? 'text-subtle' : t;
    return React.createElement('div', { style: card({ borderLeft: '4px solid var(--' + (t === 'neutral' ? 'border-strong' : t) + ')', padding: 14 }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
        React.createElement('span', { className: 'ds-eyebrow', style: { color: 'var(--text-subtle)', flex: 1, fontSize: 10 } }, 'Siguiente paso'),
        React.createElement(Pill, { tone: step.tone === 'primary' ? 'primary' : step.tone, dot: true }, step.pill)),
      React.createElement('div', { style: { display: 'flex', gap: 11, alignItems: 'flex-start' } },
        React.createElement('span', { style: { width: 32, height: 32, flex: 'none', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', background: 'var(--' + (t === 'neutral' ? 'surface-sunken' : t + '-soft') + ')', color: 'var(--' + lt + ')' } }, I({ name: step.icon, size: 17 })),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)', textWrap: 'pretty' } }, step.title),
          React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, step.desc))));
  }

  /* compact subview focus for mobile */
  function MobileFocus(props) {
    var key = props.active, s = props.s, inv = s.invoice;
    if (key === 'summary') {
      var queue = s.empty ? [] : [
        { n: '001-001-000148', c: 'Comercial Andina S.A.', t: 230100, st: 'authorized' },
        { n: '001-001-000147', c: 'Distribuidora Sur', t: 144900, st: 'submitted' },
        { n: '001-001-000146', c: 'Tecno Insumos S.A.', t: 89900, st: 'pending_submission' }
      ];
      return React.createElement('div', { style: card({ padding: 14 }) },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: queue.length ? 12 : 0 } },
          React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'invoicing', size: 16 })),
          React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Cola de facturas')),
        s.empty
          ? React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' } }, 'Todavía no hay facturas.')
          : React.createElement('div', { style: { display: 'grid', gap: 8 } },
              queue.map(function (q, i) {
                var meta = D.SRI[q.st] || D.SRI.pending_submission;
                return React.createElement('div', { key: i, style: { display: 'grid', gap: 5, padding: '11px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' } },
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                    mono(q.n, { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-strong)', flex: 1 }),
                    React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, money(q.t))),
                  React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                    React.createElement('span', { style: { fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, q.c),
                    React.createElement(Pill, { tone: meta.tone, dot: true }, meta.label)));
              })));
    }
    if (key === 'settings') {
      var r = s.readiness; var keys = ['emisor', 'firma', 'gateway', 'numeracion'];
      return React.createElement('div', { style: card({ padding: 14 }) },
        React.createElement('h3', { style: { margin: '0 0 12px', fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Configuración SRI'),
        React.createElement('div', { style: { display: 'grid', gap: 8 } },
          keys.map(function (k) {
            var p = r[k];
            return React.createElement('div', { key: k, style: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' } },
              React.createElement('span', { style: { width: 9, height: 9, marginTop: 4, flex: 'none', borderRadius: 999, background: 'var(--' + (p.tone === 'neutral' ? 'text-subtle' : p.tone) + ')' } }),
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' } }, p.label),
                React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginTop: 1 } }, p.note)));
          })));
    }
    if (key === 'lifecycle') {
      var es = (inv && inv.electronicStatus) || 'pending_submission';
      var meta = D.SRI[es];
      return React.createElement('div', { style: card({ padding: 14 }) },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
          React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Estado electrónico'),
          React.createElement(Pill, { tone: meta.tone, dot: true }, meta.label)),
        s.legalNote && React.createElement('div', { style: { marginBottom: 10 } }, React.createElement(Banner, { tone: 'warning', icon: 'alert' }, s.legalNote)),
        React.createElement(WS.MiniStepper, { electronicStatus: es }),
        s.sriMessage && React.createElement('div', { style: { marginTop: 12, padding: '10px 12px', background: 'var(--danger-soft)', borderRadius: 'var(--radius-sm)' } },
          React.createElement('div', { style: { fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--on-danger-soft)', marginBottom: 4 } }, 'código ' + s.sriMessage.code + ' · ' + s.sriMessage.field),
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--on-danger-soft)', lineHeight: 'var(--leading-body)' } }, s.sriMessage.text)));
    }
    if (key === 'closeout') {
      var paid = inv ? inv.paidInCents : 0, total = inv ? inv.totalInCents : 230100;
      var balance = Math.max(0, total - paid), pct = Math.min(100, Math.round(paid / total * 100)), paidFull = balance === 0;
      return React.createElement('div', { style: card({ padding: 14 }) },
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 10 } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)' } }, 'Saldo pendiente'),
            React.createElement('div', { style: { fontSize: 'var(--text-h1)', fontWeight: 800, color: paidFull ? 'var(--success)' : 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' } }, money(balance))),
          React.createElement(Pill, { tone: paidFull ? 'success' : paid > 0 ? 'info' : 'neutral', dot: true }, paidFull ? 'Pagada' : paid > 0 ? 'Parcial' : 'Sin pagos')),
        React.createElement('div', { style: { height: 8, borderRadius: 999, background: 'var(--surface-sunken)', border: '1px solid var(--border)', overflow: 'hidden' } },
          React.createElement('div', { style: { width: pct + '%', height: '100%', background: 'var(--' + (paidFull ? 'success' : 'info') + ')' } })),
        React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 12, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' } },
          React.createElement('span', null, 'Total ', React.createElement('strong', { style: { color: 'var(--text-strong)' } }, money(total))),
          React.createElement('span', null, 'Pagado ', React.createElement('strong', { style: { color: 'var(--success)' } }, money(paid)))));
    }
    // customer / items / review — concise card
    var labelByKey = { customer: 'Cliente del documento', items: 'Ítems de la factura', review: 'Revisión del documento' };
    var iconByKey = { customer: 'userCheck', items: 'listPlus', review: 'fileCheck' };
    var rowsByKey = {
      customer: [['Razón social', (inv && inv.buyerName) || 'Comercial Andina S.A.'], ['RUC', '1791234567001'], ['Correo', (inv && inv.buyerEmail) || 'cobranzas@comercialandina.ec']],
      items: [['Subtotal', money(200000)], ['IVA 15%', money(30100)], ['Total', money(230100)]],
      review: [['Emisor', 'Acme Logística S.A.'], ['Numeración', '001-001-000000148'], ['Total', money(230100)]]
    };
    return React.createElement('div', { style: card({ padding: 14 }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: iconByKey[key], size: 16 })),
        React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--text-strong)' } }, labelByKey[key])),
      React.createElement('div', { style: { display: 'grid', gap: 0 } },
        rowsByKey[key].map(function (r, i) {
          var isMono = key !== 'customer' || i === 1;
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--divider)' : 'none' } },
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text-muted)', flex: 1 } }, r[0]),
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', fontFamily: (key !== 'customer' && i > 0) || (key === 'customer' && i === 1) ? 'var(--font-mono)' : 'inherit', textAlign: 'right' } }, r[1]));
        })));
  }

  function MobileWorkspaceScreen(props) {
    var s = props.s;
    var canManage = !(s.permission && s.permission.canManage === false);
    var active = props.subview || s.subview;
    var tabFor = { summary: 'overview', settings: 'readiness', lifecycle: 'readiness', customer: 'queue', items: 'queue', review: 'queue', closeout: 'queue' };

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--app-bg)' } },
      React.createElement(MobileTopBar, { tenant: D.tenant, onTenant: function () {}, onMood: props.onMood, onAssistant: function () {} }),
      React.createElement('div', { style: { flex: 'none', borderBottom: '1px solid var(--border)', background: 'var(--surface)' } },
        React.createElement('div', { style: { padding: '12px 14px 4px' } },
          React.createElement('div', { style: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' } }, 'Invoicing'),
          React.createElement('h1', { style: { margin: '1px 0 0', fontSize: 'var(--text-h2)', fontWeight: 800, letterSpacing: 'var(--track-snug)', color: 'var(--text-strong)' } }, (D.SUBVIEWS.filter(function (v) { return v.key === active; })[0] || {}).name)),
        React.createElement(SubviewChips, { active: active, onNav: props.onNav })),

      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'grid', gap: 12, alignContent: 'start' } },
        !canManage && React.createElement(Banner, { tone: 'info', icon: 'lock', title: 'Solo lectura' }, 'Tu rol ' + s.permission.role + ' puede consultar pero no emitir ni cobrar.'),
        s.blocker && React.createElement(Banner, { tone: 'warning', icon: 'shieldAlert', title: 'Configuración incompleta' }, s.blocker),
        React.createElement(MobileContext, { s: s }),
        React.createElement(MobileNextStep, { step: s.next }),
        React.createElement(MobileFocus, { active: active, s: s }),
        React.createElement('div', { style: { height: canManage && s.next && s.next.primary ? 8 : 0 } })),

      canManage && s.next && s.next.primary && React.createElement('div', { style: { flex: 'none', padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface)' } },
        React.createElement(Btn, { variant: 'primary', full: true, leading: s.next.primary.icon, onClick: function () { s.next.primary.to && props.onNav(s.next.primary.to); } }, s.next.primary.label)),

      React.createElement(BottomTabs, { active: tabFor[active] || 'overview', onTab: function () {} }));
  }

  window.MobileWorkspace = { MobileWorkspaceScreen: MobileWorkspaceScreen };
})();
