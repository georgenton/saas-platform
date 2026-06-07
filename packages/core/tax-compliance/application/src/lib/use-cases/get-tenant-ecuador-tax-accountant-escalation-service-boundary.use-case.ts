import { EcuadorTaxAccountantEscalationServiceBoundaryView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase } from './get-tenant-ecuador-tax-accounting-boundary-closeout.use-case';
import { GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase } from './get-tenant-ecuador-tax-income-tax-evidence-workspace-v2.use-case';

export class GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountingBoundaryCloseoutUseCase: GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantEscalationServiceBoundaryView> {
    const [boundaryCloseout, incomeTaxWorkspace] = await Promise.all([
      this.getTenantEcuadorTaxAccountingBoundaryCloseoutUseCase.execute(input),
      this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase.execute(input),
    ]);
    const escalationRules: EcuadorTaxAccountantEscalationServiceBoundaryView['escalationRules'] =
      [
        {
          key: 'deductibility_review',
          label: 'Revision de deducibilidad para renta',
          status:
            incomeTaxWorkspace.summary.accountantReviewLineCount > 0
              ? 'needs_review'
              : 'ready',
          target: 'accountant',
          trigger: `${incomeTaxWorkspace.summary.accountantReviewLineCount} lineas requieren criterio profesional.`,
          recommendedAction:
            'Enviar evidencia de renta 2.0 y preguntas al contador.',
        },
        {
          key: 'annual_blocked_periods',
          label: 'Periodos anuales bloqueados',
          status:
            incomeTaxWorkspace.summary.annualBlockedPeriodCount > 0
              ? 'blocked'
              : 'ready',
          target: 'accountant',
          trigger: `${incomeTaxWorkspace.summary.annualBlockedPeriodCount} periodos bloqueados en rollup anual.`,
          recommendedAction:
            'Cerrar periodos bloqueados antes de usar renta anual.',
        },
        {
          key: 'accounting_advanced_boundary',
          label: 'Escalamiento a Accounting Advanced',
          status:
            boundaryCloseout.summary.accountingAdvancedBacklogCount > 0
              ? 'needs_review'
              : 'ready',
          target: 'accounting-advanced',
          trigger:
            'Libros oficiales, bank feeds certificados, estados multi-periodo o auditoria exceden Tax Compliance.',
          recommendedAction:
            'Abrir discovery de Accounting Advanced solo si el contador lo requiere.',
        },
        {
          key: 'tax_compliance_self_service',
          label: 'Tax Compliance asistido',
          status:
            incomeTaxWorkspace.readinessStatus === 'ready' &&
            boundaryCloseout.boundaryStatus === 'ready'
              ? 'ready'
              : 'needs_review',
          target: 'tax-compliance-ec',
          trigger:
            'La plataforma puede preparar evidencia y formularios asistidos con gates humanos.',
          recommendedAction:
            'Mantener declaracion como handoff humano y usar Tax Compliance como control room.',
        },
      ];
    const blockers = [
      ...boundaryCloseout.blockers,
      ...incomeTaxWorkspace.blockers,
      ...escalationRules
        .filter((rule) => rule.status === 'blocked')
        .map((rule) => rule.key),
    ];
    const accountingAdvancedRuleCount = escalationRules.filter(
      (rule) => rule.target === 'accounting-advanced',
    ).length;
    const escalationStatus =
      blockers.length > 0
        ? 'accounting_advanced_required'
        : escalationRules.some((rule) => rule.status === 'needs_review')
          ? 'accountant_review_required'
          : 'self_service_ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      escalationStatus,
      boundaryCloseout,
      incomeTaxWorkspace,
      escalationRules,
      summary: {
        ruleCount: escalationRules.length,
        accountantRuleCount: escalationRules.filter(
          (rule) => rule.target === 'accountant',
        ).length,
        accountingAdvancedRuleCount,
        blockedRuleCount: escalationRules.filter(
          (rule) => rule.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        escalationStatus === 'self_service_ready'
          ? 'Continuar con Tax Compliance asistido y handoff humano.'
          : escalationStatus === 'accountant_review_required'
            ? 'Enviar pack de escalamiento al contador.'
            : 'Evaluar Accounting Advanced antes de cerrar obligaciones complejas.',
      guardrails: [
        'Tax Compliance no reemplaza contador cuando hay deducibilidad compleja o libros oficiales.',
        'Accounting Advanced solo debe abrirse para necesidades contables formales, no para formularios asistidos simples.',
      ],
    };
  }
}
