import { Invoice, InvoiceItem } from '@saas-platform/invoicing-domain';

export interface InvoiceTotalsView {
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
}

export interface InvoiceSummaryView {
  invoice: Invoice;
  itemCount: number;
  totals: InvoiceTotalsView;
}

export interface InvoiceDetailView {
  invoice: Invoice;
  items: InvoiceItem[];
  totals: InvoiceTotalsView;
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
): InvoiceTotalsView {
  const subtotalInCents = items.reduce(
    (sum, item) => sum + item.lineTotalInCents,
    0,
  );
  const taxInCents = 0;

  return {
    subtotalInCents,
    taxInCents,
    totalInCents: subtotalInCents + taxInCents,
  };
}
