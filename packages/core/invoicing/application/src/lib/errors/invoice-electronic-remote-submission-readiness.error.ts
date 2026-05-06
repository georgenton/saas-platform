export class InvoiceElectronicRemoteSubmissionReadinessError extends Error {
  constructor(tenantSlug: string, invoiceId: string, detail: string) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" is not ready for remote SRI offline submission: ${detail}`,
    );
    this.name = 'InvoiceElectronicRemoteSubmissionReadinessError';
  }
}
