# Slice 05 — design notes

Rationale, hierarchy decisions, guardrails, tensions and accessibility for the
Invoicing Settings · SRI preparation surface. Read alongside `README.md`. All
field/enum references are the real contract (`types.ts` / `workspace-settings.tsx`).

## 1 · The problem we were handed

`workspace-settings.tsx` is functionally correct but renders as **four
equally-weighted forms** stacked vertically — issuer, numbering, signature,
submission — each a flat `styles.field` grid. For an Ecuador operator preparing
electronic invoicing that is intimidating: every field looks equally urgent, the
legally serious bits (certificate validity, RUC↔certificate alignment) carry the
same weight as a phone number, and nothing answers *are we actually ready to
emit?* The handoff calls this out explicitly: avoid "a giant wall of equal-weight
fields", make it "guided, calm, premium, and not a technical wall".

## 2 · Hierarchy — decreasing urgency

The whole layout is one gradient of urgency, and the readiness question is
answered **before** the four forms.

1. **Readiness at a glance.** A verdict strip + sandbox-tier chip + four-pillar
   row is the first thing rendered. Environment (Producción / Pruebas) is always
   on the strip — you must never be unsure which environment you're configuring.
2. **Recommended next action.** Exactly one tonal cue carrying the contract's
   own `recommendedNextStep`, with one primary button. It softens to a secondary
   "ir a facturas" only when the top sandbox tier is reached and there are no
   warnings.
3. **Most important area, surfaced.** The derived recommended section gets a
   colored outline + elevated shadow, so when you read "renueva tu firma" and
   look down, the firma card is visually picked out of the four.
4. **Deeper evidence on demand.** Certificate inspection, SOAP endpoints, the
   sandbox ladder and the support matrix are collapsed behind rotate-chevron
   disclosures. The only ones that auto-open are the ones a problem demands
   (expired/invalid cert inspection; the sandbox ladder when remote is blocked
   but the gateway is configured; the matrix when everything is ready).

## 3 · Why the sandbox ladder, not a binary "ready"

The backend doesn't model readiness as a single boolean — it exposes three tiers
(`isReadyForLocalStubSubmission` → `isReadyForPresignedRemoteSandboxSubmission` →
`isReadyForRemoteSandboxSubmission`). Flattening that to "ready / not ready"
would lie. So the header shows the **highest tier reached** as a chip, and the
gateway card renders the literal three-rung ladder. This is what makes the
`sandbox_blocked` state honest: the operator can be *locally validated* yet
*remotely blocked* (e.g. the SRI returned `taxpayer_not_registered`), and the UI
says exactly that instead of a vague error. The verdict is computed from the
tiers + `blockers`/`warnings`, mirroring the component's own
`SandboxReadinessCard` heading logic.

## 4 · Section-by-section intent

- **Issuer → fiscal identity, not a form.** Read-first definition grid over the
  real `IssuerProfileResponse`. `matrixAddress` and `establishmentAddress` are the
  two fields the component's submit button actually requires, so those are the
  ones flagged *Por completar*. The **RUC↔cert alignment** row is the emotional
  core: a green "el RUC coincide con el certificado" is genuinely reassuring (RUC
  mismatch is a top cause of SRI rejection), and the mismatch path offers the
  component's real *Usar RUC del certificado* / *Alinear y guardar* actions
  rather than making the operator retype anything.
- **Numbering → make the cryptic legible.** `documentCode`, `establishmentCode`,
  `emissionPointCode` and `nextSequenceNumber` mean nothing to a non-accountant.
  We render the contract's `previewNumber` as three labelled segments so
  `001 – 001 – 000000148` literally shows how the next number is built — and echo
  the component's "Próxima factura sugerida" copy.
- **Signature → the strongest help for the scariest area.** A health strip puts
  the three things that matter up top: what it is (`certificateLabel` /
  `subjectName`), whether it's usable (status from
  `inspection.certificateValidityStatus` + `materialConfigured` + `isActive`),
  and whether it's expiring (`daysUntilExpiry`, a validity meter). The PKCS#12
  inspection — the densest evidence in the whole surface — is grouped into four
  labelled clusters so it reads like an ID card, not the component's flat stack
  of disabled inputs. `cryptographicProofStatus` and the offline-compat signal
  are surfaced because they're real gates to the remote tier.
- **Gateway → a controlled readiness lane.** `electronic-submission` settings
  (provider / transmissionMode / URLs / `credentialsSecretRef` / `isActive`) read
  as configuration; the **sandbox ladder + last SRI feedback + 5-column support
  matrix** answer "can I emit, by which path, and which document types?" without
  exposing WSDL plumbing as the headline.

## 5 · Mood behavior

Every surface reads semantic tokens only, so all five moods re-theme the whole
thing — not just the background:

- **Cards & controls** use `--surface` / `--border` / `--card-pad` /
  `--control-h`; calm gets airier padding and taller controls, focus denser,
  high-contrast drops shadows for hairline-black borders.
- **Warnings, blockers, banners, the validity meter, the sandbox tier chip and
  the support-matrix cells** use the status-soft families
  (`--warning-soft`/`--on-warning-soft`, `--danger-soft`, `--success`…), which
  each mood redefines — strong red in high-contrast, gentle terracotta in calm,
  luminous coral on dark in night.
- **Navigation / chrome** carries its own `--sidebar-*` / `--topbar-*`
  personality per mood via the Platform Shell, so the context frame changes with
  the content, not just the canvas.

The mood switcher lives in the top bar (desktop) and a bottom sheet (mobile);
selection is frontend-only local state — backend persistence is future backlog.

## 6 · Interaction notes

- **Pillars & "qué falta" jump to sections** (`scrollIntoView`); on mobile the
  same taps open the section's bottom sheet directly.
- **Disclosures** rotate the chevron 180° and reveal in place; expired/invalid
  cert inspection, the sandbox ladder (when remote is blocked) and the support
  matrix (when ready) start open because that evidence is the point there.
- **Copy affordances** on RUC, fingerprint, secret refs, subject and tax IDs flip
  to a green check briefly — operators paste these into the SRI portal and
  certificate tools constantly.
- **Permission-limited** turns every editing affordance into a single disabled
  "Solo lectura" lock and shows a top banner naming the missing permission
  (`invoicing.settings.manage`) — we explain access, never just grey things out.

## 7 · Accessibility

- Status is never color-only — every pill, verdict, ladder rung and matrix cell
  pairs tone with an icon + text label; blockers/warnings add a leading icon and
  a written reason from the contract.
- **High-contrast** is a first-class state (near-black text, black hairline
  borders, no shadows, doubled focus ring) — verify settings in it, not just
  comfort.
- All interactive elements are real `<button>`/`<a>` with `ds-focusable` rings;
  disclosures expose `aria-expanded`; the read-only banner uses `role="status"`.
- Mono is reserved for true technical data (RUC, fingerprint, serial, endpoints,
  secret refs, número); everything else is Manrope.
- Hit targets respect `--control-h` (≥36px) and are ≥44px on mobile rows/sheets.
- Motion is restrained (180ms color/background, chevron rotate) and respects
  `prefers-reduced-motion`; no transforms, lifts or bounces.

## 8 · Tensions & decisions

- **Read-first vs. edit-first.** Chosen read-first: most visits are "is
  everything still OK?", so the surface is a status dashboard and editing is an
  explicit per-section action. The real forms drop in behind each card.
- **One page vs. tabs.** Kept all four sections on one scroll with a sticky
  readiness rail so the verdict and the gaps stay co-visible — tabs would hide
  the very thing that creates calm.
- **How much inspection to show.** The PKCS#12 inspection has ~14 fields; showing
  them all by default would re-create the wall. Grouping + a single disclosure
  keeps them one tap away without making them the headline.
- **Honoring the ladder.** We resisted collapsing the three sandbox tiers into a
  binary. The `sandbox_blocked` state only makes sense because we kept them — and
  it's the state most likely to confuse an operator, so it earns the nuance.
- **No fake automation.** No "fix everything" button. The system prepares,
  explains and points; the operator (or an Owner) acts. Copy states that emission
  and SRI authorization happen per-invoice, not here — never implying automatic
  filing or signing.
