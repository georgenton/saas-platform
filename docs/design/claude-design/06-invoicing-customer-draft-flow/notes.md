# Slice 06 — design notes

Rationale, hierarchy decisions, guardrails, tensions and accessibility for the
Invoicing Customer + Draft Invoice Flow. Read alongside `README.md`. All
field/enum references are the real contract (`types.ts` / `api.ts` /
`workspace-customer-draft-flow.tsx`).

## 1 · The problem we were handed

`workspace-customer-draft-flow.tsx` is functionally correct but reads as **two
disconnected cards**: a customers card (an action cue + a create form + the
directory list) and a create-invoice card (a form, disabled until a customer
exists). For a small Ecuador operator creating their first invoice, that raises
two anxieties: *where do I start?* and *am I accidentally filing taxes?* The
handoff is explicit — make it a "friendly guided lane", not "a generic CRM
contact form or a technical tax wall", and never imply SRI submission this early.

The design goal: the operator should feel "I know where to start", "this system
understands Ecuador", "I can create a buyer and draft without fear", "this is
professional but simple", and "I'm not being pushed into SRI submission too
early".

## 2 · Hierarchy — one lane, one action at a time

The two cards become **three sequential steps** with a single dominant action
each, so cognitive load stays low:

1. **Comprador.** Choose an existing buyer or create one. The create form is the
   secondary path when a directory already exists (revealed by "Nuevo
   comprador"), and the *only* path — front and center — when there are none.
2. **Identidad fiscal.** A deliberate confirmation beat. The handoff's sequence
   is "identify the buyer → confirm buyer fiscal data → create draft", and this
   step is the "confirm" the raw component skips. It also teaches the Ecuador
   semantics (e.g. Consumidor final) without a wall of help text.
3. **Borrador.** Create the draft. Success is its own state that visually and
   verbally separates "draft created" from "buyer saved", and hands off to items.

A **stepper** makes progress legible; a persistent **right rail** keeps the whole
lane in view (so the single-step focus never feels like tunnel vision) and is
where the "this is not the SRI" reassurance lives permanently.

## 3 · Making Ecuador identification approachable

The five `identificationType` codes (`04`–`08`) are meaningless to a
non-accountant, so each is paired with a plain label and a one-line hint:

- `04 RUC` — empresa o negocio con RUC
- `05 Cédula` — persona natural ecuatoriana
- `06 Pasaporte` — extranjero con pasaporte
- `07 Consumidor final` — venta sin identificar al comprador
- `08 Exterior` — cliente fuera de Ecuador

The identification field's placeholder and hint adapt to the chosen type, and for
`07` the field is disabled with the well-known `9999999999999` rule explained
inline — turning a piece of tribal fiscal knowledge into a guided default.

## 4 · "Buyer saved" ≠ "draft created" ≠ "sent to SRI"

Three distinct moments, three distinct treatments:

- **Buyer saved** — the buyer joins the directory and becomes selectable; the
  stepper marks step 1 done (green). The create button says "Guardar comprador".
- **Draft created** — a success panel with the assembled number, status and item
  count, explicitly "todavía no se envía al SRI", next action *Agregar items*.
- **SRI submission** — *deliberately absent.* The rail and the draft step both
  state that creating a draft is not an emission/authorization. This is the
  hardest guardrail in the brief and it's enforced in copy, iconography
  (`shield` used only for the reassurance, never as a "submit" affordance) and by
  never rendering electronic-status fields (they're `null` at draft creation).

## 5 · Mood behavior

Every surface reads semantic tokens only, so all five moods re-theme the whole
lane — not just the background:

- **Forms & inputs** use `--surface` / `--border-strong` / `--control-h`, so
  calm gets airier controls, focus denser, high-contrast hairline-black borders;
  focus rings use the mood's `--focus-ring-shadow`, the focused border uses
  `--primary`.
- **Selected buyer** is `--primary-soft` + `--primary` border + a filled radio,
  re-toned per mood; **empty states / disabled draft / errors** use the
  status-soft families (`--warning-soft`, `--danger-soft`, `--info-soft` with
  their `--on-*` text), so a blocked draft is a strong amber in high-contrast and
  a gentle terracotta in calm.
- **Stepper medallions & rail** pull `--success` / `--primary` directly, so flow
  progress stays legible and correctly toned in every mood (including night's
  brighter ramp).
- **Navigation / chrome** carries its own `--sidebar-*` / `--topbar-*`
  personality per mood via the Platform Shell.

The mood switcher lives in the top bar (desktop) and a bottom sheet (mobile);
selection is frontend-only local state — backend persistence is future backlog.

## 6 · Interaction notes

- **Stepper navigation.** Completed and reachable steps are clickable; selecting
  a buyer advances to identity; "Confirmar" advances to draft; the success and
  disabled states offer explicit back/forward actions. Forms keep local state so
  typing and selecting feel real in the prototype.
- **Buyer selection** is a single tap on a directory row (radio semantics), which
  both records the buyer and moves the lane forward — no separate "continue".
- **Create-in-progress** disables inputs and swaps the button label
  ("Guardando comprador…" / "Creando factura…"), mapping to the component's
  `actionLoading === 'create-customer' | 'create-invoice'`.
- **Errors** are inline danger banners above the relevant form (duplicate RUC,
  duplicate number), never modal — the operator keeps their typed data.
- **Permission-limited** turns every create affordance into a disabled "Solo
  lectura" lock and shows a top banner naming the missing permission
  (`invoicing.manage`).

## 7 · Accessibility

- Status and selection are never color-only — the selected buyer adds a filled
  radio + check, the stepper adds numerals/checks, errors add an icon + written
  reason.
- **High-contrast** is a first-class state (near-black text, black hairline
  borders, no shadows, doubled focus ring) — verify the lane in it, not just
  comfort.
- All inputs are real `<label>` + control pairs with visible focus rings; the
  stepper buttons and buyer rows are real `<button>`s; selects keep a native
  control under a styled shell (keyboard + screen-reader friendly).
- Mono is reserved for true identifiers (RUC/cédula, invoice number); everything
  else is Manrope for warmth and legibility.
- Hit targets: desktop controls ≥ `--control-h`; mobile inputs 46px, buyer rows
  and the sticky primary action ≥ 46px and full-width for thumb reach.
- Motion is restrained (180ms color/background, no transforms) and respects
  `prefers-reduced-motion`.

## 8 · Tensions & decisions

- **Stepper vs. one long scroll.** A stepper risks hiding the draft form behind
  clicks. We mitigated with a persistent rail (the whole lane stays visible) and
  by auto-advancing on buyer selection, so the steps feel like momentum, not
  gates.
- **Identity as its own step.** The raw component has no confirm beat. We added
  one because the brief's sequence calls for "confirm buyer fiscal data" and
  because it's the natural place to teach Ecuador semantics — but it's a light,
  one-action step, not a second form.
- **How much of the directory to show.** No search/edit/merge endpoints exist for
  this slice, so the directory is a simple selectable list (not a data grid). If
  the directory grows, search is a future endpoint — we did not fake it.
- **Number field.** We show the `previewNumber` as a placeholder + hint ("vacío =
  se autogenera") rather than pre-filling it, matching the component's behavior
  and avoiding the implication that a number has been reserved/authorized.
- **No fake automation.** No "auto-create buyer from RUC lookup", no tax
  computation, no SRI status. The flow creates the commercial/fiscal starting
  point and stops there.
