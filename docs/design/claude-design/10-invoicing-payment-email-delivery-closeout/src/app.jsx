/* Interactive viewer — slice 10, Invoicing Payment + Email Delivery Closeout.
   Top strip switches device (desktop / mobile), state (20 explicit states) and
   design mood. Panel mounts inside the real Platform Shell chrome. Selection
   persists in localStorage. */
(function () {
  var useState = React.useState, useEffect = React.useEffect;
  var UI = window.UI;
  var Btn = UI.Btn, AssistantPanel = UI.AssistantPanel, StateScreen = UI.StateScreen;
  var Chrome = window.Chrome;
  var Sidebar = Chrome.Sidebar, TopBar = Chrome.TopBar;
  var DesktopCloseout = window.Closeout.DesktopCloseout;
  var MobileCloseoutScreen = window.MobileCloseout.MobileCloseoutScreen;
  var D = window.CLOSEOUT_DATA;

  var STATES = [
    { key: 'no_invoice', label: '1 · Sin factura' },
    { key: 'loading', label: '2 · Cargando' },
    { key: 'invoice_draft', label: '3 · Factura en borrador' },
    { key: 'issued_open', label: '4 · Emitida · saldo abierto' },
    { key: 'no_email', label: '5 · Sin correo del cliente' },
    { key: 'email_ready', label: '6 · Correo listo' },
    { key: 'email_sending', label: '7 · Enviando correo' },
    { key: 'email_sent', label: '8 · Correo enviado' },
    { key: 'email_error', label: '9 · Error de correo' },
    { key: 'unpaid', label: '10 · Sin pagos' },
    { key: 'partial', label: '11 · Pago parcial' },
    { key: 'fully_paid', label: '12 · Factura pagada' },
    { key: 'payment_loading', label: '13 · Registrando pago' },
    { key: 'payment_error', label: '14 · Error de pago' },
    { key: 'one_payment', label: '15 · Un pago' },
    { key: 'multiple_payments', label: '16 · Varios pagos' },
    { key: 'reversed_payment', label: '17 · Pago revertido' },
    { key: 'reverse_loading', label: '18 · Revirtiendo pago' },
    { key: 'permission_limited', label: '19 · Permiso limitado' },
    { key: 'backend_unavailable', label: '20 · Backend no disponible' }
  ];

  var LS = 'invoicing-closeout-slice-v1';
  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save(v) { try { localStorage.setItem(LS, JSON.stringify(v)); } catch (e) {} }

  function Skeleton() {
    return React.createElement('div', { style: { padding: 'var(--gutter)', maxWidth: 1040, margin: '0 auto', display: 'grid', gap: 16 } },
      React.createElement('div', { style: { height: 30, width: 300, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' } }),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 } },
        React.createElement('div', { style: { display: 'grid', gap: 16 } }, [120, 70, 120, 160].map(function (h, i) { return React.createElement('div', { key: i, style: { height: h, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', opacity: 1 - i * 0.12 } }); })),
        React.createElement('div', { style: { display: 'grid', gap: 16 } }, [140, 200].map(function (h, i) { return React.createElement('div', { key: i, style: { height: h, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', opacity: 1 - i * 0.12 } }); }))));
  }

  function DesktopMain(props) {
    var state = props.state;
    if (state === 'loading') return React.createElement(Skeleton, null);
    if (state === 'backend_unavailable') {
      var e = D.backendErrorInfo;
      return React.createElement(StateScreen, { icon: 'server', tone: 'danger', title: e.title, meta: 'correlationId ' + e.correlationId, actions: React.createElement(Btn, { variant: 'primary', leading: 'refresh' }, 'Reintentar') }, e.message);
    }
    return React.createElement(DesktopCloseout, { s: D.scenarios[state] });
  }

  function Seg(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement('span', { style: { fontSize: 11, color: '#8b93a3', fontWeight: 600 } }, props.label),
      React.createElement('div', { style: { display: 'flex', background: '#0f1115', border: '1px solid #2b313c', borderRadius: 8, padding: 2 } },
        props.opts.map(function (o) { return React.createElement('button', { key: o.k, onClick: function () { props.onChange(o.k); }, style: { padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: props.value === o.k ? '#2a63d6' : 'transparent', color: props.value === o.k ? '#fff' : '#aab1bf' } }, o.t); })));
  }
  function Picker(props) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement('span', { style: { fontSize: 11, color: '#8b93a3', fontWeight: 600 } }, props.label),
      React.createElement('select', { value: props.value, onChange: function (e) { props.onChange(e.target.value); }, style: { background: '#0f1115', color: '#e6e9ef', border: '1px solid #2b313c', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } },
        props.opts.map(function (o) { return React.createElement('option', { key: o.k, value: o.k }, o.t); })));
  }

  function App() {
    var init = load();
    var dv = useState(init.device || 'desktop'); var device = dv[0], setDevice = dv[1];
    var stv = useState(init.state || 'issued_open'); var state = stv[0], setState = stv[1];
    var mdv = useState(init.mood || 'comfort'); var mood = mdv[0], setMood = mdv[1];
    var asv = useState(false); var assistant = asv[0], setAssistant = asv[1];
    useEffect(function () { save({ device: device, state: state, mood: mood }); }, [device, state, mood]);

    var topStrip = React.createElement('div', { style: { flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', background: '#15181e', borderBottom: '1px solid #262b34', color: '#e6e9ef', flexWrap: 'wrap' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em', whiteSpace: 'nowrap', flex: 'none' } },
        React.createElement('span', { style: { width: 22, height: 22, borderRadius: 6, background: '#2a63d6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 } }, 'S'),
        'Payment + email closeout',
        React.createElement('span', { style: { fontSize: 11, fontWeight: 500, color: '#8b93a3', marginLeft: 2 } }, '· Slice 10')),
      React.createElement('div', { style: { flex: 1 } }),
      React.createElement(Seg, { label: 'Device', value: device, onChange: setDevice, opts: [{ k: 'desktop', t: 'Desktop' }, { k: 'mobile', t: 'Mobile' }] }),
      React.createElement(Picker, { label: 'Estado', value: state, onChange: setState, opts: STATES.map(function (x) { return { k: x.key, t: x.label }; }) }),
      React.createElement(Picker, { label: 'Mood', value: mood, onChange: setMood, opts: D.moods.map(function (m) { return { k: m.key, t: m.label }; }) }));

    var stage;
    if (device === 'desktop') {
      stage = React.createElement('div', { 'data-mood': mood, className: 'ds-app', style: { height: '100%', display: 'flex', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' } },
        React.createElement(Sidebar, { products: D.products, activeKey: 'invoicing', user: D.user }),
        React.createElement('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' } },
          React.createElement(TopBar, { tenant: D.tenant, memberships: D.memberships, mood: mood, moods: D.moods, onMood: setMood, onAssistant: function () { setAssistant(true); } }),
          React.createElement('main', { style: { flex: 1, overflowY: 'auto', position: 'relative' } },
            React.createElement(DesktopMain, { key: state, state: state }))),
        assistant && React.createElement(AssistantPanel, { assistant: D.assistant, onClose: function () { setAssistant(false); } }));
    } else {
      var phoneInner;
      if (state === 'loading') {
        phoneInner = React.createElement('div', { style: { padding: 14, display: 'grid', gap: 12 } }, [0, 1, 2, 3].map(function (i) { return React.createElement('div', { key: i, style: { height: i === 0 ? 96 : 60, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', opacity: 1 - i * 0.14 } }); }));
      } else if (state === 'backend_unavailable') {
        var e2 = D.backendErrorInfo;
        phoneInner = React.createElement(StateScreen, { icon: 'server', tone: 'danger', title: e2.title, meta: 'correlationId ' + e2.correlationId, actions: React.createElement(Btn, { variant: 'primary', size: 'sm', leading: 'refresh' }, 'Reintentar') }, e2.message);
      } else {
        phoneInner = React.createElement(MobileCloseoutScreen, { key: state, s: D.scenarios[state], mood: mood, onMood: setMood });
      }
      stage = React.createElement('div', { style: { height: '100%', display: 'grid', placeItems: 'center', padding: 20, overflow: 'auto' } },
        React.createElement('div', { 'data-mood': mood, className: 'ds-app', style: { width: 390, height: 800, maxHeight: '100%', borderRadius: 30, overflow: 'hidden', border: '10px solid #05070b', boxShadow: '0 24px 70px rgba(0,0,0,0.5)', position: 'relative', background: 'var(--app-bg)' } }, phoneInner));
    }

    return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1115' } },
      topStrip,
      React.createElement('div', { style: { flex: 1, minHeight: 0, overflow: 'hidden', background: device === 'mobile' ? '#1b1f27' : 'transparent' } }, stage));
  }

  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
})();
