import { InvoiceSummaryView } from '@saas-platform/invoicing-application';

export interface InvoiceSummaryResponseDto {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
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
    status: data.status,
    currency: data.currency,
    issuedAt: data.issuedAt.toISOString(),
    dueAt: data.dueAt?.toISOString() ?? null,
    notes: data.notes ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    itemCount: view.itemCount,
    totals: view.totals,
  };
};
