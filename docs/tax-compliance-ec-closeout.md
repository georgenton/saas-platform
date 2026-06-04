# Tax Compliance EC Closeout

Tax Compliance EC turns invoicing, parties, ecommerce evidence, purchases,
withholdings, periods, and human handoff into an operational tax control room.

The product intentionally stops before full accounting. It can explain evidence,
prepare review packets, track readiness, and record external filing/payment
handoff, but it does not present SRI forms, generate official annex XML, or
post journal entries.

## Closeout Flow

1. Review obligation settings, taxpayer profile, and period workspace.
2. Prepare sales, purchases, VAT, income tax, withholding, and annex readiness.
3. Approve VAT for external filing and review withholding support.
4. Build the evidence vault and operational closeout state.
5. Record external filing/payment handoff after human completion.
6. Review the accounting bridge preview as a signal for future Accounting.
7. Request the tax review assistant packet.
8. Generate the period closeout report.

## Smoke

Run the operational smoke against a local API:

```sh
pnpm smoke:ec:tax-compliance-operational
```

The smoke covers purchase evidence, supplier readiness, VAT, income tax,
withholdings, rules, accountant workbench, audit readiness, filing handoff,
annexes readiness, accounting bridge preview, assistant packet, and closeout
report.
