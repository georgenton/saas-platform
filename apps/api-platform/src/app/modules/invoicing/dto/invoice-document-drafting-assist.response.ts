import { TenantInvoiceDocumentDraftingAssistView } from '@saas-platform/invoicing-application';

export interface InvoiceDocumentDraftingAssistResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    readinessStatus: 'ready' | 'needs_attention' | 'blocked';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  checklist: Array<{
    key: string;
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  documentGuidance: Array<{
    documentCode: '01' | '04' | '05' | '06' | '07';
    label: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    recommendedUse: string;
  }>;
  reportSnapshot: {
    customerCount: number;
    invoiceCount: number;
    outstandingTotalInCents: number;
    dominantStatus: string | null;
    busiestMonth: string | null;
  };
  draftingHints: Array<{
    key: string;
    title: string;
    objective: string;
    whenToUse: string;
    recommendedInputs: string[];
    caution: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export function toInvoiceDocumentDraftingAssistResponseDto(
  view: TenantInvoiceDocumentDraftingAssistView,
): InvoiceDocumentDraftingAssistResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: view.summary,
    checklist: view.checklist.map((entry) => ({ ...entry })),
    documentGuidance: view.documentGuidance.map((entry) => ({ ...entry })),
    reportSnapshot: view.reportSnapshot,
    draftingHints: view.draftingHints.map((entry) => ({
      ...entry,
      recommendedInputs: [...entry.recommendedInputs],
    })),
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
  };
}
