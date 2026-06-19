/* Invoicing Experience Map (slice 11).
   Command Center → Invoicing → Configure SRI → Customer/Draft → Items →
   Document Review → SRI Lifecycle → Delivery/Payment Closeout.
   For each stage: where the operator is, the one safe next action, and the
   coherence rule the UI must honor. Clicking a stage jumps the workspace to it.
   window.JourneyMap */
(function () {
  var I = window.Icon;
  var UI = window.UI;
  var Pill = UI.Pill;
  var D = window.QA_DATA;

  function card(extra) { return Object.assign({ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }, extra || {}); }

  function Stage(props) {
    var st = props.st, i = props.i, last = props.last;
    return React.createElement('div', { style: { display: 'flex', gap: 16, alignItems: 'stretch' } },
      // rail
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', width: 44 } },
        React.createElement('span', { style: { width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center', background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid var(--primary)', flex: 'none' } }, I({ name: st.icon, size: 20 })),
        !last && React.createElement('span', { style: { flex: 1, width: 2, background: 'var(--divider)', margin: '4px 0' } })),
      // body
      React.createElement('div', {
        className: 'ds-focusable', role: 'button', tabIndex: 0, onClick: function () { props.onJump(st.state, st.targetSubview); },
        onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); props.onJump(st.state, st.targetSubview); } },
        style: card({ flex: 1, minWidth: 0, padding: '15px 16px', marginBottom: last ? 0 : 16, textAlign: 'left', cursor: 'pointer', transition: 'var(--transition-base)' }) },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7, flexWrap: 'wrap' } },
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' } }, String(i + 1).padStart(2, '0')),
          React.createElement('h3', { style: { margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)' } }, st.name),
          React.createElement('span', { style: { fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, st.sub),
          React.createElement('span', { style: { flex: 1 } }),
          React.createElement(Pill, { tone: 'neutral' }, 'Slice ' + st.slice)),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 9 } },
          React.createElement('div', { style: { display: 'flex', gap: 9, alignItems: 'flex-start' } },
            React.createElement('span', { style: { color: 'var(--text-subtle)', flex: 'none', marginTop: 1, display: 'inline-flex' } }, I({ name: 'mapPin', size: 14 })),
            React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, st.where)),
          React.createElement('div', { style: { display: 'flex', gap: 9, alignItems: 'flex-start' } },
            React.createElement('span', { style: { color: 'var(--primary)', flex: 'none', marginTop: 1, display: 'inline-flex' } }, I({ name: 'arrowRight', size: 14 })),
            React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: 'var(--text-sm)', color: 'var(--text-strong)', fontWeight: 600 } }, 'Acción segura: ', React.createElement('span', { style: { fontWeight: 500, color: 'var(--text)' } }, st.action))),
          React.createElement('div', { style: { display: 'flex', gap: 9, alignItems: 'flex-start', padding: '9px 11px', background: 'var(--info-soft)', borderRadius: 'var(--radius-sm)' } },
            React.createElement('span', { style: { color: 'var(--info)', flex: 'none', marginTop: 1, display: 'inline-flex' } }, I({ name: 'shieldCheck', size: 14 })),
            React.createElement('span', { style: { flex: 1, minWidth: 0, fontSize: 'var(--text-xs)', color: 'var(--on-info-soft)', lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, st.rule))),
        React.createElement('div', { style: { marginTop: 11, fontSize: 'var(--text-2xs)', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 } }, 'Abrir en el workspace', I({ name: 'externalLink', size: 12 }))));
  }

  function JourneyMapView(props) {
    var m = D.experienceMap;
    var subviewByStage = { command: 'summary', settings: 'settings', customer: 'customer', items: 'items', review: 'review', lifecycle: 'lifecycle', closeout: 'closeout' };
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 920, margin: '0 auto' } },
      React.createElement('div', { style: { marginBottom: 20 } },
        React.createElement('div', { className: 'ds-eyebrow' }, 'Invoicing · Mapa de experiencia'),
        React.createElement('h1', { style: { margin: '4px 0 0', fontSize: 'var(--text-display)', fontWeight: 800, letterSpacing: 'var(--track-tight)', color: 'var(--text-strong)' } }, 'Cómo se mueve un operador'),
        React.createElement('p', { style: { margin: '8px 0 0', fontSize: 'var(--text-body)', color: 'var(--text-muted)', maxWidth: 660, lineHeight: 'var(--leading-body)', textWrap: 'pretty' } }, m.intro)),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, padding: '11px 14px', background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flexWrap: 'wrap' } },
        m.stages.map(function (st, i) {
          return React.createElement(React.Fragment, { key: st.key },
            i > 0 && React.createElement(I, { name: 'chevronRight', size: 12 }),
            React.createElement('span', { style: { fontWeight: 600, color: 'var(--text)' } }, st.name));
        })),
      React.createElement('div', null,
        m.stages.map(function (st, i) {
          return React.createElement(Stage, { key: st.key, st: Object.assign({ targetSubview: subviewByStage[st.key] }, st), i: i, last: i === m.stages.length - 1, onJump: props.onJump });
        })));
  }

  window.JourneyMap = { JourneyMapView: JourneyMapView };
})();
