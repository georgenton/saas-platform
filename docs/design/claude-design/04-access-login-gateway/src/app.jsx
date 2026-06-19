/* Interactive viewer — slice 04, Access / Login Gateway. Top strip switches
   device (desktop / mobile), state (the 8 access states) and design mood. The
   gateway resolves the session into the correct post-auth screen; flow actions
   are live (Continuar → verificando → listo). Persisted in localStorage. */
(function () {
  const { useState, useEffect } = React;
  const { AccessDesktop } = window.ACCESS;
  const { MobileAccess } = window.MobileAccess;
  const D = window.ACCESS_DATA;

  const STATES = [
    { key: 'gateway', label: 'Gateway (signed-out)' },
    { key: 'checking', label: 'Verificando sesión' },
    { key: 'backend-unavailable', label: 'Backend no disponible' },
    { key: 'invalid-token', label: 'Token inválido / expirado' },
    { key: 'invitation', label: 'Invitación pendiente' },
    { key: 'workspace-select', label: 'Selección de workspace' },
    { key: 'no-tenant', label: 'Sin espacio de trabajo' },
    { key: 'ready', label: 'Sesión lista · handoff' }
  ];

  const LS = 'access-slice-v1';
  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save(v) { try { localStorage.setItem(LS, JSON.stringify(v)); } catch (e) {} }

  function App() {
    const init = load();
    const [device, setDevice] = useState(init.device || 'desktop');
    const [state, setState] = useState(init.state || 'gateway');
    const [mood, setMood] = useState(init.mood || 'comfort');
    useEffect(() => { save({ device, state, mood }); }, [device, state, mood]);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1115' }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', background: '#15181e', borderBottom: '1px solid #262b34', color: '#e6e9ef', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em', whiteSpace: 'nowrap', flex: 'none' }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#2a63d6', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>S</span>
            Access / Login Gateway
            <span style={{ fontSize: 11, fontWeight: 500, color: '#8b93a3', marginLeft: 2 }}>· Slice 04</span>
          </div>
          <div style={{ flex: 1 }} />
          <Seg label="Device" value={device} onChange={setDevice} opts={[{ k: 'desktop', t: 'Desktop' }, { k: 'mobile', t: 'Mobile' }]} />
          <Picker label="Estado" value={state} onChange={setState} opts={STATES.map((s) => ({ k: s.key, t: s.label }))} />
          <Picker label="Mood" value={mood} onChange={setMood} opts={D.moods.map((m) => ({ k: m.key, t: m.label }))} />
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: device === 'mobile' ? '#1b1f27' : 'transparent' }}>
          {device === 'desktop' ? (
            <AccessDesktop d={D} state={state} onState={setState} mood={mood} moods={D.moods} onMood={setMood} />
          ) : (
            <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 20, overflow: 'auto' }}>
              <div style={{ width: 390, height: 788, maxHeight: '100%', borderRadius: 30, overflow: 'hidden', border: '10px solid #05070b', boxShadow: '0 24px 70px rgba(0,0,0,0.5)', position: 'relative' }}>
                <MobileAccess d={D} state={state} onState={setState} mood={mood} moods={D.moods} onMood={setMood} />
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
