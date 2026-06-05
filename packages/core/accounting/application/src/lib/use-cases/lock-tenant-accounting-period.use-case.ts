import { TenantAccountingPeriodLockResultView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingPeriodControlIdGenerator } from '../ports/id-generators';
import { AccountingPeriodControlRepository } from '../ports/accounting-period-control.repository';
import { GetTenantAccountingFinancialStatementPreviewUseCase } from './get-tenant-accounting-financial-statement-preview.use-case';
import { GetTenantAccountingPeriodCloseoutReportUseCase } from './get-tenant-accounting-period-closeout-report.use-case';
import { GetTenantAccountingPeriodLockReadinessUseCase } from './get-tenant-accounting-period-lock-readiness.use-case';
import { ListTenantAccountingPeriodLockRegistryUseCase } from './list-tenant-accounting-period-lock-registry.use-case';

export class LockTenantAccountingPeriodUseCase {
  constructor(
    private readonly accountingPeriodControlRepository: AccountingPeriodControlRepository,
    private readonly accountingPeriodControlIdGenerator: AccountingPeriodControlIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly getTenantAccountingPeriodLockReadinessUseCase: GetTenantAccountingPeriodLockReadinessUseCase,
    private readonly getTenantAccountingPeriodCloseoutReportUseCase: GetTenantAccountingPeriodCloseoutReportUseCase,
    private readonly getTenantAccountingFinancialStatementPreviewUseCase: GetTenantAccountingFinancialStatementPreviewUseCase,
    private readonly listTenantAccountingPeriodLockRegistryUseCase: ListTenantAccountingPeriodLockRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    lockedByUserId?: string | null;
    lockedByEmail?: string | null;
    reason?: string | null;
    evidenceReference?: string | null;
  }): Promise<TenantAccountingPeriodLockResultView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [readiness, closeoutReport, financialPreview] = await Promise.all([
      this.getTenantAccountingPeriodLockReadinessUseCase.execute(input),
      this.getTenantAccountingPeriodCloseoutReportUseCase.execute(input),
      this.getTenantAccountingFinancialStatementPreviewUseCase.execute(input),
    ]);
    const existingRegistry =
      await this.listTenantAccountingPeriodLockRegistryUseCase.execute(input);
    const blockers = [
      ...readiness.blockers,
      ...(readiness.lockReadinessStatus !== 'ready_to_lock'
        ? ['accounting.period_lock.not_ready']
        : []),
      ...(existingRegistry.registryStatus === 'locked'
        ? ['accounting.period_lock.already_locked']
        : []),
    ];

    if (blockers.length > 0) {
      return {
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        generatedAt: this.nowProvider(),
        lockStatus: 'blocked',
        control: null,
        registry: existingRegistry,
        blockers: [...new Set(blockers)],
        nextStep: 'Resolver blockers antes de registrar el lock interno.',
        guardrails: buildGuardrails(),
      };
    }

    const now = this.nowProvider();
    const control = await this.accountingPeriodControlRepository.save({
      id: this.accountingPeriodControlIdGenerator.nextId(),
      tenantId: tenant.id,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      status: 'locked',
      action: 'locked',
      actionByUserId: input.lockedByUserId ?? null,
      actionByEmail: input.lockedByEmail ?? null,
      actionAt: now,
      reason: input.reason ?? null,
      evidenceReference: input.evidenceReference ?? null,
      blockers: [],
      snapshot: {
        lockReadinessStatus: readiness.lockReadinessStatus,
        closeoutReportStatus: closeoutReport.reportStatus,
        journalEntryCount: readiness.summary.journalEntryCount,
        trialBalanceBalanced: readiness.summary.trialBalanceBalanced,
        financialPreviewStatus: financialPreview.previewStatus,
      },
      impactChecklist: [
        'Journals del periodo quedan bajo control interno de cierre.',
        'Nuevos ajustes deben pasar por reopen packet.',
        'Financial previews deben recalcularse si el periodo se reabre.',
      ],
    });
    const registry =
      await this.listTenantAccountingPeriodLockRegistryUseCase.execute(input);

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: now,
      lockStatus: 'locked',
      control,
      registry,
      blockers: [],
      nextStep: 'Mantener audit trail y usar reopen packet si aparece una correccion.',
      guardrails: buildGuardrails(),
    };
  }
}

function buildGuardrails(): string[] {
  return [
    'Lock interno no es cierre legal de libros.',
    'No borra ni revierte journal entries existentes.',
    'Reopen posterior debe preservar razon, evidencia e impacto.',
  ];
}
