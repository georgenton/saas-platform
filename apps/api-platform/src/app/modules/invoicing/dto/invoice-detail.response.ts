import { InvoiceDetailView } from '@saas-platform/invoicing-application';
import { toInvoiceItemResponseDto } from './invoice-item.response';

export interface InvoiceDetailResponseDto {
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
  items: ReturnType<typeof toInvoiceItemResponseDto>[];
  totals: {
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
  };
}

export const toInvoiceDetailResponseDto = (
  view: InvoiceDetailView,
): InvoiceDetailResponseDto => {
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
    items: view.items.map((item) => toInvoiceItemResponseDto(item)),
    totals: view.totals,
  };
};
