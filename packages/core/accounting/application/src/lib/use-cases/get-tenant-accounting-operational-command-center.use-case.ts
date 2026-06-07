import {
  AccountingReadinessStatus,
  TenantAccountingOperationalCommandCenterView,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingBankAccountRegistryWorkspaceUseCase } from './get-tenant-accounting-bank-account-registry-workspace.use-case';
import { GetTenantAccountingBankReconciliationWorkspaceUseCase } from './get-tenant-accounting-bank-reconciliation-workspace.use-case';
import { GetTenantAccountingBankStatementImportProfileWorkspaceUseCase } from './get-tenant-accounting-bank-statement-import-profile-workspace.use-case';
import { GetTenantAccountingCloseoutCertificationReadinessUseCase } from './get-tenant-accounting-closeout-certification-readiness.use-case';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingOpeningBalanceControlRegistryUseCase } from './get-tenant-accounting-opening-balance-control-registry.use-case';

export class GetTenantAccountingOperationalCommandCenterUseCase {
  constructor(
    private readonly getTenantAccountingOpeningBalanceControlRegistryUseCase: GetTenantAccountingOpeningBalanceControlRegistryUseCase,
    private readonly getTenantAccountingBankAccountRegistryWorkspaceUseCase: GetTenantAccountingBankAccountRegistryWorkspaceUseCase,
    private readonly getTenantAccountingBankStatementImportProfileWorkspaceUseCase: GetTenantAccountingBankStatementImportProfileWorkspaceUseCase,
    private readonly getTenantAccountingBankReconciliationWorkspaceUseCase: GetTenantAccountingBankReconciliationWorkspaceUseCase,
    private readonly getTenantAccountingCloseoutCertificationReadinessUseCase: GetTenantAccountingCloseoutCertificationReadinessUseCase,
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingOperationalCommandCenterView> {
    const [
      openingBalance,
      bankAccounts,
      importProfiles,
      bankReconciliation,
      closeoutCertification,
      financialPreview,
    ] = await Promise.all([
      this.getTenantAccountingOpeningBalanceControlRegistryUseCase.execute(input),
      this.getTenantAccountingBankAccountRegistryWorkspaceUseCase.execute(input),
      this.getTenantAccountingBankStatementImportProfileWorkspaceUseCase.execute(
        input,
      ),
      this.getTenantAccountingBankReconciliationWorkspaceUseCase.execute(input),
      this.getTenantAccountingCloseoutCertificationReadinessUseCase.execute(
        input,
      ),
      this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
    ]);
    const lanes: TenantAccountingOperationalCommandCenterView['lanes'] = [
      lane(
        'opening_balance',
        'Opening balance',
        statusFrom(openingBalance.registryStatus),
        openingBalance.blockers.length,
        `${openingBalance.summary.materializedEntryCount} journals`,
        openingBalance.nextStep,
      ),
      lane(
        'bank_accounts',
        'Bank accounts',
        statusFrom(bankAccounts.registryStatus),
        bankAccounts.blockers.length,
        `${bankAccounts.summary.activeAccountCount}/${bankAccounts.summary.accountCount} active`,
        bankAccounts.nextStep,
      ),
      lane(
        'import_profiles',
        'Import profiles',
        statusFrom(importProfiles.profileStatus),
        importProfiles.blockers.length,
        `${importProfiles.summary.readyProfileCount}/${importProfiles.summary.profileCount} ready`,
        importProfiles.nextStep,
      ),
      lane(
        'bank_reconciliation',
        'Bank reconciliation',
        statusFrom(bankReconciliation.reconciliationStatus),
        bankReconciliation.blockers.length,
        `${bankReconciliation.summary.exactMatchCount}/${bankReconciliation.summary.candidateCount} matches`,
        bankReconciliation.nextStep,
      ),
      lane(
        'financial_preview',
        'Financial preview',
        statusFrom(financialPreview.previewStatus),
        financialPreview.blockers.length,
        `${financialPreview.summary.trialBalanceAccountCount} accounts`,
        financialPreview.nextStep,
      ),
      lane(
        'closeout_certification',
        'Closeout certification',
        statusFrom(closeoutCertification.certificationStatus),
        closeoutCertification.blockers.length,
        `${closeoutCertification.summary.readyCheckCount}/${closeoutCertification.summary.checkCount} checks`,
        closeoutCertification.nextStep,
      ),
    ];
    const blockers = [
      ...openingBalance.blockers,
      ...bankAccounts.blockers,
      ...importProfiles.blockers,
      ...bankReconciliation.blockers,
      ...financialPreview.blockers,
      ...closeoutCertification.blockers,
    ];
    const blockedLaneCount = lanes.filter((item) => item.status === 'blocked').length;
    const needsReviewLaneCount = lanes.filter(
      (item) => item.status === 'needs_review',
    ).length;
    const commandStatus =
      blockers.length > 0 || blockedLaneCount > 0
        ? 'blocked'
        : needsReviewLaneCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      commandStatus,
      lanes,
      openingBalance,
      bankAccounts,
      importProfiles,
      bankReconciliation,
      closeoutCertification,
      financialPreview,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((item) => item.status === 'ready').length,
        needsReviewLaneCount,
        blockedLaneCount,
        blockerCount: new Set(blockers).size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        commandStatus === 'ready'
          ? 'Periodo contable listo para cierre profesional asistido.'
          : lanes.find((item) => item.status === 'blocked')?.nextAction ??
            lanes.find((item) => item.status === 'needs_review')?.nextAction ??
            'Revisar lanes contables pendientes.',
      guardrails: [
        'Command center operativo; no certifica estados financieros oficiales.',
        'No conecta bancos, no firma libros y no reemplaza revision profesional.',
        'Agrega readiness de workspaces deterministicos y registros internos.',
      ],
    };
  }
}

function lane(
  laneKey: string,
  label: string,
  status: AccountingReadinessStatus,
  blockerCount: number,
  primaryMetric: string,
  nextAction: string,
): TenantAccountingOperationalCommandCenterView['lanes'][number] {
  return {
    laneKey,
    label,
    status,
    blockerCount,
    primaryMetric,
    nextAction,
  };
}

function statusFrom(value: string): AccountingReadinessStatus {
  if (value.includes('blocked')) {
    return 'blocked';
  }

  if (
    value.includes('needs') ||
    value.includes('empty') ||
    value.includes('review')
  ) {
    return 'needs_review';
  }

  return 'ready';
}
