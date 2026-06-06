import {
  EcuadorTaxExceptionCenterView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesWorkspaceUseCase } from './get-tenant-ecuador-tax-annexes-workspace.use-case';
import { GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase } from './get-tenant-ecuador-tax-sri-evidence-intake-v2-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase } from './request-tenant-ecuador-tax-period-closeout-certification.use-case';

export class GetTenantEcuadorTaxExceptionCenterUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
    private readonly getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase: GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
    private readonly getTenantEcuadorTaxAnnexesWorkspaceUseCase: GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxExceptionCenterView> {
    const [certification, sriIntake, annexes] = await Promise.all([
      this.requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxAnnexesWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const exceptions = [
      ...certification.blockers.map((blocker) => ({
        key: `certification.${blocker}`,
        label: blocker,
        severity: 'critical' as const,
        status: 'blocked' as const,
        source: 'period_closeout_certification',
        owner: 'accountant' as const,
        recommendedAction: 'Resolver blocker de certificacion con contador.',
      })),
      ...sriIntake.blockers.map((blocker) => ({
        key: `sri.${blocker}`,
        label: blocker,
        severity: 'high' as const,
        status: 'blocked' as const,
        source: 'sri_evidence_intake_v2',
        owner: 'operator' as const,
        recommendedAction: 'Reimportar o corregir evidencia SRI del periodo.',
      })),
      ...annexes.blockers.map((blocker) => ({
        key: `annexes.${blocker}`,
        label: blocker,
        severity: 'high' as const,
        status: 'blocked' as const,
        source: 'annexes_workspace',
        owner: 'accountant' as const,
        recommendedAction: 'Completar soporte requerido para anexos.',
      })),
    ];
    const readinessStatus = resolveReadiness(exceptions);
    const view: EcuadorTaxExceptionCenterView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
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
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver excepciones bloqueantes antes de certificar el periodo.'
          : 'No hay excepciones bloqueantes; continuar con certificacion.',
      guardrails: [
        'Exception center prioriza resolucion operativa; no modifica evidencia automaticamente.',
        'Las decisiones fiscales siguen requiriendo revision humana cuando aplique.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_exception_center_reviewed',
        source: 'tax_exception_center',
        payload: { readinessStatus, summary: view.summary },
      });
    }

    return view;
  }
}

function resolveReadiness(
  exceptions: EcuadorTaxExceptionCenterView['exceptions'],
): EcuadorTaxReadinessStatus {
  if (exceptions.some((exception) => exception.status === 'blocked')) {
    return 'blocked';
  }

  return exceptions.length > 0 ? 'needs_review' : 'ready';
}
