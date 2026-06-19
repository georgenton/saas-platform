# SRI Control Area — Design Notes

Design rationale for slice 03. Read `README.md` first for the screen tour. This
slice refines one panel — the Ecuador SRI control area inside an invoice detail —
so everything here is about **hierarchy and restraint**, not new surface area.

## 1. The hierarchy is the product

The brief's central ask: the SRI area must "stop feeling like a technical wall".
The base implementation (`workspace-electronic.tsx`) already had the right
*behaviors* — compact cards, progressive disclosure, a fallback bridge, a hidden
trace — but they read as a flat stack of equally-weighted boxes. The refinement
is almost entirely about assigning **weight**:

```
loudest  → next-step primary button (one, contextual, the only call to action)
           ↑ status triad (glanceable, structural, no actions)
           ↑ lifecycle ladder (grounding)
           — "Controles avanzados" divider — everything below is opt-in
quieter  → compact disclosure cards (calm, collapsed)
           ↓ intervention form (opens only when relevant)
           ↓ fallback bridge (dashed, sunken, "Avanzado")
quietest → technical trace (separate card, no shadow, sunken header)
```

The operator reads top-to-bottom and can stop the moment they've done the one
recommended thing. The dense machinery is *present* (this is real operational
software, not a demo) but never *in the way*.

## 2. System status ≠ legal status — now a triad

The single most important compliance idea, lifted from slice 02 and made the
literal first thing you see. Three signal tiles:

- **Documento** — our system's internal condition (*Borrador* / *Emitida* /
  *Pagada*). Neutral tone — this is bookkeeping, not the SRI.
- **Estado SRI** — the legal condition of the comprobante (*Pendiente* / *En el
  SRI* / *Autorizada* / *Rechazada*). Tone tracks the stage.
- **Clave de acceso** — readiness of the 49-digit key (*Lista* / *Derivable*).

Splitting these three answers the operator's real anxiety ("is this *done*?")
without conflating "I issued it in the system" with "the SRI authorized it".

## 3. Never imply authorization — encoded in structure

The lifecycle ladder (Preparado → Enviado al SRI → Autorizado) derives its
highest lit node **only** from the electronic status the backend reports. A
`submitted` invoice lights **Enviado** and stops; the next-step copy is explicit
— "Aún no está autorizada — consulta el estado para confirmar" — and the
"Consultar autorización" cue carries a quiet "no implica autorización" footnote.
A `rejected` invoice turns the Enviado node red. This is the guardrail expressed
as visual truth rather than a disclaimer.

## 4. Progressive disclosure with honest defaults

Compact mode is the default. The two disclosure cards sit under a literal
**"Controles avanzados · ocultos por defecto"** divider, each with a rotating
chevron so the expand/contract affordance is unmistakable. But disclosure is
**context-aware**, mirroring the base impl and going further:

- *Configuración y conciliación* (manual SRI control) auto-opens when there is a
  **blocker**, or the document is **submitted** / **rejected** — i.e. exactly
  when an operator is likely to need to reconcile or intervene.
- *Sandbox real / fallback técnico* auto-opens **only** when an external XML is
  staged or the document path is unsupported — otherwise it stays a quiet,
  dashed, secondary card.

Settings appear *when they're relevant*, never as a landing wall.

## 5. The fallback must look like a fallback

The external-signed-XML / sandbox bridge is real and necessary (native XAdES
signing is still evolving) but it is **not** the operator's path. We mark it as
secondary three ways at once: a **dashed** border, a **sunken** surface, and an
**"Avanzado"** tag — plus copy that says, in bold, "No es la ruta principal del
operador." It is findable for the engineer who needs it and ignorable for the
operator who doesn't.

## 6. The trace is evidence, not workflow

The technical trace is a **separate card** with deliberately reduced weight: no
shadow, a sunken header, collapsed by default. Expanded, it is a quiet timeline —
provider/status pill, timestamp, message, SRI diagnostics, and a nested **Ver
payloads SOAP** reveal so raw request/response XML never competes with daily
operation. It exists for support and diagnostics and looks the part.

## 7. Microinteractions for Ecuadorian operators

Two small patterns earn their place because they map to what operators actually
do:

- **Copy-to-clipboard on clave de acceso & nº de autorización.** Operators
  routinely paste these 49-digit values into the SRI portal or share them with
  accountants. A one-tap copy with a check-mark confirmation removes a real,
  error-prone manual step. (The values use IBM Plex Mono + `break-all`.)
- **"Última consulta hace 8 min" on submitted.** Surfacing the last
  authorization check — without auto-polling that might *look* like the system
  decided — keeps the operator oriented while preserving the guardrail that only
  the backend confirms authorization.

## 8. Mood system

Every surface reads semantic tokens only, so the five moods retune the whole
panel. Status tones (`--success/-warning/-danger/-info` + soft) drive the triad
dots, stage pills, the stepper and the trace, so compliance signalling survives
every mood — including **night** (full dark shell, tones preserved) and
**high-contrast** (strong borders, no shadow, double focus ring; the trace's
"quiet" no-shadow treatment leans on borders here). **Focus** tightens density
(`--control-h`, `--card-pad`); **calm** softens surfaces for long compliance
sessions.

## 9. Copy

Labels EN where they're product nouns; microcopy es-EC, addressed as `tú`,
operational and calm: "El SRI está procesando este comprobante", "Envío en
pausa", "No es la ruta principal del operador". Money / RUC / clave / nº de
autorización use IBM Plex Mono + tabular figures and Ecuador formatting. AI stays
suggestion-first with the standing line "No genera, envía ni autoriza ningún
documento ante el SRI sin tu aprobación."

## 10. Tensions between "premium" and the operational guardrails

The brief explicitly asked us to flag these. Where premium polish and the
guardrails pulled against each other, the guardrail won:

- **Calm vs. completeness.** A premium UI wants to hide complexity; an SRI
  console must keep the manual control, the fallback bridge and the raw SOAP
  trace reachable. Resolution: progressive disclosure with *honest* defaults —
  everything is one click away and auto-surfaces exactly when relevant, but
  nothing dense is shown unprompted.
- **A satisfying "done" moment vs. legal truth.** The most delightful design
  would celebrate "¡Enviado!" as completion. We deliberately *withhold* that
  satisfaction on `submitted` — the ladder stops, the copy says "aún no está
  autorizada". Premium here means *trustworthy*, not *celebratory*.
- **One dominant action vs. a real fork (normal vs. fallback).** A single loud
  CTA is cleaner, but the unsupported-document and sandbox cases genuinely need
  a second path. Resolution: the fallback is always visually subordinate (dashed
  / sunken / "Avanzado"), so there's still only one *primary* action even when a
  secondary route exists.
- **Polish vs. accessibility.** Soft shadows and tints read as premium but fail
  high-contrast. The trace's "quiet = no shadow" treatment and the tile borders
  are built to degrade gracefully into the high-contrast mood's border-driven
  contract.

## 11. Accessibility

- Status never by color alone: triad tiles pair a tone dot with a text value and
  a caption; the stepper uses check / dot / × glyphs; trace events pair a tone
  pill with the provider status text.
- All toggles are real `<button>`s with `aria-expanded`; disclosure chevrons
  rotate as a redundant affordance.
- `high-contrast` meets the system's strong-border / double-focus contract; the
  trace card's no-shadow styling relies on borders, so it survives that mood.
- Mono values are copyable via keyboard-focusable buttons with `aria-label`.

## 12. Known mock-only affordances

All actions (Enviar al SRI, Consultar autorización, Renovar firma, Actualizar
estado electrónico, Enviar XML prefirmado, Corregir y regenerar) are present as
the intended actions but inert in this prototype, except the **copy** buttons and
all **expand/collapse** toggles, which are live so reviewers can feel the
disclosure behavior. The real endpoints they wire to are in `integration-plan.md`.
