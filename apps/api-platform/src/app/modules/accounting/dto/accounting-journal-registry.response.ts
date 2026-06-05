import {
  TenantAccountingJournalEntryCreationResultView,
  TenantAccountingJournalEntryView,
  TenantAccountingJournalRegistryView,
} from '@saas-platform/accounting-domain';

export interface CreateAccountingJournalEntriesRequestDto {
  period: string;
  year: number;
  draftEntryKeys?: string[];
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
}

export interface AccountingJournalEntryResponseDto {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: string;
  status: string;
  label: string;
  currency: string;
  lines: TenantAccountingJournalEntryView['lines'];
  totals: TenantAccountingJournalEntryView['totals'];
  approvalStatus: string;
  approvedByUserId: string | null;
  approvedByEmail: string | null;
  approvedAt: string | null;
  sourceDraftEntryKey: string | null;
  sourceApprovalPacketKey: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountingJournalEntryCreationResultResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  creationStatus: string;
  createdEntries: AccountingJournalEntryResponseDto[];
  approvalStatus: string;
  summary: {
    requestedDraftEntryCount: number;
    createdEntryCount: number;
    blockedDraftEntryCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingJournalRegistryResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  registryStatus: string;
  entries: AccountingJournalEntryResponseDto[];
  summary: {
    entryCount: number;
    approvedEntryCount: number;
    postedPreviewEntryCount: number;
    voidedEntryCount: number;
    balancedEntryCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingJournalEntryResponseDto(
  entry: TenantAccountingJournalEntryView,
): AccountingJournalEntryResponseDto {
  return {
    ...entry,
    lines: entry.lines.map((line) => ({
      ...line,
      notes: [...line.notes],
    })),
    totals: { ...entry.totals },
    approvedAt: entry.approvedAt?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export function toAccountingJournalEntryCreationResultResponseDto(
  view: TenantAccountingJournalEntryCreationResultView,
): AccountingJournalEntryCreationResultResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    creationStatus: view.creationStatus,
    createdEntries: view.createdEntries.map(toAccountingJournalEntryResponseDto),
    approvalStatus: view.approvalStatus,
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingJournalRegistryResponseDto(
  view: TenantAccountingJournalRegistryView,
): AccountingJournalRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    registryStatus: view.registryStatus,
    entries: view.entries.map(toAccountingJournalEntryResponseDto),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
