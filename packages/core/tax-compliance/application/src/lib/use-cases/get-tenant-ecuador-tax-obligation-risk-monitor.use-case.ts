import { EcuadorTaxObligationRiskMonitorView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxEvidenceQualityCenterUseCase } from './get-tenant-ecuador-tax-evidence-quality-center.use-case';

export class GetTenantEcuadorTaxObligationRiskMonitorUseCase {
  constructor(
    private readonly getTenantEcuadorTaxEvidenceQualityCenterUseCase: GetTenantEcuadorTaxEvidenceQualityCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxObligationRiskMonitorView> {
    const qualityCenter =
      await this.getTenantEcuadorTaxEvidenceQualityCenterUseCase.execute(input);
    const closeout = qualityCenter.closeout;
    const obligationRisks: EcuadorTaxObligationRiskMonitorView['obligationRisks'] =
      [
        risk('iva', 'IVA mensual', closeout.vatDeclarationWorkspace.readinessStatus, closeout.vatDeclarationWorkspace.nextStep, false),
        risk('income_tax', 'Impuesto a la renta', closeout.incomeTaxEvidenceWorkspace.readinessStatus, closeout.incomeTaxEvidenceWorkspace.nextStep, true),
        risk('sri_imports', 'Comprobantes SRI', closeout.sriSourceImportCenter.centerStatus, closeout.sriSourceImportCenter.nextStep, false),
        risk(
          'accountant_boundary',
          'Escalamiento contador',
          closeout.escalationBoundary.escalationStatus ===
            'accounting_advanced_required'
            ? 'blocked'
            : closeout.escalationBoundary.escalationStatus ===
                'accountant_review_required'
              ? 'needs_review'
              : 'ready',
          closeout.escalationBoundary.nextStep,
          true,
        ),
      ];
    const blockers = [
      ...qualityCenter.blockers,
      ...obligationRisks
        .filter((item) => item.status === 'blocked')
        .map((item) => item.key),
    ];
    const riskStatus =
      blockers.length > 0
        ? 'blocked'
        : obligationRisks.some((item) => item.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      riskStatus,
      qualityCenter,
      obligationRisks,
      summary: {
        obligationRiskCount: obligationRisks.length,
        criticalRiskCount: obligationRisks.filter(
          (item) => item.riskLevel === 'critical',
        ).length,
        accountantRequiredCount: obligationRisks.filter(
          (item) => item.accountantRequired,
        ).length,
        blockedRiskCount: obligationRisks.filter(
          (item) => item.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        riskStatus === 'ready'
          ? 'Usar risk monitor como resumen ejecutivo del periodo.'
          : 'Resolver riesgos de obligacion o preparar handoff a contador.',
      guardrails: [
        'Risk monitor prioriza obligaciones; no reemplaza calendario oficial SRI.',
        'Riesgos de renta y contabilidad compleja deben escalarse al contador.',
      ],
    };
  }
}

function risk(
  key: string,
  label: string,
  status: 'ready' | 'needs_review' | 'blocked',
  recommendedAction: string,
  accountantRequired: boolean,
): EcuadorTaxObligationRiskMonitorView['obligationRisks'][number] {
  return {
    key,
    label,
    status,
    riskLevel: status === 'blocked' ? 'critical' : status === 'needs_review' ? 'high' : 'normal',
    dueSignal: 'Validar vencimiento segun calendario SRI aplicable.',
    evidenceSignal: status === 'ready' ? 'Evidencia operativa lista.' : 'Evidencia requiere revision.',
    accountantRequired,
    recommendedAction,
  };
}
