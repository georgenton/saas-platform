# Invoicing Workspace — Design Notes

Design rationale for slice 02. Read `README.md` first for the screen tour.

## 1. Anti-overwhelm system

The brief's hardest constraint: a workspace that is **rich and premium yet
cognitively light** for a non-accountant operator in Ecuador. The layout is a
strict vertical hierarchy of *decreasing urgency*, never competing panels:

```
1  Status hero      one headline + one action   ← "where do I start?"
2  Readiness ribbon four dots, one line each     ← "what's ready / blocked?"
   (Configuración SRI is collapsed behind a toggle — progressive disclosure)
3  Portfolio metrics four numbers                ← "how am I doing?"
4  Queue ⟷ Detail   scan list + focused panel    ← "do the work"
```

Only **one** thing is ever the loudest: the hero's primary button. Everything
else is calm. The full SRI configuration (24 fields across 4 cards) is hidden by
default and only auto-opens when there is a blocker to resolve — the operator
sees settings *when they're relevant*, not as a landing wall.

## 2. System status ≠ legal status

The single most important compliance idea. Two rows in the detail panel are
always distinct:

- **Condición del documento** — our system's view: *Borrador* or *Emitido*.
- **Condición electrónica (SRI)** — the legal/SRI artifact stage.

The lifecycle **stepper** (Borrador → Generado → Enviado → Autorizado) is the
emotional anchor: the operator always sees *exactly* how far a document has
travelled. A `submitted` invoice stops at **Enviado** with copy "El SRI está
procesando… Aún no está autorizada" — we never light the Autorizado node until
the backend returns authorization. A `rejected` invoice marks the Enviado node
red and shows the SRI code, field and a plain-language fix.

This is the guardrail "do not imply SRI authorization before the backend says
so", expressed as visual structure rather than a disclaimer.

## 3. Readiness is derived, calm, and actionable

`getReadiness(data, state)` composes four pillars from the electronic-profile /
signature-inspection / submission / numbering surfaces and computes `ready` +
`blockers[]`. It is **never assumed** — if a pillar is missing the ribbon shows a
warning dot and the next-step buttons that depend on it are disabled. Blockers
read as "what + why + how to fix" ("Tu firma electrónica caducó… renueva el
certificado"), never a raw error.

Pillar tones: green = listo, amber = atención, red = bloqueante, gray = pendiente
(no issuer yet). The same four pillars render as a one-line ribbon (glance), as
stacked rows on mobile, and as full cards in the configuration panel — one model,
three densities.

## 4. Mood system

Every surface reads semantic tokens only, so the five moods retune the whole
workspace, not just the background:

- **comfort** — default; white cards on a quiet field, deep-ink sidebar.
- **focus** — denser rows, grayer field so the queue and cards pop.
- **calm** — softer surfaces + gentle teal accent for long SRI/compliance
  sessions; airier rows.
- **high-contrast** — borders do the work, no shadows, thick focus ring.
- **night** — full dark shell; status tones (success/warning/danger) preserved so
  the readiness ribbon and pills still read at a glance.

The stepper, pills, dots and banners all derive from `--success/-warning/-danger/
-info` (+ soft), so compliance signalling survives every mood including night.

## 5. Copy

Labels English (`Invoicing`, product names), microcopy Spanish es-EC, addressed
as `tú`. Operational, never marketing: "Tu facturación está al día", "El SRI está
procesando este documento", "Devuelta por el SRI con observaciones". Money,
RUC, document numbers and access keys use **IBM Plex Mono** + tabular figures;
Ecuador formatting (`$49,286.40`, `RUC 1790012345001`, `001-001-000148`,
49-digit clave de acceso).

AI is suggestion-first everywhere: the assistant "revisó tu cola", "preparo el
resumen", with the standing line "No genera, envía ni autoriza ningún documento
sin tu aprobación."

## 6. Cross-product awareness (quiet)

An authorized invoice shows a small footer strip "Alimenta a → Accounting · Tax
Compliance". That is the *only* cross-product surface — enough to signal invoicing
is part of a bigger operating system, without turning the workspace into a
multi-product dashboard. The assistant also offers a "preparar resumen de IVA
para el handoff a Tax Compliance" suggestion.

## 7. Accessibility

- Mood `high-contrast` meets the system's strong-border / double-focus contract.
- Status is never carried by color alone: every pill pairs a tone with a text
  label and a dot; the stepper uses check / dot / × glyphs.
- All interactive rows/buttons are `.ds-focusable` (mood focus ring); the queue
  rows are real `<button>`s; hit targets ≥ 44px on mobile cards and tabs.
- `currentColor` icons inherit text/accent per mood.

## 8. Known mock-only affordances

Buttons (Generar, Enviar al SRI, Consultar autorización, Renovar firma, Nueva
factura, etc.) are present as the intended actions but are inert in this
prototype. `POST submit` / `check-authorization` / invoice creation are the real
endpoints they wire to — see `integration-plan.md`. The "Add products" /
marketplace, tenant switch and notifications come from the shell and are
non-functional here.
