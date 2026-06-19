/* Visual Coherence Audit board (slice 11).
   Actionable for Codex, not generic commentary. Findings are grouped by region,
   each tagged with severity (usability / mobile / cosmetic) and match status,
   naming the exact component and the precise fix. Plus the recommended PR order
   and a mobile-first QA checklist.
   window.AuditBoard */
(function () {
  var useState = React.useState;
  var I = window.Icon;
  var UI = window.UI;
  var Pill = UI.Pill;
  var D = window.QA_DATA;

  function card(extra) { return Object.assign({ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }, extra || {}); }

  var SEV = {
    usability: { tone: 'warning', label: 'Usabilidad', icon: 'alert' },
    mobile: { tone: 'info', label: 'Móvil', icon: 'menu' },
    cosmetic: { tone: 'neutral', label: 'Cosmético', icon: 'sliders' }
  };
  var MATCH = {
    ok: { tone: 'success', label: 'Coincide' },
    partial: { tone: 'warning', label: 'Parcial' },
    mismatch: { tone: 'danger', label: 'No coincide' }
  };

  function Finding(props) {
    var f = props.f;
    var sev = SEV[f.severity], match = MATCH[f.match];
    return React.createElement('div', { style: { padding: '14px 0', borderTop: props.first ? 'none' : '1px solid var(--divider)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' } },
        React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-subtle)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '2px 7px' } }, f.id),
        React.createElement(Pill, { tone: sev.tone, dot: true }, sev.label),
        React.createElement(Pill, { tone: match.tone }, match.label),
        React.createElement('span', { style: { flex: 1 } }),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontWeight: 600 } }, 'PR ' + f.pr)),
      React.createElement('div', { style: { display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 8 } },
        React.createElement('span', { style: { color: 'var(--danger)', flex: 'none', marginTop: 1, display: 'inline-flex' } }, I({ name: 'x', size: 14 })),
        React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, f.problem)),
      React.createElement('div', { style: { display: 'flex', gap: 9, alignItems: 'flex-start', padding: '9px 11px', background: 'var(--success-soft)', borderRadius: 'var(--radius-sm)' } },
        React.createElement('span', { style: { color: 'var(--success)', flex: 'none', marginTop: 1, display: 'inline-flex' } }, I({ name: 'check', size: 14 })),
        React.createElement('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--on-success-soft)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, f.fix)));
  }

  function Region(props) {
    var r = props.r;
    var open = props.open, setOpen = props.setOpen;
    return React.createElement('div', { style: card({ overflow: 'hidden' }) },
      React.createElement('button', { className: 'ds-focusable', onClick: function () { setOpen(!open); }, style: { width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, r.region),
          React.createElement('div', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', marginTop: 2 } }, r.component)),
        React.createElement(Pill, { tone: 'neutral' }, r.findings.length + (r.findings.length === 1 ? ' hallazgo' : ' hallazgos')),
        React.createElement('span', { style: { color: 'var(--text-subtle)', display: 'inline-flex' } }, I({ name: open ? 'chevronUp' : 'chevronDown', size: 17 }))),
      open && React.createElement('div', { style: { padding: '0 16px 14px' } },
        r.findings.map(function (f, i) { return React.createElement(Finding, { key: f.id, f: f, first: i === 0 }); })));
  }

  function SummaryStat(props) {
    return React.createElement('div', { style: { flex: 1, padding: '14px 16px', borderLeft: props.i ? '1px solid var(--divider)' : 'none' } },
      React.createElement('div', { style: { fontSize: 'var(--text-display)', fontWeight: 800, color: props.color, letterSpacing: 'var(--track-tight)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' } }, props.value),
      React.createElement('div', { style: { fontSize: 'var(--text-2xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-subtle)', marginTop: 6 } }, props.label));
  }

  function PrPlan(props) {
    return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'gitBranch', size: 17 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'Orden de PRs recomendado'),
        React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-subtle)' } }, 'pequeños y seguros')),
      React.createElement('div', { style: { display: 'grid', gap: 10 } },
        D.audit.prPlan.map(function (pr) {
          var riskTone = pr.risk === 'low' ? 'success' : pr.risk === 'medium' ? 'warning' : 'danger';
          return React.createElement('div', { key: pr.n, style: { display: 'flex', gap: 13, alignItems: 'flex-start', padding: '12px 13px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)' } },
            React.createElement('span', { style: { width: 26, height: 26, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 800 } }, pr.n),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
                React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' } }, pr.title),
                React.createElement(Pill, { tone: riskTone }, 'riesgo ' + (pr.risk === 'low' ? 'bajo' : pr.risk === 'medium' ? 'medio' : 'alto'))),
              React.createElement('p', { style: { margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, pr.scope),
              pr.findings.length > 0 && React.createElement('div', { style: { marginTop: 7, display: 'flex', gap: 5, flexWrap: 'wrap' } },
                pr.findings.map(function (id) { return React.createElement('span', { key: id, style: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '1px 6px' } }, id); }))));
        })));
  }

  function MobileQa() {
    return React.createElement('div', { style: card({ padding: 'var(--card-pad)' }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 } },
        React.createElement('span', { style: { color: 'var(--text-muted)', display: 'inline-flex' } }, I({ name: 'menu', size: 17 })),
        React.createElement('h3', { style: { margin: 0, flex: 1, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, 'QA móvil'),
        React.createElement(Pill, { tone: 'success', dot: true }, D.mobileQa.length + '/' + D.mobileQa.length)),
      React.createElement('div', { style: { display: 'grid', gap: 8 } },
        D.mobileQa.map(function (q) {
          return React.createElement('div', { key: q.id, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' } },
            React.createElement('span', { style: { width: 22, height: 22, flex: 'none', borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--success-soft)', color: 'var(--success)' } }, I({ name: 'check', size: 13 })),
            React.createElement('span', { style: { fontSize: 'var(--text-sm)', color: 'var(--text)', flex: 1, textWrap: 'pretty' } }, q.text));
        })));
  }

  function AuditBoardView(props) {
    var openMap = useState({ 0: true }); var open = openMap[0], setOpen = openMap[1];
    var a = D.audit;
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 980, margin: '0 auto' } },
      React.createElement('div', { style: { marginBottom: 18 } },
        React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Auditoría de coherencia'),
        React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Qué pulir antes de cerrar'),
        React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 660, lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, 'Diferencias entre la implementación actual y Claude Design, listas para traducir a PRs pequeños y seguros. Cada hallazgo nombra el componente exacto y el arreglo preciso.')),

      React.createElement('div', { style: card({ display: 'flex', marginBottom: 16, overflow: 'hidden' }) },
        React.createElement(SummaryStat, { i: 0, value: a.summary.total, label: 'Hallazgos', color: 'var(--text-strong)' }),
        React.createElement(SummaryStat, { i: 1, value: a.summary.usability, label: 'Usabilidad', color: 'var(--warning)' }),
        React.createElement(SummaryStat, { i: 1, value: a.summary.mobile, label: 'Móvil', color: 'var(--info)' }),
        React.createElement(SummaryStat, { i: 1, value: a.summary.cosmetic, label: 'Cosmético', color: 'var(--text-muted)' }),
        React.createElement(SummaryStat, { i: 1, value: a.prPlan.length, label: 'PRs', color: 'var(--primary)' })),

      React.createElement('div', { style: { display: 'grid', gap: 12, marginBottom: 16 } },
        a.regions.map(function (r, i) {
          return React.createElement(Region, { key: i, r: r, open: !!open[i], setOpen: function (v) { var o = Object.assign({}, open); o[i] = v; setOpen(o); } });
        })),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, alignItems: 'start' } },
        React.createElement(PrPlan, null),
        React.createElement(MobileQa, null)));
  }

  window.AuditBoard = { AuditBoardView: AuditBoardView };
})();
