---
'api-platform': minor
---

Harden tenant RBAC role management by enforcing protected owner-role policies.

This change prevents unsafe owner-role assignment and removal flows, ensures a tenant
keeps at least one owner, and returns explicit forbidden responses for policy violations.
