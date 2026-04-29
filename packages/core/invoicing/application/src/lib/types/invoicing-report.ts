import { Invoice } from '@saas-platform/invoicing-domain';
import { calculateInvoiceSettlement } from './invoice-view';

export interface InvoicingReportStatusView {
  status: string;
  count: number;
}

export interface InvoicingReportCurrencyTotalsView {
  currency: string;
  subtotalInCents: number;
  taxInCents: number;
  totalInCents: number;
  paidInCents: number;
  outstandingTotalInCents: number;
}

export interface InvoicingReportMonthlyTotalView {
  month: string;
  currency: string;
  invoiceCount: number;
  totalInCents: number;
  taxInCents: number;
}

export interface InvoicingReportSummaryView {
  generatedAt: string;
  customerCount: number;
  invoiceCount: number;
  statusBreakdown: InvoicingReportStatusView[];
  totalsByCurrency: InvoicingReportCurrencyTotalsView[];
  monthlyTotals: InvoicingReportMonthlyTotalView[];
}

export function buildInvoicingReportSummary(input: {
  customerCount: number;
  invoices: Invoice[];
  itemsByInvoiceId: Map<string, { lineTotalInCents: number; lineTaxInCents: number }[]>;
  paymentsByInvoiceId: Map<string, { amountInCents: number }[]>;
}): InvoicingReportSummaryView {
  const statusCounts = new Map<string, number>();
  const totalsByCurrency = new Map<
    string,
    InvoicingReportCurrencyTotalsView
  >();
  const monthlyTotals = new Map<string, InvoicingReportMonthlyTotalView>();

  for (const invoice of input.invoices) {
    const normalizedStatus = invoice.status.toLowerCase();
    statusCounts.set(normalizedStatus, (statusCounts.get(normalizedStatus) ?? 0) + 1);

    const items = input.itemsByInvoiceId.get(invoice.id) ?? [];
    const subtotalInCents = items.reduce(
      (sum, item) => sum + item.lineTotalInCents,
      0,
    );
    const taxInCents = items.reduce((sum, item) => sum + item.lineTaxInCents, 0);
    const totalInCents = subtotalInCents + taxInCents;

    const currencyBucket =
      totalsByCurrency.get(invoice.currency) ??
      {
        currency: invoice.currency,
        subtotalInCents: 0,
        taxInCents: 0,
        totalInCents: 0,
        paidInCents: 0,
        outstandingTotalInCents: 0,
      };
    const payments = input.paymentsByInvoiceId.get(invoice.id) ?? [];
    const settlement = calculateInvoiceSettlement(totalInCents, payments);

    currencyBucket.subtotalInCents += subtotalInCents;
    currencyBucket.taxInCents += taxInCents;
    currencyBucket.totalInCents += totalInCents;
    currencyBucket.paidInCents += settlement.paidInCents;
    currencyBucket.outstandingTotalInCents += settlement.balanceDueInCents;

    totalsByCurrency.set(invoice.currency, currencyBucket);

    const month = invoice.issuedAt.toISOString().slice(0, 7);
    const monthlyKey = `${month}:${invoice.currency}`;
    const monthlyBucket =
      monthlyTotals.get(monthlyKey) ??
      {
        month,
        currency: invoice.currency,
        invoiceCount: 0,
        totalInCents: 0,
        taxInCents: 0,
      };

    monthlyBucket.invoiceCount += 1;
    monthlyBucket.totalInCents += totalInCents;
    monthlyBucket.taxInCents += taxInCents;
    monthlyTotals.set(monthlyKey, monthlyBucket);
  }

  return {
    generatedAt: new Date().toISOString(),
    customerCount: input.customerCount,
    invoiceCount: input.invoices.length,
    statusBreakdown: Array.from(statusCounts.entries())
      .map(([status, count]) => ({
        status,
        count,
      }))
      .sort((left, right) => left.status.localeCompare(right.status)),
    totalsByCurrency: Array.from(totalsByCurrency.values()).sort((left, right) =>
      left.currency.localeCompare(right.currency),
    ),
    monthlyTotals: Array.from(monthlyTotals.values()).sort((left, right) =>
      left.month === right.month
        ? left.currency.localeCompare(right.currency)
        : left.month.localeCompare(right.month),
    ),
  };
}
