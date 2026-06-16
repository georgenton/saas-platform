export const invoicingQueryKeys = {
  all: ['invoicing'] as const,
  electronicProfile: (tenantSlug: string | null) =>
    [...invoicingQueryKeys.all, tenantSlug, 'electronic-profile'] as const,
  electronicSubmission: (tenantSlug: string | null) =>
    [...invoicingQueryKeys.all, tenantSlug, 'electronic-submission'] as const,
  invoices: (tenantSlug: string | null) =>
    [...invoicingQueryKeys.all, tenantSlug, 'invoices'] as const,
  numbering: (tenantSlug: string | null, documentCode = '01') =>
    [...invoicingQueryKeys.all, tenantSlug, 'numbering', documentCode] as const,
  reportSummary: (tenantSlug: string | null) =>
    [...invoicingQueryKeys.all, tenantSlug, 'report-summary'] as const,
};
