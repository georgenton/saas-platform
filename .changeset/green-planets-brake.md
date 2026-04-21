---
'api-platform': minor
---

Introduce provider-backed JWT verification with configurable verifier selection.

This change separates JWT verification behind a dedicated contract, adds a provider-oriented
RS256 verifier with issuer, audience, and temporal claim validation, and keeps a local verifier
available as a development fallback. The authentication guard now depends on the verifier contract
instead of embedding token verification logic directly.
