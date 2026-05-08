export class InvoiceNumberingSettingsNotFoundError extends Error {
  constructor(tenantSlug: string, documentCode = '01') {
    super(
      `Invoice numbering settings for document code "${documentCode}" were not found for tenant "${tenantSlug}".`,
    );
  }
}
