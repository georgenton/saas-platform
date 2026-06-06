import {
  TenantAccountingBankReconciliationWorkspaceView,
  TenantAccountingBankStatementBatchView,
  TenantAccountingBankStatementImportResultView,
  TenantAccountingBankStatementImportWorkspaceView,
  TenantAccountingBankStatementLineView,
  TenantAccountingBankStatementRegistryView,
  TenantAccountingPeriodReconciliationReadinessView,
  TenantAccountingReconciliationExceptionPacketView,
  TenantAccountingReconciliationMatchPacketView,
} from '@saas-platform/accounting-domain';

export interface AccountingBankStatementImportLineRequestDto {
  accountCode?: string | null;
  accountName?: string | null;
  postedAt?: string | null;
  description?: string | null;
  direction?: 'inflow' | 'outflow' | null;
  amountInCents?: number | null;
  currency?: string | null;
  reference?: string | null;
  externalLineId?: string | null;
}

export interface AccountingBankStatementImportPreviewRequestDto {
  period: string;
  year: number;
  source: 'manual' | 'json' | 'csv';
  originalFileName?: string | null;
  lines: AccountingBankStatementImportLineRequestDto[];
}

export interface RecordAccountingBankStatementImportRequestDto
  extends AccountingBankStatementImportPreviewRequestDto {
  importedByUserId?: string | null;
  importedByEmail?: string | null;
  notes?: string | null;
}

export interface RequestAccountingReconciliationMatchPacketRequestDto {
  period: string;
  year: number;
  candidateKeys?: string[];
  decision: 'prepare' | 'approve';
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
}

export interface AccountingBankStatementLineResponseDto
  extends Omit<TenantAccountingBankStatementLineView, 'postedAt' | 'createdAt' | 'updatedAt'> {
  postedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountingBankStatementBatchResponseDto
  extends Omit<TenantAccountingBankStatementBatchView, 'importedAt' | 'createdAt' | 'updatedAt' | 'lines'> {
  importedAt: string;
  lines: AccountingBankStatementLineResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountingBankStatementImportWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  importStatus: string;
  source: string;
  originalFileName: string | null;
  previewLines: Array<
    Omit<
      TenantAccountingBankStatementImportWorkspaceView['previewLines'][number],
      'postedAt'
    > & { postedAt: string | null }
  >;
  summary: TenantAccountingBankStatementImportWorkspaceView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingBankStatementImportResultResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  recordStatus: string;
  batch: AccountingBankStatementBatchResponseDto | null;
  preview: AccountingBankStatementImportWorkspaceResponseDto;
  summary: TenantAccountingBankStatementImportResultView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingBankStatementRegistryResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  registryStatus: string;
  batches: AccountingBankStatementBatchResponseDto[];
  lines: AccountingBankStatementLineResponseDto[];
  summary: TenantAccountingBankStatementRegistryView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingBankReconciliationWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  reconciliationStatus: string;
  bankAccounts: TenantAccountingBankReconciliationWorkspaceView['bankAccounts'];
  statementLines: Array<
    Omit<
      TenantAccountingBankReconciliationWorkspaceView['statementLines'][number],
      'postedAt'
    > & { postedAt: string }
  >;
  candidates: TenantAccountingBankReconciliationWorkspaceView['candidates'];
  summary: TenantAccountingBankReconciliationWorkspaceView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingReconciliationMatchPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  packetStatus: string;
  decision: string;
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  selectedCandidateKeys: string[];
  approvedCandidateKeys: string[];
  workspace: AccountingBankReconciliationWorkspaceResponseDto;
  approvalChecklist: TenantAccountingReconciliationMatchPacketView['approvalChecklist'];
  summary: TenantAccountingReconciliationMatchPacketView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingReconciliationExceptionPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  exceptionStatus: string;
  workspace: AccountingBankReconciliationWorkspaceResponseDto;
  exceptions: TenantAccountingReconciliationExceptionPacketView['exceptions'];
  summary: TenantAccountingReconciliationExceptionPacketView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingPeriodReconciliationReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  checks: TenantAccountingPeriodReconciliationReadinessView['checks'];
  workspace: AccountingBankReconciliationWorkspaceResponseDto;
  summary: TenantAccountingPeriodReconciliationReadinessView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingBankReconciliationWorkspaceResponseDto(
  view: TenantAccountingBankReconciliationWorkspaceView,
): AccountingBankReconciliationWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    reconciliationStatus: view.reconciliationStatus,
    bankAccounts: view.bankAccounts.map((account) => ({
      ...account,
      sourceJournalEntryIds: [...account.sourceJournalEntryIds],
    })),
    statementLines: view.statementLines.map((line) => ({
      ...line,
      postedAt: line.postedAt.toISOString(),
    })),
    candidates: view.candidates.map((candidate) => ({ ...candidate })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingBankStatementLineResponseDto(
  view: TenantAccountingBankStatementLineView,
): AccountingBankStatementLineResponseDto {
  return {
    ...view,
    raw: { ...view.raw },
    postedAt: view.postedAt.toISOString(),
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toAccountingBankStatementBatchResponseDto(
  view: TenantAccountingBankStatementBatchView,
): AccountingBankStatementBatchResponseDto {
  return {
    ...view,
    blockers: [...view.blockers],
    importedAt: view.importedAt.toISOString(),
    lines: view.lines.map(toAccountingBankStatementLineResponseDto),
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toAccountingBankStatementImportWorkspaceResponseDto(
  view: TenantAccountingBankStatementImportWorkspaceView,
): AccountingBankStatementImportWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    importStatus: view.importStatus,
    source: view.source,
    originalFileName: view.originalFileName,
    previewLines: view.previewLines.map((line) => ({
      ...line,
      postedAt: line.postedAt ? line.postedAt.toISOString() : null,
      blockers: [...line.blockers],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingBankStatementImportResultResponseDto(
  view: TenantAccountingBankStatementImportResultView,
): AccountingBankStatementImportResultResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    recordStatus: view.recordStatus,
    batch: view.batch
      ? toAccountingBankStatementBatchResponseDto(view.batch)
      : null,
    preview: toAccountingBankStatementImportWorkspaceResponseDto(view.preview),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingBankStatementRegistryResponseDto(
  view: TenantAccountingBankStatementRegistryView,
): AccountingBankStatementRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    registryStatus: view.registryStatus,
    batches: view.batches.map(toAccountingBankStatementBatchResponseDto),
    lines: view.lines.map(toAccountingBankStatementLineResponseDto),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingReconciliationMatchPacketResponseDto(
  view: TenantAccountingReconciliationMatchPacketView,
): AccountingReconciliationMatchPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    packetStatus: view.packetStatus,
    decision: view.decision,
    reviewerUserId: view.reviewerUserId,
    reviewerEmail: view.reviewerEmail,
    note: view.note,
    selectedCandidateKeys: [...view.selectedCandidateKeys],
    approvedCandidateKeys: [...view.approvedCandidateKeys],
    workspace: toAccountingBankReconciliationWorkspaceResponseDto(
      view.workspace,
    ),
    approvalChecklist: view.approvalChecklist.map((check) => ({ ...check })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingReconciliationExceptionPacketResponseDto(
  view: TenantAccountingReconciliationExceptionPacketView,
): AccountingReconciliationExceptionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    exceptionStatus: view.exceptionStatus,
    workspace: toAccountingBankReconciliationWorkspaceResponseDto(
      view.workspace,
    ),
    exceptions: view.exceptions.map((exception) => ({ ...exception })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingPeriodReconciliationReadinessResponseDto(
  view: TenantAccountingPeriodReconciliationReadinessView,
): AccountingPeriodReconciliationReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    checks: view.checks.map((check) => ({ ...check })),
    workspace: toAccountingBankReconciliationWorkspaceResponseDto(
      view.workspace,
    ),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
