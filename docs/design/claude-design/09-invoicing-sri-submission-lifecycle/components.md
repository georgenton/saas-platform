# Slice 09 — component hierarchy

Reusable pieces this slice introduces, on top of the shared Platform Shell
primitives (`window.UI`), chrome (`window.Chrome`) and icons (`window.Icon`)
carried over from slices 00 / 02 / 05–08. Names map to what a developer would
keep inside `InvoicingElectronicStatusPanel` / `InvoicingTechnicalTracePanel`.

## Helpers — `window.Lifecycle`

```
deriveNextStep(s)   → { tone, pill, icon, title, desc, primary, secondary }
                       (mirror of buildNextStep in workspace-electronic.tsx)
STATUS              → { pending_submission | submitted | authorized | rejected →
                       { tone, label, legal } }  (verdict + legal-meaning copy)
fmtDateTime(iso)    → "17 jun 2026 · 12:00"
providerTone(s)     → success | warning | danger | neutral  (trace event status)
```

`deriveNextStep` reads `invoice.electronicStatus` + `canSubmit`
(`canSubmitElectronicDocument`) + `documentSupport.submitSupported` and returns a
single `primary` action (a real handler name, or a `kind: 'open-manual' |
'open-fallback' | 'nav'`) plus one `secondary`.

## Desktop — `window.Lifecycle.DesktopLifecycle` (`src/lifecycle-panel.jsx`)

```
DesktopLifecycle(s)
├─ NoInvoice                 (when s.invoice === null)
├─ header                    "Autorización electrónica" + intent line
├─ read-only Banner          (permission_limited)
├─ VerdictHeader(s)          legal status + legal-meaning sentence + número  ── 1
├─ Stepper(status)           Preparado → Enviado al SRI → Autorizado          ── 2
├─ NextStep(step, s, run)    one primary + one secondary action               ── 3
├─ SriMessage(s)             returned SRI observation (rejected only)          ── 5
├─ Evidence(s)               clave de acceso · No. autorización · enviado      ── 4
├─ XML preliminar            (when xmlPreviewLoaded)
├─ Disclosure(manual)        ManualPanel — intervención / conciliación         ── 6 (advanced)
├─ Disclosure(fallback)      FallbackPanel — presigned XML                     ── 7 (advanced)
└─ TracePanel(s)             historial técnico (collapsed)                     ── 8 (quiet)
```

Building blocks:

- **VerdictHeader** `{ s }` — the legal verdict; tone + icon + legal sentence
  from `STATUS`, plus the invoice number.
- **Stepper** `{ status }` — three-node lifecycle; authorized node completes only
  for `authorized`, rejected recolors the middle node.
- **NextStep** `{ step, s, canManage, run }` — the single recommended action card;
  `run(action)` dispatches a handler (no-op in the prototype) or opens a
  disclosure.
- **Evidence** `{ s }` — `CopyCard` for clave de acceso + No. autorización
  (authorized-gated) + submitted-at / reference.
- **SriMessage** `{ s }` — danger card with `electronicStatusMessage` (rejected).
- **Disclosure** `{ open, setOpen, icon, title, sub, badge, children }` — the
  advanced expander shell.
- **ManualPanel** — the status-update form (estado / fecha / clave / No.
  autorización / mensaje) with the component's exact disabled rules.
- **FallbackPanel** — signer name + signed XML + the three stub/presigned submit
  buttons, tagged secondary.
- **TracePanel** + **TraceEventCard** — the collapsed `electronicEvents` list with
  provider status, diagnostics summary, reference and structured SRI messages.

## Mobile — `window.MobileLifecycle.MobileLifecycleScreen` (`src/lifecycle-mobile.jsx`)

```
MobileLifecycleScreen(s, mood, onMood)
├─ MobileTopBar              (Chrome)
├─ legal verdict header      tone-tinted, número + legal sentence              ── 1
├─ scroll body
│   ├─ MStepper              compact 3-node, no horizontal scroll              ── 2
│   ├─ next step card        verdict + recommended title/desc                  ── 3
│   ├─ SRI message           (rejected)                                        ── 5
│   ├─ Evidence (CopyRow)    clave · No. autorización · enviado                ── 4
│   └─ advanced entry rows   intervención manual · fallback · historial técnico
├─ sticky primary action     one thumb-friendly button (state-appropriate)     ── 3
├─ BottomTabs                (Chrome)
└─ Sheet                     ManualSheet · FallbackSheet · TraceSheet · MoodMenu ── 6/7/8
```

`field()` + `inStyle()` are the mobile form helpers. Mobile reuses every
`window.Lifecycle` helper (`deriveNextStep`, `STATUS`, `fmtDateTime`,
`providerTone`) so the verdict logic and the "submitted ≠ authorized" rule are
defined once.

## Status / action vocabulary (matches the contract)

```
electronicStatus    pending_submission | submitted | authorized | rejected
document status      draft | issued | partially_paid | paid | void
actionLoading        'load-invoice-xml-preview' | 'submit-invoice-electronic-document'
                     | 'check-invoice-electronic-authorization' | 'invoice-electronic-status'
                     | 'submit-presigned-invoice-electronic-document' | null
authorized verdict   ONLY electronicStatus === 'authorized'  (never derived from submitted)
documentSupport      { documentCode, label, submitSupported, detail, … }
canSubmit            canSubmitElectronicDocument (boolean) — readiness gate
```

The 17 viewer states in `app.jsx` are presentation conditions over these — in
production they collapse into the panel's real props (`selectedInvoiceDetail`,
`selectedInvoiceDocumentSupport`, `canSubmitElectronicDocument`, `actionLoading`,
the `invoice*` / `presignedInvoice*` controlled fields, permission, query error).
