import { useQuery } from '@tanstack/react-query';
import {
  fetchElectronicSandboxReadiness,
  fetchElectronicSignatureMaterialInspection,
  fetchElectronicSignatureSettings,
  fetchElectronicSubmissionSettings,
  fetchInvoiceDocumentDraftingAssist,
  fetchInvoiceNumberingSettings,
  fetchInvoicingReportSummary,
  fetchIssuerProfile,
  listCustomers,
  listInvoices,
  listTaxRates,
} from '../../app/api';
import type {
  CustomerResponse,
  ElectronicSandboxReadinessResponse,
  ElectronicSignatureMaterialInspectionResponse,
  ElectronicSignatureSettingsResponse,
  ElectronicSubmissionSettingsResponse,
  InvoiceDocumentDraftingAssistResponse,
  InvoiceNumberingSettingsResponse,
  InvoiceSummaryResponse,
  InvoicingReportSummaryResponse,
  IssuerProfileResponse,
  TaxRateResponse,
} from '../../app/types';

function tokenScope(token: string): string {
  if (!token) {
    return 'anonymous';
  }

  let hash = 2166136261;

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `token:${(hash >>> 0).toString(16)}`;
}

export const invoicingQueryKeys = {
  all: ['invoicing'] as const,
  workspace: (token: string, tenantSlug: string) =>
    ['invoicing', 'workspace', tokenScope(token), tenantSlug] as const,
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

export type InvoicingWorkspaceQueryData = {
  customers: CustomerResponse[];
  taxRates: TaxRateResponse[];
  invoices: InvoiceSummaryResponse[];
  invoicingReport: InvoicingReportSummaryResponse | null;
  invoiceDocumentDraftingAssist: InvoiceDocumentDraftingAssistResponse | null;
  electronicSandboxReadiness: ElectronicSandboxReadinessResponse | null;
  electronicSignatureMaterialInspection: ElectronicSignatureMaterialInspectionResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  electronicSignatureSettings: ElectronicSignatureSettingsResponse | null;
  issuerProfile: IssuerProfileResponse | null;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
};

async function loadOptionalInvoicingSettings(
  token: string,
  tenantSlug: string,
): Promise<{
  electronicSandboxReadiness: ElectronicSandboxReadinessResponse | null;
  electronicSignatureMaterialInspection: ElectronicSignatureMaterialInspectionResponse | null;
  electronicSubmissionSettings: ElectronicSubmissionSettingsResponse | null;
  electronicSignatureSettings: ElectronicSignatureSettingsResponse | null;
  issuerProfile: IssuerProfileResponse | null;
  invoiceNumberingSettings: InvoiceNumberingSettingsResponse | null;
}> {
  const [
    electronicSandboxReadiness,
    electronicSignatureMaterialInspection,
    electronicSubmissionSettings,
    electronicSignatureSettings,
    issuerProfile,
    invoiceNumberingSettings,
  ] = await Promise.all([
    fetchElectronicSandboxReadiness(token, tenantSlug).catch(() => null),
    fetchElectronicSignatureMaterialInspection(token, tenantSlug).catch(
      () => null,
    ),
    fetchElectronicSubmissionSettings(token, tenantSlug).catch(() => null),
    fetchElectronicSignatureSettings(token, tenantSlug).catch(() => null),
    fetchIssuerProfile(token, tenantSlug).catch(() => null),
    fetchInvoiceNumberingSettings(token, tenantSlug).catch(() => null),
  ]);

  return {
    electronicSandboxReadiness,
    electronicSignatureMaterialInspection,
    electronicSubmissionSettings,
    electronicSignatureSettings,
    issuerProfile,
    invoiceNumberingSettings,
  };
}

export function useInvoicingWorkspaceQuery(
  token: string,
  tenantSlug: string | null,
  isEnabled: boolean,
) {
  return useQuery({
    enabled: Boolean(token && tenantSlug && isEnabled),
    queryFn: async (): Promise<InvoicingWorkspaceQueryData> => {
      if (!tenantSlug) {
        return {
          customers: [],
          taxRates: [],
          invoices: [],
          invoicingReport: null,
          invoiceDocumentDraftingAssist: null,
          electronicSandboxReadiness: null,
          electronicSignatureMaterialInspection: null,
          electronicSubmissionSettings: null,
          electronicSignatureSettings: null,
          issuerProfile: null,
          invoiceNumberingSettings: null,
        };
      }

      const [
        customers,
        taxRates,
        invoices,
        invoicingReport,
        settings,
        invoiceDocumentDraftingAssist,
      ] = await Promise.all([
        listCustomers(token, tenantSlug),
        listTaxRates(token, tenantSlug),
        listInvoices(token, tenantSlug),
        fetchInvoicingReportSummary(token, tenantSlug),
        loadOptionalInvoicingSettings(token, tenantSlug),
        fetchInvoiceDocumentDraftingAssist(token, tenantSlug).catch(() => null),
      ]);

      return {
        customers,
        taxRates,
        invoices,
        invoicingReport,
        invoiceDocumentDraftingAssist,
        electronicSandboxReadiness: settings.electronicSandboxReadiness,
        electronicSignatureMaterialInspection:
          settings.electronicSignatureMaterialInspection,
        electronicSubmissionSettings: settings.electronicSubmissionSettings,
        electronicSignatureSettings: settings.electronicSignatureSettings,
        issuerProfile: settings.issuerProfile,
        invoiceNumberingSettings: settings.invoiceNumberingSettings,
      };
    },
    queryKey: tenantSlug
      ? invoicingQueryKeys.workspace(token, tenantSlug)
      : ['invoicing', 'workspace', tokenScope(token), 'none'],
    staleTime: 60 * 1000,
  });
}
