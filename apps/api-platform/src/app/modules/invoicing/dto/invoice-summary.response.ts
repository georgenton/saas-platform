import { InvoiceSummaryView } from '@saas-platform/invoicing-application';

export interface InvoiceSummaryResponseDto {
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
  itemCount: number;
  totals: {
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
  };
  settlement: {
    paidInCents: number;
    balanceDueInCents: number;
    isFullyPaid: boolean;
  };
}

export const toInvoiceSummaryResponseDto = (
  view: InvoiceSummaryView,
): InvoiceSummaryResponseDto => {
  const data = view.invoice.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    customerId: data.customerId,
    number: data.number,
    documentCode: data.documentCode ?? null,
    establishmentCode: data.establishmentCode ?? null,
    emissionPointCode: data.emissionPointCode ?? null,
    sequenceNumber: data.sequenceNumber ?? null,
    buyerIdentificationType: data.buyerIdentificationType ?? null,
    buyerIdentification: data.buyerIdentification ?? null,
    buyerName: data.buyerName ?? null,
    buyerAddress: data.buyerAddress ?? null,
    electronicStatus: data.electronicStatus ?? null,
    accessKey: data.accessKey ?? null,
    authorizationNumber: data.authorizationNumber ?? null,
    authorizedAt: data.authorizedAt?.toISOString() ?? null,
    electronicStatusMessage: data.electronicStatusMessage ?? null,
    signedAt: data.signedAt?.toISOString() ?? null,
    submittedAt: data.submittedAt?.toISOString() ?? null,
    submissionReference: data.submissionReference ?? null,
    status: data.status,
    currency: data.currency,
    issuedAt: data.issuedAt.toISOString(),
    dueAt: data.dueAt?.toISOString() ?? null,
    notes: data.notes ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    itemCount: view.itemCount,
    totals: view.totals,
    settlement: view.settlement,
  };
};
