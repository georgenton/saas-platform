---
"api-platform": minor
---

Add the first React onboarding shell for authenticated session and invitation flows.

This change introduces the new `web-platform` app to consume `/api/auth/me`, render session-driven onboarding states, review pending invitations, switch current tenancy, and manage tenant invitations from a visible UI.

It also adds SMTP-backed invitation delivery so invitation creation and resend flows can send real email messages with deep links into the web onboarding experience when SMTP is configured.
