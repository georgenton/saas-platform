export class InvalidDebitNoteSourceInvoiceError extends Error {
  constructor(tenantSlug: string, sourceInvoiceId: string) {
    super(
      `Invoice "${sourceInvoiceId}" in tenant "${tenantSlug}" cannot be used as the source for a debit note.`,
    );
  }
}
