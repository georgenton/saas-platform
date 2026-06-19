# Claude Design validation workflow

Date: 2026-06-19

Claude Design is the frontend visual source of truth. The production React app
must be compared against these slices before adding new frontend surfaces.

## What is validated

This workflow covers the local design references:

- `docs/design/claude-design/00-platform-shell`
- `docs/design/claude-design/01-product-command-center`
- `docs/design/claude-design/02-invoicing-workspace`
- `docs/design/claude-design/03-invoicing-sri-progressive-disclosure`
- `docs/design/claude-design/04-access-login-gateway`
- `docs/design/claude-design/05-invoicing-settings-sri`
- `docs/design/claude-design/06-invoicing-customer-draft-flow`
- `docs/design/claude-design/07-invoicing-items-flow`
- `docs/design/claude-design/08-invoicing-document-review`
- `docs/design/claude-design/09-invoicing-sri-submission-lifecycle`
- `docs/design/claude-design/10-invoicing-payment-email-delivery-closeout`
- `docs/design/claude-design/11-invoicing-operational-polish-qa`

## Static validation

Run:

```bash
node tools/design/validate-claude-design-slices.mjs
```

This checks that every slice has:

- `index.html`
- `README.md`
- `notes.md`
- `components.md`
- `integration-plan.md`
- source JSX files
- mock JSON fixtures, except slice `00`
- browser error instrumentation via `window.__CLAUDE_VIEWER_ERRORS`
- pinned `transform-react-jsx` execution for the static viewers

## Visual/runtime validation

Do not use Vite to serve the Claude Design viewers. Vite treats `.jsx` as app
source and can transform the design files before Babel standalone runs, which
causes false runtime errors such as `require is not defined`.

Use a pure static server instead:

```bash
python3 -m http.server 4189 --bind 127.0.0.1 --directory docs/design/claude-design
```

Open each slice at:

```text
http://127.0.0.1:4189/<slice>/index.html
```

Minimum pass criteria:

- `#root` has rendered children.
- The page has visible text and controls.
- `window.__CLAUDE_VIEWER_ERRORS` is an empty array.
- Desktop and mobile modes render.
- Moods change the shell and content, not just the background.

## Production comparison

Production reference:

```text
https://saas-platform-api-platform.vercel.app/
```

Current route targets:

- `#platform-home`
- `#invoicing-domain`
- `#invoicing-settings-sri`
- `#invoicing-customer-draft`
- `#invoicing-items`
- `#invoicing-documents`
- `#invoicing-sri-lifecycle`
- `#invoicing-closeout`

If production is not visually equivalent to Claude Design, record the mismatch
instead of inventing a new UI. Remediation should follow the design source:
slice `00` for shell, slice `02` plus `11` for Invoicing workspace composition,
and slices `05` through `10` for subviews.
