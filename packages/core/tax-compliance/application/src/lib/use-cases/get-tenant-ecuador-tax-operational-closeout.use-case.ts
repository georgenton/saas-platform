import {
  EcuadorTaxOperationalCloseoutStatus,
  EcuadorTaxOperationalCloseoutView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPeriodEvidenceVaultUseCase } from './get-tenant-ecuador-tax-period-evidence-vault.use-case';
import { GetTenantEcuadorTaxVatDeclarationApprovalUseCase } from './get-tenant-ecuador-tax-vat-declaration-approval.use-case';
import { GetTenantEcuadorTaxWithholdingRegistryUseCase } from './get-tenant-ecuador-tax-withholding-registry.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxOperationalCloseoutUseCase {
  constructor(
    private readonly getTenantEcuadorTaxVatDeclarationApprovalUseCase: GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
    private readonly getTenantEcuadorTaxWithholdingRegistryUseCase: GetTenantEcuadorTaxWithholdingRegistryUseCase,
    private readonly getTenantEcuadorTaxPeriodEvidenceVaultUseCase: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxOperationalCloseoutView> {
    const [vatApproval, withholdingRegistry, evidenceVault, events] =
      await Promise.all([
        this.getTenantEcuadorTaxVatDeclarationApprovalUseCase.execute(input),
        this.getTenantEcuadorTaxWithholdingRegistryUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxPeriodEvidenceVaultUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
          tenantSlug: input.tenantSlug,
          period: input.period,
          limit: 100,
        }),
      ]);
    const transitionHistory = events
      .filter((event) => event.eventType === 'period_operational_closeout_transitioned')
      .map((event) => ({
        status: readCloseoutStatus(event.payload.status),
        transitionedAt: event.occurredAt,
        transitionedByUserId: readStringOrNull(event.payload.transitionedByUserId),
        transitionedByEmail: readStringOrNull(event.payload.transitionedByEmail),
        note: readStringOrNull(event.payload.note),
      }));
    const checklist = [
      {
        key: 'vat_approved',
        label: 'IVA aprobado para presentacion externa',
        completed: vatApproval.status === 'approved_for_external_filing',
        blocker:
          vatApproval.status === 'approved_for_external_filing'
            ? null
            : 'vat.approval_required',
      },
      {
        key: 'withholdings_reviewed',
        label: 'Retenciones revisadas',
        completed: withholdingRegistry.readinessStatus === 'ready',
        blocker:
          withholdingRegistry.readinessStatus === 'ready'
            ? null
            : 'withholding.registry_not_ready',
      },
      {
        key: 'evidence_vault_ready',
        label: 'Carpeta fiscal lista',
        completed: evidenceVault.readinessStatus === 'ready',
        blocker:
          evidenceVault.readinessStatus === 'ready'
            ? null
            : 'evidence_vault.not_ready',
      },
    ];
    const blockers = checklist
      .map((item) => item.blocker)
      .filter((blocker): blocker is string => Boolean(blocker));
    const latestStatus = transitionHistory[0]?.status ?? null;
    const status =
      latestStatus === 'closed_operationally'
        ? 'closed_operationally'
        : blockers.length === 0
          ? 'ready_for_external_filing'
          : latestStatus ?? 'open';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      status,
      checklist,
      vatApprovalStatus: vatApproval.status,
      withholdingReadinessStatus: withholdingRegistry.readinessStatus,
      evidenceVaultStatus: evidenceVault.readinessStatus,
      transitionHistory,
      blockers,
      nextStep:
        status === 'closed_operationally'
          ? 'Periodo cerrado operacionalmente; conservar evidencia y no editar sin reapertura formal.'
          : status === 'ready_for_external_filing'
            ? 'Registrar cierre operacional cuando se complete la presentacion externa humana.'
            : 'Completar IVA, retenciones y carpeta fiscal antes de cerrar el periodo.',
      guardrails: [
        'Closeout operacional no equivale a declaracion presentada ni pago realizado.',
        'El cierre conserva trazabilidad interna para contador y auditoria.',
      ],
    };
  }
}

export function readCloseoutStatus(value: unknown): EcuadorTaxOperationalCloseoutStatus {
  return typeof value === 'string' &&
    ['open', 'in_review', 'ready_for_external_filing', 'closed_operationally'].includes(
      value,
    )
    ? (value as EcuadorTaxOperationalCloseoutStatus)
    : 'open';
}

function readStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}
