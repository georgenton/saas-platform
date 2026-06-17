# Claude Design Prompts

This folder stores prompts that should be pasted into Claude Design slice by
slice.

Current sequence:

1. `00-platform-shell.md`
2. `01-access-login-gateway.md`
3. `05-invoicing-settings-sri.md`
4. `06-invoicing-customer-draft-flow.md`
5. `07-invoicing-items-flow.md`

After Claude Design exports a ZIP, place it under:

```txt
docs/design/claude-design/<slice-name>/
```

Then ask Codex to review and integrate the delivery against the real backend,
OpenAPI contract and frontend handoff docs.
