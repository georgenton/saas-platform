# Notes — Slice 11, Invoicing Operational Polish QA

Design rationale, the coherence model, mood behavior, and the **actionable
audit** Codex should translate into small PRs.

---

## 1 · Design intent

Slices 05–10 each solved one surface. Integrated into `apps/web-platform`, they
still read as separate forms stacked in one product because three coherence
devices are missing or partial:

1. a **product workspace shell** with real subview navigation and active state;
2. a **persistent context strip** so the operator never loses the invoice and its
   three truths when moving between subviews;
3. a consistent **one-recommended-action** hierarchy, with secondary/destructive
   and technical surfaces visually demoted.

This slice designs all three and proves them across 13 states and 5 moods, web
and mobile. It adds **no product behavior**.

## 2 · What the operator must always feel

- **"Sé dónde estoy."** Product header + active subview rail + context strip.
- **"Sé qué sigue."** Exactly one recommended next step per state.
- **"Entiendo qué está pendiente."** The SRI · Entrega · Pago triad, three
  independent truths, never conflated.
- **"Puedo avanzar sin miedo."** Destructive actions are secondary; "Enviado" is
  never dressed as "Autorizado"; read-only explains *why* and *what to do*.
- **"Esto es un sistema profesional, no una demo técnica."** Technical traces are
  collapsed/secondary; mono is reserved for clave de acceso, RUC, números.

## 3 · Mood behavior

The shell carries the five-mood chrome (`--sidebar-*` / `--topbar-*`) and the
content tokens, so re-theming is visible across **chrome, cards, controls and
feedback** — exactly what the brief asks moods to do:

- **comfort** — deep-ink sidebar, soft shadows, balanced density (entry default).
- **focus** — charcoal sidebar, grayer field so cards pop, denser rows; best for
  the queue and the audit board.
- **calm** — light-sage sidebar, airier rows, gentle accent; good for the
  legally tense SRI lifecycle.
- **high-contrast** — bordered white sidebar, **no shadows** (borders carry
  hierarchy), thick focus ring. The audit's C1 finding exists precisely because
  some current cards hard-code a shadow that this mood should drop.
- **night** — full dark shell, brighter primary, status tones preserved.

Every panel reads only semantic tokens, so none of them special-cases a mood.

---

## 4 · Visual Coherence Audit (actionable)

14 findings. Severity: **U** usabilidad · **M** móvil · **C** cosmético. Match:
**parcial** / **no coincide**. Each names the component and the precise fix; the
**PR** column is the recommended landing order (see §5).

### Region: Shell ↔ Product workspace — `app.tsx` · `app.module.css`

- **A1 · U · parcial · PR1** — El workspace repite un encabezado propio dentro del
  shell, duplicando el título "Invoicing" del top bar y empujando el contenido.
  → **Quita el `<h1>` duplicado**; deja el breadcrumb del top bar + un product
  header de una línea con la acción primaria a la derecha.
- **A2 · C · no coincide · PR1** — El `<main>` usa max-width distinto por subview
  (algunas a 1200px, otras full-bleed), rompiendo el ritmo.
  → **Fija un contenedor único de 1040px** con `var(--gutter)` en todas las
  subviews (igual que slices 08–10).

### Region: Subview navigation — `workspace-documents.tsx` · `workspace-commercial.tsx`

- **A3 · U · no coincide · PR2** — Las subvistas cambian con enlaces sueltos sin
  estado activo; el operador pierde dónde está.
  → **Subview-nav con riel de acento de 3px** en la activa (patrón NavItem), en
  orden de journey: Resumen · Emisor · Cliente · Ítems · Revisión · SRI · Entrega.
- **A4 · U · parcial · PR2** — No hay tira de contexto: al entrar a "Entrega" no se
  ve a qué factura corresponde ni su estado SRI.
  → **Context summary strip persistente** (número mono · cliente · total + tríada
  SRI/Entrega/Pago) sobre la subvista activa.

### Region: Status & action hierarchy — `closeout.ts` · `InvoicingElectronicStatusPanel`

- **A5 · U · no coincide · PR4** — Acciones destructivas/secundarias (Revertir
  pago, Intervención manual) se renderizan como `primary`, compiten con la
  recomendada. → **Bájalas a `ghost`/`secondary`**; `primary` solo para el único
  siguiente paso recomendado.
- **A6 · U · parcial · PR4** — `submitted` usa pill verde que se lee como
  autorizado. → **`tone="warning"` + "Enviado al SRI"**; verde solo en
  `authorized` confirmado por backend.
- **A7 · C · no coincide · PR4** — Pills con tamaños y radios variados entre
  paneles. → **Unifica al componente `StatusPill`** (`radius-pill`, `text-2xs`,
  dot opcional); sin pills inline custom.

### Region: SRI Lifecycle — `workspace-electronic.tsx` · `InvoicingTechnicalTracePanel`

- **A8 · U · no coincide · PR4** — El historial técnico (eventos + `sriDiagnostics`)
  aparece expandido y arriba, dominando una pantalla que debe liderar con la
  verdad legal. → **Colapsa el trace** en un disclosure secundario al final;
  lidera con verdict header + stepper + un solo next step.
- **A9 · C · parcial · PR4** — Clave de acceso y nº de autorización sin IBM Plex
  Mono y no copy-friendly. → **`var(--font-mono)` + botón copiar**; mono reservado
  a datos técnicos.

### Region: Mobile — `app.module.css` (responsive) · todas las subvistas

- **M1 · M · no coincide · PR3** — La tríada de cierre (SRI · Entrega · Pago) en 3
  columnas se aplasta / desborda en móvil.
  → **Reduce la grilla de 3 columnas a 1** por debajo de 480px; cada verdad ocupa
  una fila completa.
- **M2 · M · no coincide · PR3** — La cola de facturas usa tabla con scroll
  horizontal en móvil. → **Sustitúyela por tarjetas de una columna** (número ·
  cliente · total · pill); elimina el overflow horizontal.
- **M3 · M · parcial · PR3** — Los pasos recomendados largos no envuelven y empujan
  el botón fuera de pantalla. → **`text-wrap` en la descripción** y **fija la
  acción primaria al fondo** (thumb-reach), no en línea.
- **M4 · M · parcial · PR3** — La barra de subvistas no cabe; los tabs se cortan.
  → En móvil, **lleva la navegación de subvistas a las bottom tabs** del shell
  (Resumen · Facturas · SRI · Más) + un chip-strip con scroll horizontal sin
  recorte.

### Region: Moods — `tokens/moods.css` (uso)

- **C1 · C · parcial · PR1** — Algunas tarjetas usan sombras/fondos hard-coded que
  no responden al mood (high-contrast sigue con sombra).
  → **Cambia a `var(--surface)` / `var(--border)` / `var(--shadow-sm)`**; en
  high-contrast la sombra resuelve a `none` sola.
- **C2 · U · parcial · PR2** — El selector de mood vive en una pantalla de ajustes
  aparte; nadie lo descubre. → **Muévelo al top bar** (icono sliders), consistente
  con slices 00/02–10.

### Lo que YA coincide (no tocar)

- La lógica de `closeout.ts` (verdict / triad / next step) ya es correcta — solo
  cambia su **jerarquía visual** (A5/A6), no su lógica.
- El stepper del lifecycle (Preparado → Enviado → Autorizado) ya separa
  "submitted" de "authorized" correctamente: respétalo.
- El chrome del shell (sidebar, tenant, asistente, tokens de mood) ya está bien;
  el producto solo debe **dejar de competir** con él (A1).

## 5 · Orden de PRs recomendado (pequeños y seguros)

1. **Shell / workspace layout polish** — `A1 · A2 · C1`. Riesgo bajo
   (CSS/markup mecánico).
2. **Subview navigation + context strip** — `A3 · A4 · C2`. Riesgo medio (nuevo
   componente de navegación + tira de contexto).
3. **Responsive / mobile fixes** — `M1 · M2 · M3 · M4`. Riesgo medio (cambios
   responsive por subview).
4. **Status / action hierarchy cleanup** — `A5 · A6 · A7 · A8 · A9`. Riesgo bajo
   (variantes de botón, tono de pill, colapsar trace, mono).
5. **Vercel QA runbook update** — re-corre el runbook (`doc 10`) en los 5 moods ×
   desktop/móvil tras integrar 1–4.

> No intentes una reescritura completa en un solo PR. Cada PR de arriba es
> independiente y reversible.

## 6 · Accesibilidad

Focus visible vía `--focus-ring-shadow`; targets ≥ 44px en móvil; estados de
color acompañados de icono + etiqueta (nunca solo color); `aria-current` en la
subvista y los bottom tabs activos; `prefers-reduced-motion` respetado (sin
transforms, solo transiciones de color/fondo 180ms).

## 7 · Guardrails honored

Contexto de tenant siempre visible · una acción recomendada a la vez · SRI,
entrega y pago como tres verdades independientes · "Enviado" nunca como
"Autorizado" · sin declaración de impuestos, asientos contables, conciliación
bancaria ni firma/legalización automática · IA suggestion-first · productos
deshabilitados siguen visibles · labels EN, microcopy es-EC · sin endpoints
nuevos.
