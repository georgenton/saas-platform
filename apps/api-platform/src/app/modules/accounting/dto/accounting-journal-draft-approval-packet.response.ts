import { TenantAccountingJournalDraftApprovalPacketView } from '@saas-platform/accounting-domain';

export interface RequestAccountingJournalDraftApprovalPacketRequestDto {
  period: string;
  year: number;
  draftEntryKeys?: string[];
  decision: 'approve' | 'reject';
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
}

export interface AccountingJournalDraftApprovalPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  approvalStatus: string;
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  approvedDraftEntryKeys: string[];
  rejectedDraftEntryKeys: string[];
  draftEntries: Array<{
    draftEntryKey: string;
    label: string;
    source: string;
    currency: string;
    lines: Array<{
      lineKey: string;
      accountCode: string | null;
      accountName: string | null;
      debitInCents: number;
      creditInCents: number;
      sourceEntryKey: string;
      accountHint: string;
      notes: string[];
    }>;
    totals: {
      debitInCents: number;
      creditInCents: number;
      balanced: boolean;
    };
    blockers: string[];
  }>;
  summary: {
    requestedDraftEntryCount: number;
    approvedDraftEntryCount: number;
    rejectedDraftEntryCount: number;
    blockedDraftEntryCount: number;
    balancedDraftCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingJournalDraftApprovalPacketResponseDto(
  view: TenantAccountingJournalDraftApprovalPacketView,
): AccountingJournalDraftApprovalPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    approvalStatus: view.approvalStatus,
    reviewerUserId: view.reviewerUserId,
    reviewerEmail: view.reviewerEmail,
    note: view.note,
    approvedDraftEntryKeys: [...view.approvedDraftEntryKeys],
    rejectedDraftEntryKeys: [...view.rejectedDraftEntryKeys],
    draftEntries: view.draftEntries.map((entry) => ({
      ...entry,
      lines: entry.lines.map((line) => ({
        ...line,
        notes: [...line.notes],
      })),
      totals: { ...entry.totals },
      blockers: [...entry.blockers],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
