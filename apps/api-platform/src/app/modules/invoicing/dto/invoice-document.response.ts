import { InvoiceDocumentView } from '@saas-platform/invoicing-application';

export interface InvoiceDocumentResponseDto {
  issuer: {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
  };
  customer: {
    name: string;
    email: string | null;
    taxId: string | null;
  };
  invoice: {
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
}

export const toInvoiceDocumentResponseDto = (
  view: InvoiceDocumentView,
): InvoiceDocumentResponseDto => {
  const invoice = view.invoice.toPrimitives();

  return {
    issuer: view.issuer,
    customer: view.customer,
    invoice: {
      id: invoice.id,
      tenantId: invoice.tenantId,
      customerId: invoice.customerId,
      number: invoice.number,
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
  };
};
