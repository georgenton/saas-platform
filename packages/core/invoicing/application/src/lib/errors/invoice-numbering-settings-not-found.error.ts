export class InvoiceNumberingSettingsNotFoundError extends Error {
  constructor(tenantSlug: string) {
    super(`Invoice numbering settings were not found for tenant "${tenantSlug}".`);
  }
}
