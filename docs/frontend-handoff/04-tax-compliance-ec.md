# Tax Compliance EC Handoff

## Goal

Design a control-room experience for Ecuador tax compliance using existing SRI
evidence, declaration, assistant, accountant-boundary and closeout contracts.

## Primary User

Owner/operator preparing tax evidence with accountant support.

## Endpoint Source

Use the `Tax Compliance EC` tag in `docs/api/openapi.json` for the full route
set. Prioritize command center, SRI evidence, declaration forms, IVA/renta
workspaces, assistant packets, accounting bridge and closeout endpoints.

## Required Screens

1. Tax Compliance command center.
2. SRI fiscal evidence workspace.
3. Platform reconciliation workspace.
4. IVA workspace.
5. Income tax workspace.
6. Declaration form catalog.
7. Filing assistant.
8. Accountant escalation/review.
9. Tax/accounting boundary.
10. Pilot/closeout summary.

## Guardrails

- The UI must not imply automatic filing.
- Form support is assisted preparation, not official submission.
- Accountant-required boundaries must stay visible when evidence is incomplete,
  contradictory or professionally sensitive.
