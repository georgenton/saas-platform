/* Interactive viewer — slice 11, Invoicing Operational Polish QA.
   Top strip switches:
     · VIEW   — Shell (the polished workspace) · Mapa (experience map) · Auditoría
     · DEVICE — desktop / mobile (applies to the Shell)
     · ESTADO — the 13 required cross-subview states
     · MOOD   — comfort · focus · calm · high-contrast · night
   The Shell mounts inside the real Platform Shell chrome; the subview nav lets
   you walk the lane within a state. The Map jumps into the Shell at any stage.
   Selection persists in localStorage. */
(function () {
  var useState = React.useState, useEffect = React.useEffect;
  var UI = window.UI;
  var Btn = UI.Btn, AssistantPanel = UI.AssistantPanel, StateScreen = UI.StateScreen;
  var Chrome = window.Chrome;
  var Sidebar = Chrome.Sidebar, TopBar = Chrome.TopBar;
  var DesktopWorkspace = window.Workspace.DesktopWorkspace;
  var MobileWorkspaceScreen = window.MobileWorkspace.MobileWorkspaceScreen;
  var JourneyMapView = window.JourneyMap.JourneyMapView;
  var AuditBoardView = window.AuditBoard.AuditBoardView;
  var D = window.QA_DATA;

  var STATES = [
    { key: 'operating', label: '1 · Configurado y operando' },
    { key: 'missing_setup', label: '2 · Falta configurar SRI' },
    { key: 'draft_in_progress', label: '3 · Borrador en progreso' },
    { key: 'issued_pending_sri', label: '4 · Emitida · SRI pendiente' },
    { key: 'submitted_pending', label: '5 · Enviada · esperando' },
    { key: 'authorized', label: '6 · Autorizada' },
    { key: 'rejected', label: '7 · Devuelta por el SRI' },
    { key: 'open_balance', label: '8 · Saldo abierto' },
    { key: 'fully_paid', label: '9 · Pagada' },
    { key: 'permission_limited', label: '10 · Permiso limitado' },
    { key: 'empty_workspace', label: '11 · Espacio vacío' },
    { key: 'loading', label: '12 · Cargando' },
    { key: 'backend_unavailable', label: '13 · Backend no disponible' }
  ];

  var LS = 'invoicing-qa-slice-v1';
  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save(v) { try { localStorage.setItem(LS, JSON.stringify(v)); } catch (e) {} }

  function Skeleton() {
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto', display: 'grid', gap: 16 } },
      React.createElement('div', { style: { height: 44, width: 360, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)' } }),
      React.createElement('div', { style: { height: 52, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' } }),
      [120, 110, 220].map(function (h, i) { return React.createElement('div', { key: i, style: { height: h, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', opacity: 1 - i * 0.12 } }); }));
  }

  function Seg(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      props.label && React.createElement('span', { style: { fontSize: 11, color: '#8b93a3', fontWeight: 600 } }, props.label),
      React.createElement('div', { style: { display: 'flex', background: '#0f1115', border: '1px solid #2b313c', borderRadius: 8, padding: 2 } },
        props.opts.map(function (o) { return React.createElement('button', { key: o.k, onClick: function () { props.onChange(o.k); }, style: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: props.value === o.k ? '#2a63d6' : 'transparent', color: props.value === o.k ? '#fff' : '#aab1bf' } }, o.t); })));
  }
  function Picker(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement('span', { style: { fontSize: 11, color: '#8b93a3', fontWeight: 600 } }, props.label),
      React.createElement('select', { value: props.value, onChange: function (e) { props.onChange(e.target.value); }, style: { background: '#0f1115', color: '#e6e9ef', border: '1px solid #2b313c', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } },
        props.opts.map(function (o) { return React.createElement('option', { key: o.k, value: o.k }, o.t); })));
  }

  function DesktopShellMain(props) {
    var s = D.scenarios[props.state];
    if (s.loading) return React.createElement(Skeleton, null);
    if (s.backendError) {
      var e = D.backendErrorInfo;
      return React.createElement(StateScreen, { icon: 'server', tone: 'danger', title: e.title, meta: 'correlationId ' + e.correlationId, actions: React.createElement(Btn, { variant: 'primary', leading: 'refresh' }, 'Reintentar') }, e.message);
    }
    return React.createElement(DesktopWorkspace, { s: s, subview: props.subview, onNav: props.onNav });
  }

  function App() {
    var init = load();
    var vv = useState(init.view || 'shell'); var view = vv[0], setView = vv[1];
    var dv = useState(init.device || 'desktop'); var device = dv[0], setDevice = dv[1];
    var stv = useState(init.state || 'authorized'); var state = stv[0], setState = stv[1];
    var mdv = useState(init.mood || 'comfort'); var mood = mdv[0], setMood = mdv[1];
    var svv = useState((D.scenarios[init.state] || D.scenarios.authorized).subview); var subview = svv[0], setSubview = svv[1];
    var asv = useState(false); var assistant = asv[0], setAssistant = asv[1];

    useEffect(function () { save({ view: view, device: device, state: state, mood: mood }); }, [view, device, state, mood]);

    function selectState(k) { setState(k); var sc = D.scenarios[k]; if (sc && sc.subview) setSubview(sc.subview); }
    function jumpFromMap(stateKey, subKey) { setView('shell'); setState(stateKey); setSubview(subKey); }

    var topStrip = React.createElement('div', { style: { flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', background: '#15181e', borderBottom: '1px solid #262b34', color: '#e6e9ef', flexWrap: 'wrap' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em', whiteSpace: 'nowrap', flex: 'none' } },
        React.createElement('span', { style: { width: 22, height: 22, borderRadius: 6, background: '#2a63d6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 } }, 'S'),
        'Operational polish QA',
        React.createElement('span', { style: { fontSize: 11, fontWeight: 500, color: '#8b93a3', marginLeft: 2 } }, '· Slice 11')),
      React.createElement('div', { style: { flex: 1 } }),
      React.createElement(Seg, { label: 'Vista', value: view, onChange: setView, opts: [{ k: 'shell', t: 'Shell' }, { k: 'map', t: 'Mapa' }, { k: 'audit', t: 'Auditoría' }] }),
      view === 'shell' && React.createElement(Seg, { label: 'Device', value: device, onChange: setDevice, opts: [{ k: 'desktop', t: 'Desktop' }, { k: 'mobile', t: 'Mobile' }] }),
      view === 'shell' && React.createElement(Picker, { label: 'Estado', value: state, onChange: selectState, opts: STATES.map(function (x) { return { k: x.key, t: x.label }; }) }),
      React.createElement(Picker, { label: 'Mood', value: mood, onChange: setMood, opts: D.moods.map(function (m) { return { k: m.key, t: m.label }; }) }));

    var mainContent;
    if (view === 'map') mainContent = React.createElement(JourneyMapView, { onJump: jumpFromMap });
    else if (view === 'audit') mainContent = React.createElement(AuditBoardView, null);
    else mainContent = React.createElement(DesktopShellMain, { key: state, state: state, subview: subview, onNav: setSubview });

    var stage;
    if (view === 'shell' && device === 'mobile') {
      var s = D.scenarios[state];
      var phoneInner;
      if (s.loading) {
        phoneInner = React.createElement('div', { style: { padding: 14, display: 'grid', gap: 12 } }, [0, 1, 2, 3].map(function (i) { return React.createElement('div', { key: i, style: { height: i === 0 ? 96 : 60, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', opacity: 1 - i * 0.14 } }); }));
      } else if (s.backendError) {
        var e2 = D.backendErrorInfo;
        phoneInner = React.createElement(StateScreen, { icon: 'server', tone: 'danger', title: e2.title, meta: 'correlationId ' + e2.correlationId, actions: React.createElement(Btn, { variant: 'primary', size: 'sm', leading: 'refresh' }, 'Reintentar') }, e2.message);
      } else {
        phoneInner = React.createElement(MobileWorkspaceScreen, { key: state + subview, s: s, subview: subview, onNav: setSubview, onMood: function () { var keys = D.moods.map(function (m) { return m.key; }); setMood(keys[(keys.indexOf(mood) + 1) % keys.length]); } });
      }
      stage = React.createElement('div', { style: { height: '100%', display: 'grid', placeItems: 'center', padding: 20, overflow: 'auto' } },
        React.createElement('div', { 'data-mood': mood, className: 'ds-app', style: { width: 390, height: 820, maxHeight: '100%', borderRadius: 30, overflow: 'hidden', border: '10px solid #05070b', boxShadow: '0 24px 70px rgba(0,0,0,0.5)', position: 'relative', background: 'var(--app-bg)' } }, phoneInner));
    } else {
      stage = React.createElement('div', { 'data-mood': mood, className: 'ds-app', style: { height: '100%', display: 'flex', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' } },
        React.createElement(Sidebar, { products: D.products, activeKey: 'invoicing', user: D.user }),
        React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } },
          React.createElement(TopBar, { tenant: D.tenant, memberships: D.memberships, mood: mood, moods: D.moods, onMood: setMood, onAssistant: function () { setAssistant(true); } }),
          React.createElement('main', { style: { flex: 1, overflowY: 'auto', position: 'relative' } }, mainContent)),
        assistant && React.createElement(AssistantPanel, { assistant: D.assistant, onClose: function () { setAssistant(false); } }));
    }

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1115' } },
      topStrip,
      React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'hidden', background: view === 'shell' && device === 'mobile' ? '#1b1f27' : 'transparent' } }, stage));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
})();
