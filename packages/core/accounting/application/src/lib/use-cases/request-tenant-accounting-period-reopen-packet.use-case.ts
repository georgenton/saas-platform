import { TenantAccountingPeriodReopenPacketView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingPeriodControlRepository } from '../ports/accounting-period-control.repository';
import { AccountingPeriodControlIdGenerator } from '../ports/id-generators';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingPeriodCloseoutReadinessUseCase } from './get-tenant-accounting-period-closeout-readiness.use-case';
import { GetTenantAccountingTrialBalanceWorkspaceUseCase } from './get-tenant-accounting-trial-balance-workspace.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';
import { ListTenantAccountingPeriodLockRegistryUseCase } from './list-tenant-accounting-period-lock-registry.use-case';

export class RequestTenantAccountingPeriodReopenPacketUseCase {
  constructor(
    private readonly accountingPeriodControlRepository: AccountingPeriodControlRepository,
    private readonly accountingPeriodControlIdGenerator: AccountingPeriodControlIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly listTenantAccountingPeriodLockRegistryUseCase: ListTenantAccountingPeriodLockRegistryUseCase,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly getTenantAccountingTrialBalanceWorkspaceUseCase: GetTenantAccountingTrialBalanceWorkspaceUseCase,
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly getTenantAccountingPeriodCloseoutReadinessUseCase: GetTenantAccountingPeriodCloseoutReadinessUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    decision: 'prepare' | 'reopen';
    reason: string;
    evidenceReference?: string | null;
    reopenedByUserId?: string | null;
    reopenedByEmail?: string | null;
  }): Promise<TenantAccountingPeriodReopenPacketView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [registry, journalRegistry, trialBalance, financialPreview, closeoutReadiness] =
      await Promise.all([
        this.listTenantAccountingPeriodLockRegistryUseCase.execute(input),
        this.listTenantAccountingJournalRegistryUseCase.execute(input),
        this.getTenantAccountingTrialBalanceWorkspaceUseCase.execute(input),
        this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
        this.getTenantAccountingPeriodCloseoutReadinessUseCase.execute(input),
      ]);
    const latestLock =
      [...registry.controls].reverse().find((control) => control.status === 'locked') ??
      null;
    const impactChecklist = [
      {
        key: 'journal_registry',
        label: 'Journal registry',
        status: journalRegistry.registryStatus === 'ready' ? 'ready' as const : 'needs_review' as const,
        detail: `${journalRegistry.summary.entryCount} journal entries podrian cambiar tras reopen.`,
      },
      {
        key: 'trial_balance',
        label: 'Balance de comprobacion',
        status: trialBalance.readinessStatus,
        detail: trialBalance.nextStep,
      },
      {
        key: 'financial_preview',
        label: 'Financial preview',
        status: financialPreview.previewStatus === 'blocked'
          ? 'blocked' as const
          : financialPreview.previewStatus === 'ready_for_review'
            ? 'ready' as const
            : 'needs_review' as const,
        detail: financialPreview.nextStep,
      },
      {
        key: 'tax_closeout',
        label: 'Tax closeout',
        status: closeoutReadiness.readinessStatus === 'blocked'
          ? 'blocked' as const
          : closeoutReadiness.readinessStatus === 'ready_for_closeout'
            ? 'ready' as const
            : 'needs_review' as const,
        detail: closeoutReadiness.nextStep,
      },
    ];
    const blockers = [
      ...(registry.registryStatus !== 'locked'
        ? ['accounting.period_reopen.not_locked']
        : []),
      ...(!input.reason.trim()
        ? ['accounting.period_reopen.reason_required']
        : []),
      ...(!input.evidenceReference
        ? ['accounting.period_reopen.evidence_reference_required']
        : []),
    ];
    const blockedImpactCount = impactChecklist.filter(
      (item) => item.status === 'blocked',
    ).length;
    const shouldPersist = input.decision === 'reopen' && blockers.length === 0;
    const now = this.nowProvider();
    const control = shouldPersist
      ? await this.accountingPeriodControlRepository.save({
          id: this.accountingPeriodControlIdGenerator.nextId(),
          tenantId: tenant.id,
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          status: 'reopened',
          action: 'reopened',
          actionByUserId: input.reopenedByUserId ?? null,
          actionByEmail: input.reopenedByEmail ?? null,
          actionAt: now,
          reason: input.reason,
          evidenceReference: input.evidenceReference ?? null,
          blockers: [],
          snapshot: {
            journalEntryCount: journalRegistry.summary.entryCount,
            trialBalanceBalanced: trialBalance.summary.balanced,
            financialPreviewStatus: financialPreview.previewStatus,
          },
          impactChecklist: impactChecklist.map((item) => item.detail),
        })
      : null;

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: now,
      reopenStatus:
        blockers.length > 0
          ? 'blocked'
          : shouldPersist
            ? 'reopened'
            : 'ready_to_reopen',
      control,
      latestLock,
      impactChecklist,
      summary: {
        impactCount: impactChecklist.length,
        blockedImpactCount,
        journalEntryCount: journalRegistry.summary.entryCount,
        latestStatus: registry.registryStatus,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        blockers.length > 0
          ? 'Completar razon/evidencia y confirmar que el periodo esta locked.'
          : shouldPersist
            ? 'Periodo reabierto; registrar ajustes y volver a evaluar lock.'
            : 'Revisar impacto y confirmar reopen si procede.',
      guardrails: [
        'Reopen no elimina locks anteriores; agrega un nuevo evento auditable.',
        'Debe incluir motivo y evidencia de soporte.',
        'Despues de reabrir, recalcular trial balance, previews y readiness.',
      ],
    };
  }
}
