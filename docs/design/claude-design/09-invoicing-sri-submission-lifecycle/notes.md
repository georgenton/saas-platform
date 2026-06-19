# Slice 09 — design notes

Rationale, the critical guardrail, hierarchy, mood behavior and accessibility for
the SRI Submission Lifecycle. Read alongside `README.md`. All field/enum
references are the real contract (`types.ts` / `api.ts` / `workspace-electronic.tsx`).

## 1 · The problem we were handed

`InvoicingElectronicStatusPanel` already has the right *logic* (a `buildNextStep`
recommendation, a stepper, manual + fallback disclosures, a technical trace) but
presents as a dense integration console: a status triad, two compact "advanced"
cards always visible, and forms that can make submission, manual status edits and
the presigned fallback feel equally weighted. For an Ecuador operator this raises
anxiety — *did I just authorize something? is "enviado" the same as "válido"? am
I supposed to use the fallback?* The handoff asks for a calm legal-status
assistant with **one safe recommendation at a time**.

## 2 · The critical guardrail — "submitted" ≠ "authorized"

This is the load-bearing rule and it is enforced in three independent places so
no single copy change can break it:

- **Verdict header** keys off `electronicStatus`. `submitted` → warning tone,
  title "Enviado al SRI", legal line "Enviado NO significa autorizado — la
  validez legal llega solo con la autorización." Only `authorized` → success
  tone + "El comprobante es legalmente válido."
- **Stepper** marks the Autorizado node complete only for `authorized`.
  `submitted` keeps it at the warning "en curso" middle node; `rejected` turns
  the middle node into a red "Devuelto".
- **Evidence** shows the authorization number as a real value only when
  authorized; while submitted it reads "Disponible al autorizar". The access key
  can exist earlier (it's derivable), so it shows once present — but it is never
  presented as proof of authorization.

The recommended next step for `submitted` is **Consultar autorización**, never a
celebratory or "done" affordance.

## 3 · Hierarchy — verdict → stepper → one step → evidence → message → advanced → trace

Top to bottom in decreasing urgency and increasing technical depth, matching the
handoff's preferred order. The first three blocks answer "what does this mean and
what do I do next?"; everything below is evidence and escape hatches.

- **One recommended next step.** Exactly one primary button, derived from
  `electronicStatus` + `canSubmitElectronicDocument` +
  `documentSupport.submitSupported` (mirrors the repo's `buildNextStep`). A single
  secondary action (usually "Ver XML preliminar") sits beside it; everything else
  is in the advanced disclosures.
- **Evidence** is compact and copy-friendly (operators paste the 49-digit clave
  and the authorization number into the SRI portal and into accounting).
- **Blocker / SRI message** surfaces the readiness blocker copy or the returned
  SRI observation (`electronicStatusMessage`) in plain language above the
  advanced controls.

## 4 · Secondary / advanced, deliberately quiet

- **Intervención manual** (status update / reconciliation) is a collapsed
  disclosure. It auto-opens only for `submitted` / `rejected` (where reconciling a
  real SRI response is plausible), mirroring the component's
  `showManualControl` default — but it is never the headline.
- **Fallback XML prefirmado** is a separate collapsed disclosure tagged
  "Secundario", with explicit copy that it's for sandbox validation with an
  external signature while native XAdES evolves — not the operator's normal path.
  It auto-opens only when an unsupported document type forces it or a presigned
  XML is already present.
- **Historial técnico** (the `InvoicingTechnicalTracePanel`) is the quietest
  block: a collapsed event list with provider status, SOAP/endpoint, diagnostics
  and structured SRI messages, for support and diagnosis only.

## 5 · Mood behavior

Every surface reads semantic tokens, so all five moods re-theme the whole lane:

- **Legal verdict** uses the status-soft families (`--success/-soft`,
  `--warning/-soft`, `--danger/-soft`, neutral) with a left accent — so the legal
  meaning stays correctly toned and legible (strong in high-contrast, gentle in
  calm, luminous on dark in night).
- **Stepper** nodes pull `--success` / `--warning` / `--danger` / `--text-subtle`
  directly; the connector fills with `--success` as steps complete.
- **Blockers / rejected** use `--danger` + `--danger-soft`; the **SRI message**
  card uses a full danger treatment.
- **Evidence cards** use `--surface-sunken` mono; **manual / fallback panels**
  use `--surface` form controls with `--border-strong` and `--primary` focus;
  **technical trace** uses sunken evidence surfaces. All re-tone per mood.

The mood switcher lives in the top bar (desktop) and a bottom sheet (mobile).

## 6 · Interaction notes

- **Primary action** swaps to a loading label from `actionLoading`
  ('submit-invoice-electronic-document' → "Firmando y enviando…",
  'check-invoice-electronic-authorization' → "Consultando…",
  'load-invoice-xml-preview' → "Cargando XML…"). When the recommended action is
  "open manual/fallback" it expands the disclosure rather than calling a backend.
- **Check-authorization** is offered only while `submitted` (the real component
  disables it otherwise) — the lane reflects that by recommending it exactly in
  that state.
- **Manual & fallback submit controls** carry the component's exact disabled
  rules (`status === 'draft'`, `!canSubmitElectronicDocument`, empty presigned
  XML, matching `actionLoading`).
- **Mobile** keeps the verdict at the top and the single primary action pinned at
  the bottom; manual/fallback/trace open as bottom sheets so the verdict and the
  recommended step are never buried.

## 7 · Accessibility

- Legal status is never color-only — the verdict pairs tone with an icon and the
  explicit legal sentence; the stepper uses numerals/checks/“!”; the rejected
  message is written out.
- **High-contrast** is first-class (near-black text, hairline borders, no shadows,
  doubled focus ring) — verify the verdict, stepper and access-key block in it.
- All actions are real `<button>`s with text that reflects loading/disabled;
  disclosures expose `aria-expanded`; evidence is selectable text with copy
  buttons.
- Mono is reserved for identifiers (number, access key, authorization number,
  references); everything else is Manrope.
- Hit targets: desktop controls ≥ `--control-h`; mobile sheet rows and the sticky
  primary action are full-width ≥ 44px.
- Motion is restrained (180ms color/background, chevron rotate) and respects
  `prefers-reduced-motion`.

## 8 · Tensions & decisions

- **One action vs. all actions visible.** The real component shows submit, check,
  manual and fallback controls fairly close together. We demoted everything except
  the single state-appropriate action into advanced disclosures — the biggest
  anxiety-reducer, and faithful to `buildNextStep`'s intent.
- **Showing the access key early.** It can exist before authorization, so we show
  it when present but never let it imply authorization (authorization number stays
  "Disponible al autorizar" until `authorized`).
- **Manual reconciliation framing.** It's a real, necessary tool, but presenting
  it as daily operation would invite unsafe manual status flips. We auto-open it
  only for submitted/rejected and label it clearly as intervention.
- **No new powers.** The lane never implies it can regenerate, re-sign, certify or
  file. Every such concept is either a real handler (with its real label) or
  absent.
