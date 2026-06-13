# Growth Handoff

## Goal

Design Growth as an operational inbox and commercial workflow for conversations,
WhatsApp, leads, opportunities and owner assignment.

## Core Endpoints

- `GET /api/growth/tenants/:slug/conversations/workbench`
- `GET /api/growth/tenants/:slug/conversations/assist/daily-agenda`
- `GET /api/growth/tenants/:slug/conversations/operational-cases`
- `GET /api/growth/tenants/:slug/conversations/whatsapp-inbox`
- `GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/outbound-summary`
- `GET /api/growth/tenants/:slug/opportunities`
- `GET /api/growth/tenants/:slug/leads`

Use the `Growth` tag in `docs/api/openapi.json` for message, assignment,
monitoring, automation and retry actions.

## Required Screens

1. Growth command center.
2. WhatsApp inbox.
3. Conversation detail.
4. Operational cases queue.
5. Daily agenda.
6. Leads.
7. Opportunities.
8. WhatsApp templates/automations.
9. Reporting and monitor analytics.

## Guardrails

- Separate human reply workflows from automation suggestions.
- Failed delivery/retry states must be visible.
- Assignment and ownership should be easy to scan.
