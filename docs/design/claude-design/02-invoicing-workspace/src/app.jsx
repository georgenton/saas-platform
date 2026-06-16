/* Interactive viewer for the Invoicing workspace slice. Top control strip
   switches device (desktop / mobile), state, and design mood. Below it, the
   workspace mounts inside the Platform Shell chrome. Selection persists in
   localStorage. */
(function () {
  const { useState, useEffect } = React;
  const Icon = window.Icon;
  const { Btn, AssistantPanel, StateScreen } = window.UI;
  const { Sidebar, TopBar } = window.Chrome;
  const { DesktopWorkspace } = window.INV;
  const { MobileWorkspace } = window.MobileInv;
  const D = window.INV_DATA;

  const STATES = [
    { key: 'operating', label: 'Al día (operando)' },
    { key: 'no-issuer', label: 'Sin perfil de emisor' },
    { key: 'no-invoices', label: 'Sin facturas' },
    { key: 'readiness-blocked', label: 'Firma caducada (bloqueado)' },
    { key: 'permission-limited', label: 'Permiso limitado' },
    { key: 'backend-unavailable', label: 'Backend no disponible' },
    { key: 'loading', label: 'Cargando' }
  ];

  const LS = 'inv-slice-v1';
  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save(v) { try { localStorage.setItem(LS, JSON.stringify(v)); } catch (e) {} }

  function DesktopMain({ state }) {
    if (state === 'loading') {
      return (
        <div style={{ padding: 24, display: 'grid', gap: 18, maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ height: 132, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>{[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 92, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' }} />)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 16 }}>
            <div style={{ height: 360, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' }} />
            <div style={{ height: 360, borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)' }} />
          </div>
        </div>
      );
    }
    if (state === 'backend-unavailable') {
      return <StateScreen icon="server" tone="danger" title={D.backendError.title} meta={'correlationId ' + D.backendError.correlationId} actions={<Btn variant="primary" leading="refresh">Reintentar</Btn>}>{D.backendError.message}</StateScreen>;
    }
    return <DesktopWorkspace d={D} state={state} />;
  }

  function App() {
    const init = load();
    const [device, setDevice] = useState(init.device || 'desktop');
    const [state, setState] = useState(init.state || 'operating');
    const [mood, setMood] = useState(init.mood || 'comfort');
    const [assistant, setAssistant] = useState(false);

    useEffect(() => { save({ device, state, mood }); }, [device, state, mood]);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1115' }}>
        {/* control strip */}
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', background: '#15181e', borderBottom: '1px solid #262b34', color: '#e6e9ef', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em' }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#2a63d6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>S</span>
            Invoicing workspace
            <span style={{ fontSize: 11, fontWeight: 500, color: '#8b93a3', marginLeft: 2 }}>· Slice 02</span>
          </div>
          <div style={{ flex: 1 }} />
          <Seg label="Device" value={device} onChange={setDevice} opts={[{ k: 'desktop', t: 'Desktop' }, { k: 'mobile', t: 'Mobile' }]} />
          <Picker label="Estado" value={state} onChange={setState} opts={STATES.map((s) => ({ k: s.key, t: s.label }))} />
          <Picker label="Mood" value={mood} onChange={setMood} opts={D.moods.map((m) => ({ k: m.key, t: m.label }))} />
        </div>

        {/* stage */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: device === 'mobile' ? '#1b1f27' : 'transparent' }}>
          {device === 'desktop' ? (
            <div data-mood={mood} className="ds-app" style={{ height: '100%', display: 'flex', background: 'var(--app-bg)', position: 'relative', overflow: 'hidden' }}>
              <Sidebar products={D.products} activeKey="invoicing" user={D.user} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <TopBar tenant={D.tenant} memberships={D.memberships} mood={mood} moods={D.moods} onMood={setMood} onAssistant={() => setAssistant(true)} />
                <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                  <DesktopMain key={state} state={state} />
                </main>
              </div>
              {assistant && <AssistantPanel assistant={D.assistant} onClose={() => setAssistant(false)} />}
            </div>
          ) : (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 20, overflow: 'auto' }}>
              <div data-mood={mood} className="ds-app" style={{ width: 390, height: 788, maxHeight: '100%', borderRadius: 30, overflow: 'hidden', border: '10px solid #05070b', boxShadow: '0 24px 70px rgba(0,0,0,0.5)', position: 'relative', background: 'var(--app-bg)' }}>
                <MobileWorkspace key={state} d={D} state={state} mood={mood} onMood={setMood} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function Seg({ label, value, onChange, opts }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#8b93a3', fontWeight: 600 }}>{label}</span>
        <div style={{ display: 'flex', background: '#0f1115', border: '1px solid #2b313c', borderRadius: 8, padding: 2 }}>
          {opts.map((o) => (
            <button key={o.k} onClick={() => onChange(o.k)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: value === o.k ? '#2a63d6' : 'transparent', color: value === o.k ? '#fff' : '#aab1bf' }}>{o.t}</button>
          ))}
        </div>
      </div>
    );
  }
  function Picker({ label, value, onChange, opts }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#8b93a3', fontWeight: 600 }}>{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ background: '#0f1115', color: '#e6e9ef', border: '1px solid #2b313c', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {opts.map((o) => <option key={o.k} value={o.k}>{o.t}</option>)}
        </select>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
