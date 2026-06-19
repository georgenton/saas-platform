# Access / Login Gateway — Integration Plan (for Codex)

Target app: `apps/web-platform` (React + TypeScript + Vite). This slice is a
**design delivery** — land it under
`docs/design/claude-design/04-access-login-gateway/` for review, then extract an
`access` feature incrementally. Do **not** paste the prototype into app source.

## 0. What this replaces

Today the signed-out / auth-entry logic lives inside
`apps/web-platform/src/app/app.tsx`:

- the raw Bearer-token bootstrap input,
- session loading,
- invitation review,
- tenancy selection.

The next architecture pass should extract a `features/access/` module so
`app.tsx` stops owning the signed-out experience directly. This slice is the
design for that module — it precedes the Platform Shell (slice 00) and Command
Center (slice 01) and must resolve identity **before** any product surface mounts.

## 1. Suggested feature shape

```
apps/web-platform/src/features/access/
  access-gateway.tsx        AccessDesktop / mobile composition (presentational)
  access.model.ts           AccessPhase + view-model types
  use-access-flow.ts        resolves session → phase; owns transitions
  queries.ts                auth/me, invitation detail (TanStack Query)
  mutations.ts              accept invitation, set current tenancy, token bootstrap
```

`app.tsx` renders `<AccessGateway/>` while there is no resolved
`currentTenancy`; once resolved it mounts the existing shell + Command Center.

## 2. Phase machine (the only logic that matters)

```ts
type AccessPhase =
  | 'gateway'              // no session / not yet bootstrapped
  | 'checking'             // GET /api/auth/me in flight
  | 'backend-unavailable'  // auth/me failed (network / 5xx)
  | 'invalid-token'        // token bootstrap rejected (401)
  | 'invitation'           // pending invitation to review
  | 'workspace-select'     // tenancies present, no currentTenancy
  | 'no-tenant'            // session but zero tenancies
  | 'ready';               // currentTenancy resolved → hand off
```

Resolution order after `GET /api/auth/me` succeeds:

```ts
if (me.currentTenancy)            → 'ready'           // hand off to Command Center
else if (me.pendingInvitations?.length) → 'invitation'
else if (me.tenancies?.length)    → 'workspace-select'
else                              → 'no-tenant';
```

(Field names above are illustrative — confirm against `openapi.json` /
`app/types.ts` `AuthMeResponse`. The prototype's `ACCESS_DATA.session` /
`tenancies` / `invitation` mirror these shapes.)

## 3. Endpoints — only what exists

```
GET  /api/auth/me                                  → session inspection
PUT  /api/auth/me/current-tenancy                  → workspace selection (body: { slug })
GET  /api/auth/invitations/{invitationId}          → invitation detail
POST /api/auth/invitations/{invitationId}/accept   → accept invitation
```

The **token bootstrap** is not a login mutation: it stores the pasted Bearer
token (e.g. in memory / `localStorage`) and re-runs `GET /api/auth/me` with it.
A 401 → `invalid-token`; success → continue the phase machine.

**Do NOT add** email/password, magic-link, SSO callback or password-reset
endpoints. The future-method rows are presentational only — wire them to nothing
(or a "notify me" backlog) until a real contract exists.

## 4. Actions → handlers

```
Continuar                     → bootstrapSession()  // GET /api/auth/me, then phase machine
Usar token (advanced)         → setToken(value); bootstrapSession()
Aceptar invitación            → POST …/invitations/{id}/accept → refetch me → phase machine
elegir workspace              → PUT /api/auth/me/current-tenancy { slug } → 'ready'
Reintentar                    → bootstrapSession()
Entrar al Command Center      → navigate to /{slug} (shell + Command Center)
Cerrar sesión / Ahora no      → clearSession() / back to 'gateway'
```

Keep optimistic UI minimal: show the inline busy state, then transition only on
the real response. Never route to `ready` without a resolved `currentTenancy`.

## 5. Server state

Use TanStack Query (the app's default) for `auth/me` and invitation detail;
keep the token + selected-phase in local state. Invalidate `auth/me` after accept
/ set-current-tenancy so the phase machine recomputes from fresh server truth.

## 6. Mood

Mood is a frontend-only preference (backend persistence deferred — see
`project-freeze-handoff.md`). Reuse the shell's mood store so the choice made on
the gateway carries into the shell. The `data-mood` attribute sits on the gateway
root; the brand pane scopes `--sidebar-*` onto content tokens (same pattern as
`platform-shell`).

## 7. Responsiveness

- Desktop: two panes (brand ~1fr / action ~1fr). Below ~860px, drop the brand
  pane to a compact top band and center the action card.
- Mobile: single focused card; advanced token + mood as bottom sheets; ≥44px
  targets. Match the shell's breakpoint so the transition into the shell is
  seamless.

## 8. Guardrails to preserve in code

- Never the raw textarea first; advanced token stays collapsed/secondary.
- Future auth providers are non-interactive structure — never fake working flows.
- Do not mount the multi-product shell before `currentTenancy` resolves.
- Invitation acceptance & tenancy selection stay explicit and calm.
- `no-tenant` explains what's missing; it does not dump the shell.
- Labels EN where product nouns; body copy es-EC. Mono for token/RUC/correo.
- Optimize for low onboarding abandonment: one dominant action per state.

## 9. What comes next

Once this is integrated, the next product refinement resumes in **Invoicing**
(slices 02 → 03), now entered through a real access flow:
`access → command center handoff → invoicing`.
