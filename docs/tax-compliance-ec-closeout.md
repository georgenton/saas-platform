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
7. Map accounting bridge hints against suggested chart-of-accounts codes.
8. Request the tax review assistant packet.
9. Generate the period closeout report.

## Smoke

Run the operational smoke against a local API:

```sh
pnpm smoke:ec:tax-compliance-operational
```

The smoke covers purchase evidence, supplier readiness, VAT, income tax,
withholdings, rules, accountant workbench, audit readiness, filing handoff,
annexes readiness, accounting bridge preview, accounting bridge mapping,
assistant packet, and closeout report.

## Product Boundary

Tax Compliance EC is now cataloged as `tax-compliance-ec` with its own
read/manage permissions. It may prepare accounting bridge mappings so the tax
operator and accountant can align evidence with a future chart of accounts.
It still does not own journals, ledgers, balances, or formal accounting close.

Parties cleanup now exposes correction packets per priority party and can apply
fiscal corrections back into the current Parties backing store. Duplicate merge
decisions remain outside this closeout flow.

The operational closeout now includes a read-only suggested account catalog,
Growth reminder packets for due obligations, and an accounting readiness packet
that recommends whether the tenant should stay in Tax Compliance EC or graduate
to a future Accounting product. The transversal AI layer also registers a Tax
Compliance EC Review Assistant prompt pack, but its output remains advisory and
requires human review before external filing, payment, or accountant handoff.
