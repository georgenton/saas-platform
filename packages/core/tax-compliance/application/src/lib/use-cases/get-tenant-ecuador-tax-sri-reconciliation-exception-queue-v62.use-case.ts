import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriReconciliationExceptionQueueV62View,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxExceptionCenterUseCase } from './get-tenant-ecuador-tax-exception-center.use-case';
import { GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase } from './get-tenant-ecuador-tax-sri-evidence-import-persistence-ledger-v62.use-case';
import { GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-platform-reconciliation-workspace.use-case';

export class GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase: GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
    private readonly getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase: GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
    private readonly getTenantEcuadorTaxExceptionCenterUseCase: GetTenantEcuadorTaxExceptionCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxSriReconciliationExceptionQueueV62View> {
    const [ledger, reconciliation, exceptionCenter] = await Promise.all([
      this.getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxExceptionCenterUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const reconciliationExceptions = reconciliation.issues.map((issue) => ({
      key: `reconciliation.${issue.key}`,
      label: issue.summary,
      source: issue.source,
      severity:
        issue.severity === 'blocking'
          ? ('critical' as const)
          : ('high' as const),
      status:
        issue.severity === 'blocking'
          ? ('blocked' as const)
          : ('needs_review' as const),
      owner:
        issue.source === 'sri'
          ? ('operator' as const)
          : ('tax_compliance' as const),
      evidenceRefs: ['sri_platform_reconciliation', issue.key],
      recommendedAction: issue.suggestedAction,
    }));
    const ledgerExceptions = ledger.importBatches
      .filter((batch) => batch.status !== 'ready')
      .map((batch) => ({
        key: `import_batch.${batch.importId}`,
        label: `Batch SRI ${batch.importId}`,
        source: batch.source,
        severity:
          batch.status === 'blocked'
            ? ('critical' as const)
            : ('medium' as const),
        status: batch.status,
        owner: 'operator' as const,
        evidenceRefs: ['sri_import_persistence_ledger', batch.importId],
        recommendedAction: batch.nextAction,
      }));
    const inheritedExceptions = exceptionCenter.exceptions.map((exception) => ({
      key: `period.${exception.key}`,
      label: exception.label,
      source: exception.source,
      severity: normalizeSeverity(exception.severity),
      status: exception.status,
      owner:
        exception.owner === 'system'
          ? ('tax_compliance' as const)
          : exception.owner,
      evidenceRefs: [exception.source],
      recommendedAction: exception.recommendedAction,
    }));
    const exceptions = [
      ...reconciliationExceptions,
      ...ledgerExceptions,
      ...inheritedExceptions,
    ];
    const blockers = exceptions
      .filter((exception) => exception.status === 'blocked')
      .map((exception) => exception.key);
    const queueStatus = resolveStatus(
      exceptions.map((exception) => exception.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      queueStatus,
      exceptions,
      summary: {
        exceptionCount: exceptions.length,
        criticalCount: exceptions.filter(
          (exception) => exception.severity === 'critical',
        ).length,
        accountantOwnedCount: exceptions.filter(
          (exception) => exception.owner === 'accountant',
        ).length,
        operatorOwnedCount: exceptions.filter(
          (exception) => exception.owner === 'operator',
        ).length,
        blockedCount: exceptions.filter(
          (exception) => exception.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        queueStatus === 'ready'
          ? 'Usar queue como evidencia de reconciliacion limpia para formularios.'
          : 'Resolver excepciones SRI/plataforma antes de cerrar formularios o packet contador.',
      guardrails: [
        'La queue prioriza trabajo; no corrige facturas ni evidencia automaticamente.',
        'Las diferencias con SRI requieren revision humana y soporte trazable.',
      ],
    };
  }
}

function normalizeSeverity(
  severity: 'critical' | 'high' | 'normal',
): 'critical' | 'high' | 'medium' | 'low' {
  return severity === 'normal' ? 'medium' : severity;
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
