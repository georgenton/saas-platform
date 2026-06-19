# Access / Login Gateway — Component Hierarchy

The reusable pieces this slice introduces, on top of the slice 00 primitives
(`Btn`, `Pill`, `Banner`, `Avatar`, `MoodMenu`) and `Icon`. All read semantic
mood tokens only; no hard-coded color.

```
AccessDesktop (window.ACCESS)          two-pane shell, owns busy/flow + mood control
├─ MoodControl                         corner "Apariencia" popover → MoodMenu
├─ BrandPanel                          left trust pane (sidebar-token chrome)
│  ├─ wordmark
│  ├─ tagline + lede
│  ├─ capability chips (non-interactive)
│  └─ trust footer (SRI-ready · region)
└─ right pane (one card per state)
   ├─ GatewayCard                      primary access card
   │  ├─ CardHead (lozenge + eyebrow + title + body)
   │  ├─ primary "Continuar" (inline busy)
   │  ├─ future-methods structure ("PRÓXIMAMENTE", disabled rows)
   │  ├─ AdvancedToken (collapsed disclosure)
   │  └─ "Revisar invitación" link
   ├─ CheckingCard                     spinner + GET /api/auth/me
   ├─ ErrorCard                        backend unavailable + retry + correlationId
   ├─ InvitationCard                   invitation detail table + accept / ahora no
   ├─ WorkspaceCard                    tenancy picker rows
   ├─ NoTenantCard                     explains what's missing
   └─ ReadyCard                        resolved tenant + "Entrar al Command Center"

MobileAccess (window.MobileAccess)     one card per state + bottom sheets
├─ compact brand bar + Apariencia button
├─ <state card> (compact recompositions of the above)
└─ Sheet                              bottom sheet for advanced token · mood
```

## `AccessDesktop` / `MobileAccess`

Top-level orchestrators. Receive `{ d, state, onState, mood, moods, onMood }`.
Own a local `busy` key and a `go(key, target, ms)` helper that runs the inline
"verificando…" transition then calls `onState(target)`. The viewer's switcher and
the in-card actions both drive `state`, so reviewers can jump anywhere and the
flow still feels live. Timers are cleared on unmount.

## `BrandPanel`

The constant left trust pane. Scopes the `--sidebar-*` chrome tokens onto content
tokens for its subtree (same technique as the shell sidebar) so it carries each
mood's chrome personality. Content is orientation only — wordmark, one confident
line, a **non-interactive** capability list, a compliance/region footer. No CTAs.

## `GatewayCard`

The primary access card. Hierarchy: head → **one** dominant `Continuar` → future
methods as disabled structure under a "PRÓXIMAMENTE" divider → `AdvancedToken`
disclosure → invitation link. **Contract to keep:** exactly one primary button;
future-method rows are never interactive.

## `AdvancedToken`

The progressive-disclosure Bearer-token bootstrap. Collapsed by default; expands
to a mono `<textarea>` + `Usar token` (secondary) + paste, with a token-error
`Banner` when the session inspection rejects it. Rotating chevron + sunken open
surface signal "deliberate, secondary path". On mobile this is a bottom `Sheet`.

```
props (desktop): { open, onToggle, onUse, busy, error }
```

## `InvitationCard`

Pending-invitation review: a labeled detail table (empresa · RUC · rol ·
invitado por · correo · vence) + one primary `Aceptar invitación` (inline busy) +
a quiet "Ahora no". Maps to `GET /api/auth/invitations/{id}` +
`POST …/accept`.

## `WorkspaceCard`

Tenancy picker — one tappable row per membership (avatar, name, RUC, role pill,
members/products, non-production environment flag). Choosing a row runs the busy
transition (maps to `PUT /api/auth/me/current-tenancy`). Keyboard-focusable
`<button>` rows.

## `NoTenantCard`

Session resolved but no workspace. Explains what's missing and surfaces the
operator's email to request an invite — never dumps the product shell. Actions:
"Tengo una invitación" → invitation review, "Cerrar sesión".

## `ReadyCard`

The calm handoff. Success lozenge, greeting, the resolved tenant card (name, RUC,
environment, "Sesión activa") and **one** `Entrar al Command Center` action that
hands off to slice 01.

## `CheckingCard` / `ErrorCard`

Cold-boot session inspection (spinner + `GET /api/auth/me`) and the
backend-unavailable state (retry + `correlationId`). Both keep the brand panel so
the experience stays oriented and calm.

## Shared atoms (`window.ACCESS`)

- `Card` — the rising action-card surface (`.acc-rise`, transform-only entrance).
- `Spinner` — the busy indicator reused inline and full-card.
- `Lozenge` — tinted icon tile, tone-driven, reused by every CardHead.
- `CardHead` — lozenge + eyebrow + title + body, the shared card opener.

## Mock data (`window.ACCESS_DATA`)

`product` / `capabilities` (brand pane) · `futureMethods` (non-interactive
structure) · `session` (auth/me with currentTenancy) · `tenancies` (workspace
picker) · `invitation` · `noTenant` · `backendError` · `tokenError` · `env` ·
`moods`. Shapes mirror the real endpoints — see `integration-plan.md`.
