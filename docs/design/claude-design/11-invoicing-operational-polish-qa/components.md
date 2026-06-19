# Components — Slice 11, Invoicing Operational Polish QA

This slice introduces **no new product behavior** and few new primitives — it is
a composition + hierarchy pass. The components below are the coherence layer that
sits *around* the existing subview panels. Each maps to a real boundary in
`apps/web-platform/src/features/invoicing/` and to an audit finding it satisfies.

## New coherence components (this slice)

| Component | File | What it is | Real boundary | Satisfies |
| --- | --- | --- | --- | --- |
| `ProductHeader` | `workspace.jsx` | One-line product header: icon + breadcrumb + title + primary action. Replaces the duplicate in-workspace `<h1>`. | `app.tsx` workspace mount | A1 |
| `SubviewNav` | `workspace.jsx` | Horizontal lane of the seven subviews with a 3px active rail (NavItem pattern). | new — `workspace-documents.tsx` / `workspace-commercial.tsx` switching | A3 |
| `ContextStrip` / `TruthCell` | `workspace.jsx` | Persistent context: invoice number/buyer/total + the SRI · Entrega · Pago triad; or portfolio metrics when no invoice. | new — composed above the active subview | A4 |
| `NextStep` | `workspace.jsx` | One recommended action per state, tone-tinted, with primary + ghost secondary. | mirrors `closeout.ts` `buildNextStep` extended to all subviews | A5 |
| `SubviewFocus` | `workspace.jsx` | Distilled, on-brand render of the active subview (summary queue, readiness, customer, items, review, lifecycle, closeout) under one rhythm. | the seven existing panels | A2, A8 |
| `MiniStepper` | `workspace.jsx` | Compact Preparado → Enviado → Autorizado stepper; `submitted` sits at "en curso", `rejected` turns step 2 red. | `InvoicingElectronicStatusPanel` | A6 |
| `ReadinessRibbon` | `workspace.jsx` | The four SRI pillars as green/amber/red dots with one line each. | the four `electronic-*` / `numbering` reads | — |
| `Stage` / `JourneyMapView` | `map.jsx` | Experience-map stage card: where · safe action · coherence rule; clickable into the shell. | documentation surface | deliverable #1 |
| `Finding` / `Region` / `PrPlan` / `MobileQa` | `audit.jsx` | The coherence audit board: grouped findings, severity + match tags, PR plan, QA checklist. | documentation surface | deliverable #2 |
| `MobileWorkspaceScreen` + `MobileContext` / `MobileFocus` | `workspace-mobile.jsx` | Purpose-built mobile flow proving M1–M4 (stacked triad, card queue, wrapped steps, pinned action, scrollable chips). | responsive layer of every subview | M1–M4 |

## Reused as-is (shared, unchanged)

| Component | File | Source |
| --- | --- | --- |
| `Btn`, `Pill`, `Banner`, `Avatar`, `Brand`, `NavRow`, `MoodMenu`, `StateScreen`, `AssistantPanel` | `components.jsx` | slices 00/02/05–10 |
| `Sidebar`, `TopBar`, `MobileTopBar`, `BottomTabs`, `Sheet` | `chrome.jsx` | slices 00/02/05–10 |
| `Icon` (Lucide geometry) | `icons.jsx` | slices 00/02/05–10 |

## Production mapping

These coherence components are **not new endpoints or data**. In
`apps/web-platform` they are layout/markup refactors of existing surfaces:

- `ProductHeader` + the 1040px container → `app.module.css` + the Invoicing
  workspace wrapper.
- `SubviewNav` → the existing subview switch, restyled with the NavItem rail and
  `aria-current`.
- `ContextStrip` → a new presentational component fed by the already-loaded
  `InvoiceDetailResponse` + readiness reads.
- `NextStep` → reuse `closeout.ts` derivations; extend the same "one action"
  pattern to the other subviews. No new logic endpoints.
- `MiniStepper` / status pills → consolidate onto the design-system `StatusPill`
  and the lifecycle stepper already present in `InvoicingElectronicStatusPanel`.

See `integration-plan.md` for the PR-by-PR wiring.
