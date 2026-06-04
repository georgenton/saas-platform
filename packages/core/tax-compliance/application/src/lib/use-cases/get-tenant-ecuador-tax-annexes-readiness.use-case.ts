import {
  EcuadorTaxAnnexesReadinessView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationSettingsUseCase } from './get-tenant-ecuador-tax-obligation-settings.use-case';
import { GetTenantEcuadorTaxPeriodEvidenceVaultUseCase } from './get-tenant-ecuador-tax-period-evidence-vault.use-case';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase } from './get-tenant-ecuador-tax-supplier-fiscal-readiness-workspace.use-case';
import { GetTenantEcuadorTaxWithholdingRegistryUseCase } from './get-tenant-ecuador-tax-withholding-registry.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxAnnexesReadinessUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationSettingsUseCase: GetTenantEcuadorTaxObligationSettingsUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase: GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
    private readonly getTenantEcuadorTaxWithholdingRegistryUseCase: GetTenantEcuadorTaxWithholdingRegistryUseCase,
    private readonly getTenantEcuadorTaxPeriodEvidenceVaultUseCase: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAnnexesReadinessView> {
    const [settings, purchases, suppliers, withholdings, vault] =
      await Promise.all([
        this.getTenantEcuadorTaxObligationSettingsUseCase.execute({
          tenantSlug: input.tenantSlug,
        }),
        this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxWithholdingRegistryUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxPeriodEvidenceVaultUseCase.execute({
          ...input,
          recordEvent: false,
        }),
      ]);
    const annexesApply =
      settings.obligations.find((obligation) => obligation.key === 'annexes')
        ?.applies ?? false;
    const atsBlockers = [
      ...purchases.blockers.map((blocker) => `ats.purchase.${blocker}`),
      ...suppliers.blockers.map((blocker) => `ats.supplier.${blocker}`),
      ...vault.missingItems.map((item) => `ats.vault.${item}`),
    ];
    const withholdingBlockers = [
      ...withholdings.blockers.map((blocker) => `withholding.${blocker}`),
      ...(withholdings.summary.pendingSupportCount > 0
        ? ['withholding.pending_support']
        : []),
    ];
    const annexes = [
      {
        key: 'ats',
        label: 'Anexo Transaccional Simplificado',
        applies: annexesApply,
        readinessStatus: resolveReadinessStatus({
          applies: annexesApply,
          blockers: atsBlockers,
          needsReview:
            purchases.readinessStatus === 'needs_review' ||
            suppliers.readinessStatus === 'needs_review',
        }),
        evidenceSources: [
          'purchase_expense_evidence',
          'supplier_fiscal_readiness',
          'period_evidence_vault',
        ],
        blockerCount: atsBlockers.length,
        blockers: atsBlockers,
        nextStep:
          atsBlockers.length > 0
            ? 'Completar proveedores, compras y carpeta fiscal antes de preparar ATS.'
            : 'Exportar insumos para preparacion externa de ATS con contador.',
      },
      {
        key: 'withholding_support',
        label: 'Soporte de retenciones del periodo',
        applies:
          settings.obligations.find(
            (obligation) => obligation.key === 'withholding',
          )?.applies ?? false,
        readinessStatus: resolveReadinessStatus({
          applies:
            settings.obligations.find(
              (obligation) => obligation.key === 'withholding',
            )?.applies ?? false,
          blockers: withholdingBlockers,
          needsReview: withholdings.readinessStatus === 'needs_review',
        }),
        evidenceSources: ['withholding_registry', 'withholding_draft_bridge'],
        blockerCount: withholdingBlockers.length,
        blockers: withholdingBlockers,
        nextStep:
          withholdingBlockers.length > 0
            ? 'Resolver soportes pendientes de retenciones antes de anexos.'
            : 'Usar registry como soporte operativo para anexo/formulario externo.',
      },
    ];
    const blockers = annexes.flatMap((annex) => annex.blockers);
    const readinessStatus = resolveAggregateReadiness(
      annexes
        .filter((annex) => annex.applies)
        .map((annex) => annex.readinessStatus),
    );
    const view: EcuadorTaxAnnexesReadinessView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      annexes,
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de preparar anexos tributarios externos.'
          : readinessStatus === 'needs_review'
            ? 'Enviar readiness de anexos a contador para validacion.'
            : 'Anexos listos como insumos operativos para preparacion externa.',
      guardrails: [
        'Readiness de anexos no genera XML ni formularios oficiales SRI.',
        'La preparacion/presentacion final de anexos requiere herramienta externa o contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_annexes_readiness_reviewed',
        source: 'tax_annexes_readiness',
        payload: {
          readinessStatus,
          annexCount: annexes.length,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function resolveReadinessStatus(input: {
  applies: boolean;
  blockers: string[];
  needsReview: boolean;
}): EcuadorTaxReadinessStatus {
  if (!input.applies) {
    return 'ready';
  }

  if (input.blockers.length > 0) {
    return 'blocked';
  }

  return input.needsReview ? 'needs_review' : 'ready';
}

function resolveAggregateReadiness(
  statuses: EcuadorTaxReadinessStatus[],
): EcuadorTaxReadinessStatus {
  if (statuses.length === 0) {
    return 'ready';
  }

  if (statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
