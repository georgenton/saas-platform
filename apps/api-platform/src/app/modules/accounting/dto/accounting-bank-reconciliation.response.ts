import {
  TenantAccountingBankReconciliationControlRegistryView,
  TenantAccountingBankReconciliationControlView,
  TenantAccountingBankReconciliationWorkspaceView,
  TenantAccountingBankStatementBatchView,
  TenantAccountingBankStatementImportResultView,
  TenantAccountingBankStatementImportWorkspaceView,
  TenantAccountingBankStatementLineView,
  TenantAccountingBankStatementRegistryView,
  TenantAccountingPeriodCashCloseoutReadinessView,
  TenantAccountingPeriodReconciliationReadinessView,
  TenantAccountingReconciliationExceptionPacketView,
  TenantAccountingReconciliationExceptionResolutionPacketView,
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

export interface RequestAccountingReconciliationExceptionResolutionPacketRequestDto {
  period: string;
  year: number;
  decision: 'prepare' | 'resolve';
  resolutionType:
    | 'create_adjustment_recommended'
    | 'mark_timing_difference'
    | 'mark_external_bank_issue'
    | 'mark_journal_review_required';
  exceptionKeys?: string[];
  actorUserId?: string | null;
  actorEmail?: string | null;
  reason?: string | null;
  evidenceReference?: string | null;
}

export interface RecordAccountingBankReconciliationControlRequestDto {
  period: string;
  year: number;
  eventType:
    | 'match_packet_approved'
    | 'exception_packet_requested'
    | 'exception_resolution_prepared'
    | 'exception_resolved';
  status: 'recorded' | 'resolved' | 'needs_review' | 'blocked';
  source: string;
  actorUserId?: string | null;
  actorEmail?: string | null;
  reason?: string | null;
  evidenceReference?: string | null;
  payload?: Record<string, string | number | boolean | null>;
  blockers?: string[];
  impactChecklist?: string[];
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

export interface AccountingBankReconciliationControlResponseDto
  extends Omit<
    TenantAccountingBankReconciliationControlView,
    'occurredAt' | 'createdAt' | 'updatedAt'
  > {
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountingBankReconciliationControlRegistryResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  registryStatus: string;
  controls: AccountingBankReconciliationControlResponseDto[];
  latestControl: AccountingBankReconciliationControlResponseDto | null;
  summary: TenantAccountingBankReconciliationControlRegistryView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingReconciliationExceptionResolutionPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  resolutionStatus: string;
  decision: string;
  resolutionType: string;
  exceptionKeys: string[];
  resolvedExceptionKeys: string[];
  exceptionPacket: AccountingReconciliationExceptionPacketResponseDto;
  control: AccountingBankReconciliationControlResponseDto | null;
  impactChecklist: TenantAccountingReconciliationExceptionResolutionPacketView['impactChecklist'];
  summary: TenantAccountingReconciliationExceptionResolutionPacketView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingPeriodCashCloseoutReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  checks: TenantAccountingPeriodCashCloseoutReadinessView['checks'];
  statementRegistry: AccountingBankStatementRegistryResponseDto;
  reconciliationWorkspace: AccountingBankReconciliationWorkspaceResponseDto;
  controlRegistry: AccountingBankReconciliationControlRegistryResponseDto;
  exceptionPacket: AccountingReconciliationExceptionPacketResponseDto;
  summary: TenantAccountingPeriodCashCloseoutReadinessView['summary'];
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

export function toAccountingBankReconciliationControlResponseDto(
  view: TenantAccountingBankReconciliationControlView,
): AccountingBankReconciliationControlResponseDto {
  return {
    ...view,
    payload: { ...view.payload },
    blockers: [...view.blockers],
    impactChecklist: [...view.impactChecklist],
    occurredAt: view.occurredAt.toISOString(),
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toAccountingBankReconciliationControlRegistryResponseDto(
  view: TenantAccountingBankReconciliationControlRegistryView,
): AccountingBankReconciliationControlRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    registryStatus: view.registryStatus,
    controls: view.controls.map(toAccountingBankReconciliationControlResponseDto),
    latestControl: view.latestControl
      ? toAccountingBankReconciliationControlResponseDto(view.latestControl)
      : null,
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingReconciliationExceptionResolutionPacketResponseDto(
  view: TenantAccountingReconciliationExceptionResolutionPacketView,
): AccountingReconciliationExceptionResolutionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    resolutionStatus: view.resolutionStatus,
    decision: view.decision,
    resolutionType: view.resolutionType,
    exceptionKeys: [...view.exceptionKeys],
    resolvedExceptionKeys: [...view.resolvedExceptionKeys],
    exceptionPacket: toAccountingReconciliationExceptionPacketResponseDto(
      view.exceptionPacket,
    ),
    control: view.control
      ? toAccountingBankReconciliationControlResponseDto(view.control)
      : null,
    impactChecklist: view.impactChecklist.map((item) => ({ ...item })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingPeriodCashCloseoutReadinessResponseDto(
  view: TenantAccountingPeriodCashCloseoutReadinessView,
): AccountingPeriodCashCloseoutReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    checks: view.checks.map((check) => ({ ...check })),
    statementRegistry: toAccountingBankStatementRegistryResponseDto(
      view.statementRegistry,
    ),
    reconciliationWorkspace: toAccountingBankReconciliationWorkspaceResponseDto(
      view.reconciliationWorkspace,
    ),
    controlRegistry: toAccountingBankReconciliationControlRegistryResponseDto(
      view.controlRegistry,
    ),
    exceptionPacket: toAccountingReconciliationExceptionPacketResponseDto(
      view.exceptionPacket,
    ),
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
