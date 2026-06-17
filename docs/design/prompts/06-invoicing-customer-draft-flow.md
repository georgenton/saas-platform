# Claude Design Prompt: Invoicing Customer + Draft Invoice Flow

You are designing the next frontend slice for a multi-product SaaS platform.

Use these files as source of truth:

- `docs/project-freeze-handoff.md`
- `docs/frontend-handoff/README.md`
- `docs/frontend-handoff/02-invoicing.md`
- `docs/frontend-handoff/05-invoicing-settings-sri.md`
- `docs/frontend-handoff/06-invoicing-customer-draft-flow.md`
- `docs/frontend-handoff/00-platform-shell.md`
- `docs/api/openapi.json`
- `apps/web-platform/src/features/invoicing/workspace-customer-draft-flow.tsx`
- `apps/web-platform/src/app/api.ts`
- `apps/web-platform/src/app/types.ts`

## Product Context

The backend is frozen. Do not invent endpoints, mutations or backend behavior.

The frontend now has a real extracted component for this surface:

```txt
apps/web-platform/src/features/invoicing/workspace-customer-draft-flow.tsx
```

This slice is not a full invoicing redesign. It is the first operating lane for
creating a fiscal buyer and then creating a draft invoice.

## Design Goal

Design a premium, friendly and low-friction Ecuador invoicing flow that helps a
user create a valid first invoice without feeling trapped in accounting
complexity.

The flow should make the user feel:

- "I know where to start"
- "This system understands Ecuador"
- "I can create a buyer and draft without fear"
- "The product feels professional but simple"
- "I am not being pushed into SRI submission too early"

## UX Intent

The current component is functionally correct, but visually it is still close to
a basic form stack.

Your job is to turn it into a rich, unique and simplified operating experience
for LATAM/Ecuador users. It should reduce onboarding abandonment by making the
first invoice path calm and obvious.

Use a guided sequence:

1. choose or create buyer
2. confirm buyer fiscal identity
3. create invoice draft
4. hand off to items / document lifecycle later

## Real Functional Scope

Customer:

- list customers
- create customer
- name
- email
- identification type
- identification / tax ID
- billing address

Invoice draft:

- create invoice
- customer
- number
- currency
- status
- due date
- notes

Buyer identification options:

- `04` RUC
- `05` Cedula
- `06` Pasaporte
- `07` Consumidor final
- `08` Exterior

## Endpoints

Use only these endpoint surfaces for this slice:

- `GET /api/invoicing/tenants/{slug}/customers`
- `POST /api/invoicing/tenants/{slug}/customers`
- `GET /api/invoicing/tenants/{slug}/invoices`
- `POST /api/invoicing/tenants/{slug}/invoices`
- `GET /api/invoicing/tenants/{slug}/numbering/invoice`

Do not add search, edit, delete, merge, import, tax validation, automatic filing,
SRI submission or payment behavior.

## Important Behavioral Truth

Draft creation is not SRI submission.

The design must not imply:

- legal authorization
- SRI acceptance
- tax filing
- accountant replacement
- automatic compliance judgment

This flow creates the commercial/fiscal starting point. SRI lifecycle comes
later in the existing electronic document surfaces.

## States To Design Explicitly

Design desktop and mobile states for:

1. loading
2. no customers
3. customers available
4. buyer selected
5. buyer form partially complete
6. customer creation in progress
7. customer creation failed
8. invoice draft disabled because no buyer exists
9. invoice draft ready
10. invoice creation in progress
11. invoice creation failed
12. permission-limited
13. backend unavailable

## Design Direction

Make the flow feel like a guided lane, not two disconnected cards.

Possible structure:

- small "first invoice path" header
- buyer readiness step
- selected buyer summary
- fiscal identity confirmation
- draft invoice step
- next-step hint toward items and SRI lifecycle

Keep one dominant action at a time.

Use friendly Ecuador-aware labels, but keep the surface professional and
corporate. Avoid a playful consumer checkout feel.

## Mobile Expectations

Do not shrink the desktop layout.

Mobile should feel purpose-built:

- clear current step
- compact buyer selector/list
- bottom-sheet or progressive details for fiscal fields if useful
- thumb-friendly primary action
- minimal cognitive load

## Mood System

Support the existing platform moods:

- comfort
- focus
- calm
- high-contrast
- night

Mood changes must visibly affect:

- forms
- selected buyer treatment
- empty states
- warning/error states
- action hierarchy
- cards/surfaces

Not just the page background.

## Output Required

Return a complete design delivery in the same format as previous slices:

1. interactive viewer
2. desktop layout
3. mobile layout
4. explicit states
5. component hierarchy
6. interaction notes
7. accessibility notes
8. mood behavior
9. mock JSON mapped to the real contracts
10. integration notes for React/Vite/TypeScript

Save the slice under:

```txt
docs/design/claude-design/06-invoicing-customer-draft-flow/
```

## Constraints

- React + TypeScript + Vite target
- no invented backend endpoints
- no new products
- no marketing landing page
- no fake compliance automation
- no SRI authorization in this flow
- preserve the existing platform shell and mood foundations

## Final Design Intent

The user should feel that creating the first invoice is not a maze. The system
should behave like a calm professional assistant: it asks for the buyer, builds
the draft, and clearly shows where the next operational step begins.
