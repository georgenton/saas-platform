import { InvoiceElectronicStatus } from '@saas-platform/invoicing-domain';

export class InvoiceAuthorizationDataRequiredError extends Error {
  constructor(
    tenantSlug: string,
    invoiceId: string,
    electronicStatus: InvoiceElectronicStatus,
  ) {
    super(
      `Invoice "${invoiceId}" in tenant "${tenantSlug}" requires access key and authorization number when electronic status is "${electronicStatus}".`,
    );
    this.name = 'InvoiceAuthorizationDataRequiredError';
  }
}
