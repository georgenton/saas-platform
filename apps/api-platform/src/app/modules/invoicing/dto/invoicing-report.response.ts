import { InvoicingReportSummaryView } from '@saas-platform/invoicing-application';

export interface InvoicingReportSummaryResponseDto {
  generatedAt: string;
  customerCount: number;
  invoiceCount: number;
  statusBreakdown: {
    status: string;
    count: number;
  }[];
  totalsByCurrency: {
    currency: string;
    subtotalInCents: number;
    taxInCents: number;
    totalInCents: number;
    paidInCents: number;
    outstandingTotalInCents: number;
  }[];
  monthlyTotals: {
    month: string;
    currency: string;
    invoiceCount: number;
    totalInCents: number;
    taxInCents: number;
  }[];
}

export const toInvoicingReportSummaryResponseDto = (
  view: InvoicingReportSummaryView,
): InvoicingReportSummaryResponseDto => ({
  generatedAt: view.generatedAt,
  customerCount: view.customerCount,
  invoiceCount: view.invoiceCount,
  statusBreakdown: view.statusBreakdown,
  totalsByCurrency: view.totalsByCurrency,
  monthlyTotals: view.monthlyTotals,
});
