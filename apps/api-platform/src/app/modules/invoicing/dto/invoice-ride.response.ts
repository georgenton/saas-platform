import { InvoiceRideView } from '@saas-platform/invoicing-application';

export interface InvoiceRideResponseDto {
  issuer: {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
    legalName: string;
    commercialName: string | null;
    taxId: string | null;
    environment: string | null;
    emissionType: string | null;
    accountingObligated: boolean | null;
    specialTaxpayerCode: string | null;
    rimpeTaxpayerType: string | null;
    matrixAddress: string | null;
    establishmentAddress: string | null;
  };
  customer: {
    name: string;
    email: string | null;
    taxId: string | null;
    identificationType: string | null;
    identification: string | null;
    billingAddress: string | null;
  };
  invoice: {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    documentCode: string | null;
    establishmentCode: string | null;
    emissionPointCode: string | null;
    sequenceNumber: number | null;
    buyerIdentificationType: string | null;
    buyerIdentification: string | null;
    buyerName: string | null;
    buyerAddress: string | null;
    electronicStatus: string | null;
    accessKey: string | null;
    authorizationNumber: string | null;
    authorizedAt: string | null;
    electronicStatusMessage: string | null;
    signedAt: string | null;
    submittedAt: string | null;
    submissionReference: string | null;
    status: string;
    currency: string;
    issuedAt: string;
    dueAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };
  lines: {
    id: string;
    position: number;
    description: string;
    quantity: number;
    unitPriceInCents: number;
    lineSubtotalInCents: number;
    taxRateId: string | null;
    taxRateName: string | null;
    taxRatePercentage: number | null;
    lineTaxInCents: number;
    lineTotalInCents: number;
  }[];
  totals: {
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
  };
  ride: {
    documentLabel: string;
    environmentLabel: string;
    emissionTypeLabel: string;
    sequenceDisplay: string | null;
    electronicStatusLabel: string;
    canBePrintedAsAuthorized: boolean;
    accessKey: string | null;
    accessKeyChunks: string[];
    authorizationNumber: string | null;
    authorizedAt: string | null;
    authorizationMessage: string | null;
    additionalInfoFields: Array<{
      label: string;
      value: string;
    }>;
  };
}

export const toInvoiceRideResponseDto = (
  view: InvoiceRideView,
): InvoiceRideResponseDto => {
  const invoice = view.invoice.toPrimitives();

  return {
    issuer: view.issuer,
    customer: view.customer,
    invoice: {
      id: invoice.id,
      tenantId: invoice.tenantId,
      customerId: invoice.customerId,
      number: invoice.number,
      documentCode: invoice.documentCode ?? null,
      establishmentCode: invoice.establishmentCode ?? null,
      emissionPointCode: invoice.emissionPointCode ?? null,
      sequenceNumber: invoice.sequenceNumber ?? null,
      buyerIdentificationType: invoice.buyerIdentificationType ?? null,
      buyerIdentification: invoice.buyerIdentification ?? null,
      buyerName: invoice.buyerName ?? null,
      buyerAddress: invoice.buyerAddress ?? null,
      electronicStatus: invoice.electronicStatus ?? null,
      accessKey: invoice.accessKey ?? null,
      authorizationNumber: invoice.authorizationNumber ?? null,
      authorizedAt: invoice.authorizedAt?.toISOString() ?? null,
      electronicStatusMessage: invoice.electronicStatusMessage ?? null,
      signedAt: invoice.signedAt?.toISOString() ?? null,
      submittedAt: invoice.submittedAt?.toISOString() ?? null,
      submissionReference: invoice.submissionReference ?? null,
      status: invoice.status,
      currency: invoice.currency,
      issuedAt: invoice.issuedAt.toISOString(),
      dueAt: invoice.dueAt?.toISOString() ?? null,
      notes: invoice.notes ?? null,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    },
    lines: view.lines,
    totals: view.totals,
    ride: {
      documentLabel: view.ride.documentLabel,
      environmentLabel: view.ride.environmentLabel,
      emissionTypeLabel: view.ride.emissionTypeLabel,
      sequenceDisplay: view.ride.sequenceDisplay,
      electronicStatusLabel: view.ride.electronicStatusLabel,
      canBePrintedAsAuthorized: view.ride.canBePrintedAsAuthorized,
      accessKey: view.ride.accessKey,
      accessKeyChunks: view.ride.accessKeyChunks,
      authorizationNumber: view.ride.authorizationNumber,
      authorizedAt: view.ride.authorizedAt?.toISOString() ?? null,
      authorizationMessage: view.ride.authorizationMessage,
      additionalInfoFields: view.ride.additionalInfoFields,
    },
  };
};
