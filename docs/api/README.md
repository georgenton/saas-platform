# API Contract

This folder stores the generated OpenAPI contract used for local backend QA and
Claude Design frontend handoff.

## Files

- `openapi.json`: generated OpenAPI 3.1 contract from Nest controllers.

## Local Endpoints

- `GET /api/openapi.json`: serves the generated contract from the API.
- `GET /api/docs`: small local documentation page with a contract link.

## Commands

- `pnpm openapi:generate`: regenerate contract artifacts.
- `pnpm openapi:check`: regenerate and fail if committed contract artifacts are
  stale.

## Current Scope

The backend is intentionally frozen through Full Accounting completion closeout
1.8. Use this contract to design, test and polish frontend screens before
opening more product backlog.

## Contract Maturity

This first pass enumerates routes and product tags. DTO schemas are intentionally
generic and should be hardened product by product as Claude Design starts using
each screen contract.
