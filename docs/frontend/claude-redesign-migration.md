# Claude Design frontend migration

Status: active frontend direction.

The product frontend is being rebuilt with Claude Design slices as the source of
truth. The previous monolithic `apps/web-platform/src/app/app.tsx` was retired
from the active bundle in the slice `refactor(frontend): bootstrap claude
platform app`.

## Source of truth

- Visual and UX source: `docs/design/claude-design/*`.
- Active application bootstrap: `apps/web-platform/src/app/app.tsx`.
- New composition layer: `apps/web-platform/src/features/platform/`.
- Real contracts remain in `apps/web-platform/src/app/api.ts`,
  `apps/web-platform/src/app/types.ts`, and feature query/adapters.

## Legacy reference

The pre-reset monolithic app remains available in Git for consultation:

- Commit: `2cbd507b`
- Path at that commit: `apps/web-platform/src/app/app.tsx`

Do not copy the legacy app back into the active bundle. If a behavior is still
needed, extract the contract or adapter and rebuild the UI using the Claude
Design component direction.

## Migration rule

Each frontend slice should:

1. Start from the relevant Claude Design slice.
2. Reconcile fields against the real API/types.
3. Keep `app.tsx` as a bootstrap only.
4. Place reusable product UI in `features/<product>/` or shared UI in
   `shared/`.
5. Avoid reintroducing long document-like pages where multiple product
   workspaces render at once.
