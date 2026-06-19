# Invoicing Operational Polish QA — Slice 11

The **coherence + QA pass** over the whole Invoicing frontend. Slices 02/03 and
05–10 each designed one surface well; this slice answers the question the handoff
(`docs/frontend-handoff/12-invoicing-operational-polish-qa.md`) actually asks:

> "¿Puede un operador de Ecuador/LATAM moverse por Invoicing con confianza, sin
> sentirse abrumado, abandonado ni castigado por la complejidad?"

It is **design only**. No backend behavior, endpoints, fields, delivery
channels, tax filing, accounting posting, gateway or reconciliation are invented.
Everything reuses contracts already shaped in prior slices.

> Open `index.html`. The top strip switches **Vista** (Shell · Mapa ·
> Auditoría), **Device** (desktop / mobile), **Estado** (13 states) and **Mood**
> (5). Selection persists in `localStorage`.

---

## What this slice delivers

The handoff names four deliverables. The viewer maps one tab to each:

1. **Shell — the final polished Invoicing workspace.** One product workspace that
   unifies every subview under a single rhythm: a one-line **product header** (no
   duplicate `<h1>`), the seven-stage **subview navigation** with a 3px active
   rail, a persistent **context summary strip** (invoice number/buyer/total + the
   SRI · Entrega · Pago triad), exactly **one recommended next step**, and the
   **active subview** rendered in distilled, on-brand form. The state switcher
   drives which subview is in focus and what the context says.
2. **Mapa — the Invoicing Experience Map.** Command Center → Configurar SRI →
   Cliente/Borrador → Ítems → Revisión → Lifecycle SRI → Entrega/Cobro. Each
   stage states *where the operator is*, *the one safe next action*, and *the
   coherence rule the UI must honor* there. Click any stage to open it in the
   Shell.
3. **Auditoría — the Visual Coherence Audit.** 14 findings grouped by region,
   each tagged **usabilidad / móvil / cosmético** and **coincide / parcial / no
   coincide**, naming the exact component and the precise fix — plus the
   recommended **PR order** and a **mobile-first QA checklist**. Actionable for
   Codex, not generic commentary. (Full prose audit lives in `notes.md`.)
4. **Cross-subview states + mobile.** Every required state, on desktop and a
   purpose-built mobile flow.

---

## The coherence model

The whole point is that the seven Invoicing subviews stop feeling like
stitched-together utility forms. Three devices make them feel like one product:

- **Subview navigation** — the lane in journey order: `Resumen · Emisor · SRI ·
  Cliente · Ítems · Revisión · SRI · Entrega y cobro`, active state via the
  NavItem 3px rail + tint (never a heavy fill).
- **Context summary strip** — persistent across subviews so the operator always
  knows *which* invoice they're working and its three independent truths.
- **One recommended next step** — derived from state, a single dominant action.
  Everything else (revert, manual SRI intervention, technical trace) is secondary.

### The critical guardrail (carried from slices 09 / 10)

**SRI authorization, delivery and payment are three independent truths.** The
triad renders all three side by side with the caption *"Tres verdades
independientes."* `submitted` reads **"Enviado al SRI"** in amber — never green,
never "autorizado". Only backend-confirmed `authorized` is green. The closeout
evidence card is an evidence hint only: it never declares taxes or posts
accounting entries.

---

## States designed (13 + device toggle)

`operating` (configurado y operando) · `missing_setup` (falta emisor/SRI) ·
`draft_in_progress` · `issued_pending_sri` · `submitted_pending` (enviada ≠
autorizada) · `authorized` · `rejected` (con observación del SRI) ·
`open_balance` · `fully_paid` · `permission_limited` (solo lectura) ·
`empty_workspace` · `loading` (skeleton) · `backend_unavailable`. The **Device**
toggle renders every applicable state in the purpose-built mobile flow.

## Mobile is purpose-built (not a shrunk desktop)

It demonstrates the exact fixes the audit calls for: the SRI/Entrega/Pago triad
**stacks to one column**, the queue is **single-column cards** (never a
horizontal table), long recommended steps **wrap**, the primary action is
**pinned for the thumb**, the subview strip **scrolls horizontally without
clipping**, and technical traces stay collapsed.

## Real functional scope

No endpoint is added. The slice only re-presents surfaces already wired in slices
02/05–10 (`reports/summary`, `invoices`, `invoices/{id}`, the four
`electronic-*` / `numbering` readiness reads, `send-email`, `payments`,
`electronic-document/*`). See `integration-plan.md` for the wiring and
`components.md` for the component map against the real boundaries.

## Files

```
index.html                 shell + script order + @dsCard / @startingPoint
src/data.js                window.QA_DATA — shell context · 13 states · subviews ·
                           experience map · audit findings + PR plan · QA checklist
src/icons.jsx              window.Icon (shared, Lucide geometry)
src/components.jsx         window.UI primitives (shared)
src/chrome.jsx             window.Chrome shell (shared)
src/workspace.jsx          window.Workspace — desktop polished shell + subview focus
src/map.jsx                window.JourneyMap — the experience map
src/audit.jsx              window.AuditBoard — coherence audit + PR plan + QA
src/workspace-mobile.jsx   window.MobileWorkspace — purpose-built mobile flow
src/app.jsx                view / device / state / mood viewer
mock-data/                 invoice-detail · electronic-readiness · reports-summary
README.md notes.md components.md integration-plan.md
```

See `notes.md` for the full actionable audit and PR order.
