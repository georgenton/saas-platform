/* Viewer chrome + orchestration for the Product Command Center slice. Switch
   device (desktop / mobile), shell state, and design mood. The mood applies to
   the device preview only; the viewer chrome stays neutral. Selection persists
   in localStorage. The Command Center mounts inside the Platform Shell chrome —
   the sidebar, top bar and tenant context never disappear. */
(function () {
  const { useState, useEffect } = React;
  const D = window.CC_DATA;
  const { Btn, Banner, MoodSwatch, AssistantPanel } = window.UI;
  const { Sidebar, TopBar } = window.Chrome;
  const { CommandCenter, EmptyWorkspace, CommandCenterLoading, CommandCenterError } = window.CC;
  const { MobileShell } = window.MobileApp;

  const STATES = [
    { key: 'ready', label: 'Authenticated · Command Center' },
    { key: 'permission-limited', label: 'Permission-limited highlighted' },
    { key: 'empty', label: 'Empty workspace (new tenant)' },
    { key: 'dev-banner', label: 'Local / dev banner' },
    { key: 'loading', label: 'Loading workspace' },
    { key: 'backend-unavailable', label: 'Backend unavailable' }
  ];

  function DesktopContent({ state }) {
    if (state === 'loading') return <CommandCenterLoading />;
    if (state === 'empty') return <EmptyWorkspace d={D} onMarketplace={() => {}} />;
    if (state === 'backend-unavailable') return <CommandCenterError d={D} />;
    let banner = null;
    if (state === 'dev-banner') banner = <Banner tone="warning" icon="alert" title="Local / dev environment" onDismiss={() => {}}>{'Conectado a ' + D.env.apiBaseUrl + ' · los datos son de prueba.'}</Banner>;
    if (state === 'permission-limited') banner = <Banner tone="info" icon="eye" title="2 productos con permiso limitado" action={<Btn size="sm" variant="secondary">Solicitar permisos</Btn>}>Tax Compliance EC y AI Console: tienes acceso parcial. Puedes ver, pero no operar al 100% hasta que el Owner conceda los permisos.</Banner>;
    return <CommandCenter d={D} banner={banner} onMarketplace={() => {}} />;
  }

  function DesktopView({ state, mood, onMood }) {
    const [assistantOpen, setAssistantOpen] = useState(false);
    return (
      <div data-mood={mood} style={{ position: 'relative', height: '100%', display: 'flex', background: 'var(--app-bg)', color: 'var(--text)', overflow: 'hidden' }}>
        <Sidebar products={D.nav} activeKey="command-center" onNav={() => {}} onMarketplace={() => {}} user={D.user} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <TopBar tenant={D.tenant} memberships={D.memberships} section="Command Center" mood={mood} moods={D.moods} onMood={onMood} onAssistant={() => setAssistantOpen(true)} showTenantMenu />
          <main style={{ flex: 1, overflowY: 'auto', background: 'var(--app-bg)' }}>
            <DesktopContent state={state} />
          </main>
        </div>
        {assistantOpen && <AssistantPanel assistant={D.assistant} onClose={() => setAssistantOpen(false)} />}
      </div>
    );
  }

  function App() {
    const [device, setDevice] = useState(() => localStorage.getItem('cc.device') || 'desktop');
    const [state, setState] = useState(() => localStorage.getItem('cc.state') || 'ready');
    const [mood, setMood] = useState(() => localStorage.getItem('cc.mood') || 'comfort');
    useEffect(() => { localStorage.setItem('cc.device', device); }, [device]);
    useEffect(() => { localStorage.setItem('cc.state', state); }, [state]);
    useEffect(() => { localStorage.setItem('cc.mood', mood); }, [mood]);

    const seg = (val, cur, set, label) => (
      <button key={val} onClick={() => set(val)} className="ds-focusable" style={{ padding: '6px 12px', border: 'none', cursor: 'pointer', borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', color: cur === val ? '#0c1014' : '#6b7686', background: cur === val ? '#fff' : 'transparent', boxShadow: cur === val ? '0 1px 2px rgba(0,0,0,0.10)' : 'none' }}>{label}</button>
    );

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#eef1f4', fontFamily: 'var(--font-sans)' }}>
        <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e4e8ed', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: '#2a63d6', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>S</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#161b21' }}>Product Command Center</span>
            <span style={{ fontSize: 12, color: '#6b7686' }}>· Slice 01</span>
          </div>
          <div style={{ display: 'inline-flex', gap: 2, padding: 3, background: '#f6f8fa', borderRadius: 8, border: '1px solid #e4e8ed' }}>
            {seg('desktop', device, setDevice, 'Desktop')}{seg('mobile', device, setDevice, 'Mobile')}
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7686' }}>State
            <select value={state} onChange={(e) => setState(e.target.value)} className="ds-focusable" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: '#161b21', background: '#fff', border: '1px solid #d6dbe2', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
              {STATES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#6b7686' }}>Mood</span>
            <div style={{ display: 'inline-flex', gap: 4 }}>
              {D.moods.map((m) => (
                <button key={m.key} title={m.label} onClick={() => setMood(m.key)} className="ds-focusable" style={{ padding: 3, borderRadius: 7, cursor: 'pointer', border: `1px solid ${mood === m.key ? '#2a63d6' : '#e4e8ed'}`, background: mood === m.key ? '#eef3fd' : '#fff', display: 'inline-flex' }}>
                  <MoodSwatch mood={m.key} size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'grid', placeItems: device === 'mobile' ? 'center' : 'stretch', padding: device === 'mobile' ? 20 : 0 }}>
          {device === 'desktop' ? (
            <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}><DesktopView state={state} mood={mood} onMood={setMood} /></div>
          ) : (
            <div data-mood={mood} style={{ width: 390, height: 780, maxHeight: '100%', borderRadius: 30, border: '10px solid #11161b', background: 'var(--app-bg)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(8,12,18,0.32)', position: 'relative' }}>
              <MobileShell d={D} state={state} mood={mood} onMood={setMood} />
            </div>
          )}
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
