# Access / Login Gateway — Design Notes

Design rationale for slice 04. Read `README.md` first for the screen tour. This
slice sits *before* the shell, so its whole job is restraint: resolve identity
calmly and hand off — never expose the product before access is real.

## 1. Two panes, one job each

The desktop gateway is a split: a **brand/trust panel** (left) and a **single
action card** (right). The split is deliberate, not decorative:

- The left panel answers "where am I and is this serious?" once, and then stays
  constant across every state — so the operator is never disoriented as the
  right side changes from gateway → checking → invitation → ready.
- The right card answers "what do I do now?" — and only ever shows **one**
  card with **one** dominant action.

This is why it reads as a premium product front desk rather than a developer
console: orientation is permanent, action is singular.

## 2. The hardest constraint — honesty without coldness

The backend has **no web login mutation** (no email/password, magic link, SSO,
reset). A naive premium login would fake those buttons. We don't. Instead:

- The **real** dominant action is `Continuar`, which inspects the session
  (`GET /api/auth/me`) and routes onward. It is honest and it works.
- Future providers appear as **non-interactive structure** under a
  "PRÓXIMAMENTE" divider — dashed border, reduced opacity, `aria-disabled`,
  a "Próximamente" tag, `cursor: not-allowed`. They communicate roadmap and
  shape without lying about capability.
- The **Bearer token** — the one thing that actually establishes a session today
  — is preserved but demoted to **"Acceso avanzado · ya tengo un token"**,
  collapsed by default. It is findable for QA/pilot operators and invisible to
  everyone else.

The tension the brief asked us to watch — *premium polish vs. backend honesty* —
is resolved by making roadmap visible as **structure**, never as **fake flow**.

## 3. One dominant action at a time

Every state has exactly one primary button: `Continuar` (gateway), `Reintentar`
(error), `Aceptar invitación` (invitation), a tenant row (workspace), `Entrar al
Command Center` (ready). Secondary affordances (advanced token, "Revisar
invitación", "Cerrar sesión") are always visually quieter. This is the core
anti-abandonment move: the operator never has to choose between competing calls
to action.

## 4. The flow is felt, not just switched

`Continuar`, `Usar token`, `Aceptar invitación` and choosing a workspace all run
a short inline **"verificando…"** state on the button itself (spinner + label
swap) before resolving to the **ready** handoff. This makes the bootstrap feel
real and reassuring rather than instant-and-magic. A dedicated full-card
`checking` state also exists for the cold-boot case (app opens with a token
already present and inspects the session before painting anything).

Timers are cleaned up on unmount; the dedicated `checking` state shown from the
switcher is static (no auto-advance) so reviewers can inspect it.

## 5. Routing after access resolves

Mirrors the handoff's navigation contract:

- `currentTenancy` present → **ready** handoff into the Command Center.
- pending invitation → prioritize **invitation review**.
- tenancies but no current one → **workspace selection**.
- session but no tenant at all → **no-tenant**, which *explains what's missing*
  (ask the Owner to invite this email) instead of dumping the product shell.

## 6. Mood system

Mood applies even here, signed-out — reachable from a corner **Apariencia**
control (desktop) and a bottom sheet (mobile). It retunes more than the
background:

- **Brand panel** reads the `--sidebar-*` chrome tokens, so it changes
  personality per mood (deep ink in comfort, charcoal in focus, light sage in
  calm, white-with-black-borders in high-contrast, near-black in night) — the
  navigation-chrome requirement, applied to the pre-shell brand surface.
- **Action card, inputs, buttons, banners, focus rings** read content tokens, so
  the whole gateway re-themes. **Night** is a true dark gateway (not an
  inversion); **high-contrast** leans on borders and the double focus ring.

## 7. Copy

Calm, confident, es-EC, addressed as `tú`: "Entra a tu espacio de trabajo",
"Verificamos tu sesión y te llevamos directo al lugar correcto", "¿Dónde quieres
trabajar hoy?". Labels EN where they're product nouns. Token/RUC/correo render in
IBM Plex Mono. Nothing is marketing; everything is operational reassurance.

## 8. Microinteractions that reduce friction

- **Inline button busy state** on every resolving action — progress is local and
  obvious, never a full-screen flash.
- **Advanced token disclosure** rotates its chevron and shifts to a sunken
  surface when open, so the "this is a deliberate, secondary path" feeling is
  explicit.
- **Subtle card entrance** (`acc-rise`) — a 9px translate only. Critically it
  does **not** animate opacity, so a background-tab (where browsers pause CSS
  animations) can never leave the card invisible. Respects
  `prefers-reduced-motion`.

## 9. Accessibility

- One dominant action; secondary actions are real `<button>`s/links with visible
  focus (`.ds-focusable` → mood focus ring; double ring in high-contrast).
- Disabled future methods carry `aria-disabled` and are not focusable affordances
  pretending to work.
- Disclosure toggles expose `aria-expanded`; the chevron rotation is a redundant,
  non-color affordance.
- Status never by color alone (session pill pairs dot + text; tones pair with
  labels). Mono values for token/RUC.
- Mobile hit targets ≥ 44px; bottom sheets are dismissible by scrim tap and an
  explicit close button.

## 10. Tensions flagged (premium vs. guardrails)

- **A rich login form vs. an honest one.** Premium SaaS onboarding usually leads
  with email/SSO. With no backend for it, we render those as roadmap structure
  and let the working `Continuar` + advanced token carry the real flow. The
  screen still *feels* like a real login without faking one.
- **Brand panel vs. "no marketing hero".** A left brand pane risks becoming a
  landing page. We constrained it to trust/orientation: one line, a quiet
  capability list (non-interactive), a compliance/region footer — no CTAs, no
  pricing, no testimonials.
- **Showing capability vs. not implying products are usable yet.** The capability
  chips are explicitly non-interactive context, visually distinct from anything
  clickable, so they never read as "enter this product".

## 11. Known mock-only affordances

`Continuar`, `Usar token`, `Aceptar invitación`, workspace selection, `Reintentar`
and `Entrar al Command Center` run the demo transition (→ ready) so reviewers can
feel the flow; the future-method rows and "Pegar" are intentionally inert. Real
wiring (session inspection, current-tenancy, invitation accept) is in
`integration-plan.md`. No login/magic-link/SSO/reset endpoints are invented.
