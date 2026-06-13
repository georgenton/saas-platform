# AI Console Handoff

## Goal

Design AI as a transversal operations console for suggestion envelopes, memory,
prompt packs, approvals and guarded execution.

## Primary User

Owner/operator supervising AI-assisted workflows.

## Core Endpoints

- `GET /api/ai/model`
- `GET /api/ai/agents`
- `GET /api/ai/prompts`
- `GET /api/ai/tools`
- `GET /api/ai/agents/:agentKey/prompt-pack`
- `GET /api/ai/agents/:agentKey/tool-access`
- `GET /api/ai/tenants/:slug/agents/:agentKey/suggestion-envelope`
- `POST /api/ai/tenants/:slug/agents/:agentKey/suggestion-runs`
- `GET /api/ai/tenants/:slug/suggestion-runs`
- `GET /api/ai/tenants/:slug/approval-workspace`
- `GET /api/ai/tenants/:slug/guarded-execution-workspace`

## Required Screens

1. AI operating model overview.
2. Agent catalog.
3. Prompt pack detail.
4. Tool access matrix.
5. Suggestion run history.
6. Approval workspace.
7. Memory workspace.
8. Guarded execution monitor.
9. AI action center.

## Guardrails

- Suggestion mode is not execution.
- Approval does not imply domain mutation unless guarded execution endpoint
  explicitly executes a controlled action.
- Show blocked tools and approval-required tools visibly.
