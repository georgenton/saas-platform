import {
  AccountingReadinessStatus,
  TenantAccountingPeriodEvidenceVaultView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingAuditTrailWorkspaceUseCase } from './get-tenant-accounting-audit-trail-workspace.use-case';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingLedgerRegistryWorkspaceUseCase } from './get-tenant-accounting-ledger-registry-workspace.use-case';
import { GetTenantAccountingPeriodCashCloseoutReadinessUseCase } from './get-tenant-accounting-period-cash-closeout-readiness.use-case';
import { GetTenantAccountingPeriodCloseoutReportUseCase } from './get-tenant-accounting-period-closeout-report.use-case';
import { GetTenantAccountingTrialBalanceWorkspaceUseCase } from './get-tenant-accounting-trial-balance-workspace.use-case';
import { ListTenantAccountingBankReconciliationControlRegistryUseCase } from './list-tenant-accounting-bank-reconciliation-control-registry.use-case';
import { ListTenantAccountingBankStatementRegistryUseCase } from './list-tenant-accounting-bank-statement-registry.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';
import { ListTenantAccountingPeriodLockRegistryUseCase } from './list-tenant-accounting-period-lock-registry.use-case';

export class GetTenantAccountingPeriodEvidenceVaultUseCase {
  constructor(
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingLedgerRegistryWorkspaceUseCase: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly getTenantAccountingPeriodCloseoutReportUseCase: GetTenantAccountingPeriodCloseoutReportUseCase,
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly listTenantAccountingBankStatementRegistryUseCase: ListTenantAccountingBankStatementRegistryUseCase,
    private readonly listTenantAccountingBankReconciliationControlRegistryUseCase: ListTenantAccountingBankReconciliationControlRegistryUseCase,
    private readonly getTenantAccountingPeriodCashCloseoutReadinessUseCase: GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
    private readonly listTenantAccountingPeriodLockRegistryUseCase: ListTenantAccountingPeriodLockRegistryUseCase,
    private readonly getTenantAccountingAuditTrailWorkspaceUseCase: GetTenantAccountingAuditTrailWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodEvidenceVaultView> {
    const [
      journalRegistry,
      ledgerRegistry,
      trialBalance,
      closeoutReport,
      financialPreview,
      bankStatementRegistry,
      bankControlRegistry,
      cashCloseoutReadiness,
      periodLockRegistry,
      auditTrail,
    ] = await Promise.all([
      this.listTenantAccountingJournalRegistryUseCase.execute(input),
      this.getTenantAccountingLedgerRegistryWorkspaceUseCase.execute(input),
      this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute(input),
      this.getTenantAccountingPeriodCloseoutReportUseCase.execute(input),
      this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
      this.listTenantAccountingBankStatementRegistryUseCase.execute(input),
      this.listTenantAccountingBankReconciliationControlRegistryUseCase.execute(
        input,
      ),
      this.getTenantAccountingPeriodCashCloseoutReadinessUseCase.execute(input),
      this.listTenantAccountingPeriodLockRegistryUseCase.execute(input),
      this.getTenantAccountingAuditTrailWorkspaceUseCase.execute(input),
    ]);
    const artifacts: TenantAccountingPeriodEvidenceVaultView['artifacts'] = [
      artifact(
        'journal_registry',
        'Journal registry',
        'registry',
        toJournalRegistryReadiness(journalRegistry.registryStatus),
        `accounting://${input.tenantSlug}/${input.period}/journal-registry`,
        journalRegistry.summary.entryCount,
        journalRegistry.blockers.length,
      ),
      artifact(
        'ledger_registry',
        'Ledger registry',
        'workspace',
        ledgerRegistry.readinessStatus,
        `accounting://${input.tenantSlug}/${input.period}/ledger-registry`,
        ledgerRegistry.summary.accountCount,
        ledgerRegistry.blockers.length,
      ),
      artifact(
        'trial_balance',
        'Trial balance',
        'workspace',
        trialBalance.readinessStatus,
        `accounting://${input.tenantSlug}/${input.period}/trial-balance`,
        trialBalance.summary.accountCount,
        trialBalance.blockers.length,
      ),
      artifact(
        'closeout_report',
        'Closeout report',
        'report',
        toReportReadiness(closeoutReport.reportStatus),
        `accounting://${input.tenantSlug}/${input.period}/closeout-report`,
        closeoutReport.summary.sectionCount,
        closeoutReport.blockers.length,
      ),
      artifact(
        'financial_preview',
        'Financial statement preview',
        'preview',
        toFinancialPreviewReadiness(financialPreview.previewStatus),
        `accounting://${input.tenantSlug}/${input.period}/financial-preview`,
        financialPreview.summary.trialBalanceAccountCount,
        financialPreview.blockers.length,
      ),
      artifact(
        'bank_statement_registry',
        'Bank statement registry',
        'registry',
        toSimpleRegistryReadiness(bankStatementRegistry.registryStatus),
        `accounting://${input.tenantSlug}/${input.period}/bank-statements`,
        bankStatementRegistry.summary.lineCount,
        bankStatementRegistry.blockers.length,
      ),
      artifact(
        'bank_control_registry',
        'Bank reconciliation controls',
        'control',
        toSimpleRegistryReadiness(bankControlRegistry.registryStatus),
        `accounting://${input.tenantSlug}/${input.period}/bank-controls`,
        bankControlRegistry.summary.controlCount,
        bankControlRegistry.blockers.length,
      ),
      artifact(
        'cash_closeout',
        'Cash closeout readiness',
        'workspace',
        toCashCloseoutReadiness(cashCloseoutReadiness.readinessStatus),
        `accounting://${input.tenantSlug}/${input.period}/cash-closeout`,
        cashCloseoutReadiness.summary.checkCount,
        cashCloseoutReadiness.blockers.length,
      ),
      artifact(
        'period_lock_registry',
        'Period lock registry',
        'control',
        toPeriodLockRegistryReadiness(periodLockRegistry.registryStatus),
        `accounting://${input.tenantSlug}/${input.period}/period-lock-registry`,
        periodLockRegistry.summary.controlCount,
        periodLockRegistry.blockers.length,
      ),
      artifact(
        'audit_trail',
        'Audit trail',
        'registry',
        toAuditReadiness(auditTrail.auditStatus),
        `accounting://${input.tenantSlug}/${input.period}/audit-trail`,
        auditTrail.summary.eventCount,
        auditTrail.blockers.length,
      ),
    ];
    const blockers = [
      ...journalRegistry.blockers,
      ...ledgerRegistry.blockers,
      ...trialBalance.blockers,
      ...closeoutReport.blockers,
      ...financialPreview.blockers,
      ...bankStatementRegistry.blockers,
      ...bankControlRegistry.blockers,
      ...cashCloseoutReadiness.blockers,
      ...periodLockRegistry.blockers,
      ...auditTrail.blockers,
    ];
    const blockedArtifactCount = artifacts.filter(
      (item) => item.status === 'blocked',
    ).length;
    const needsReviewArtifactCount = artifacts.filter(
      (item) => item.status === 'needs_review',
    ).length;
    const vaultStatus =
      blockers.length > 0 || blockedArtifactCount > 0
        ? 'blocked'
        : needsReviewArtifactCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      vaultStatus,
      artifacts,
      journalRegistry,
      ledgerRegistry,
      trialBalance,
      closeoutReport,
      financialPreview,
      bankStatementRegistry,
      bankControlRegistry,
      cashCloseoutReadiness,
      periodLockRegistry,
      auditTrail,
      summary: {
        artifactCount: artifacts.length,
        readyArtifactCount: artifacts.filter((item) => item.status === 'ready')
          .length,
        needsReviewArtifactCount,
        blockedArtifactCount,
        journalEntryCount: journalRegistry.summary.entryCount,
        bankControlCount: bankControlRegistry.summary.controlCount,
        auditEventCount: auditTrail.summary.eventCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        vaultStatus === 'ready'
          ? 'Usar vault como paquete de evidencia del periodo para contador o lock interno.'
          : 'Completar artifacts bloqueados antes de entregar el periodo.',
      guardrails: [
        'Evidence vault agrupa evidencia operativa; no certifica libros ni estados financieros.',
        'No modifica registros contables ni controles existentes.',
        'Cada artifact debe conservar trazabilidad a su workspace o registry fuente.',
      ],
    };
  }
}

function artifact(
  key: string,
  label: string,
  artifactType: TenantAccountingPeriodEvidenceVaultView['artifacts'][number]['artifactType'],
  status: AccountingReadinessStatus,
  reference: string,
  metricCount: number,
  blockerCount: number,
): TenantAccountingPeriodEvidenceVaultView['artifacts'][number] {
  return {
    key,
    label,
    artifactType,
    status,
    reference,
    metricCount,
    blockerCount,
  };
}

function toJournalRegistryReadiness(status: string): AccountingReadinessStatus {
  return status === 'ready' || status === 'posted' ? 'ready' : 'needs_review';
}

function toReportReadiness(status: string): AccountingReadinessStatus {
  return status === 'ready'
    ? 'ready'
    : status === 'blocked'
      ? 'blocked'
      : 'needs_review';
}

function toFinancialPreviewReadiness(status: string): AccountingReadinessStatus {
  return status === 'ready_for_review'
    ? 'ready'
    : status === 'blocked'
      ? 'blocked'
      : 'needs_review';
}

function toSimpleRegistryReadiness(status: string): AccountingReadinessStatus {
  return status === 'ready' || status === 'locked' ? 'ready' : 'needs_review';
}

function toCashCloseoutReadiness(status: string): AccountingReadinessStatus {
  return status === 'ready_for_lock'
    ? 'ready'
    : status === 'blocked'
      ? 'blocked'
      : 'needs_review';
}

function toPeriodLockRegistryReadiness(status: string): AccountingReadinessStatus {
  return status === 'locked' || status === 'ready_to_lock'
    ? 'ready'
    : 'needs_review';
}

function toAuditReadiness(status: string): AccountingReadinessStatus {
  return status === 'ready'
    ? 'ready'
    : status === 'empty'
      ? 'blocked'
      : 'needs_review';
}
