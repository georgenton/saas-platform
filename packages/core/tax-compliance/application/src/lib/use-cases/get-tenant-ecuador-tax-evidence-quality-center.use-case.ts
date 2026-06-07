import { EcuadorTaxEvidenceQualityCenterView } from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxComplianceCloseoutV2UseCase } from './request-tenant-ecuador-tax-compliance-closeout-v2.use-case';

export class GetTenantEcuadorTaxEvidenceQualityCenterUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxComplianceCloseoutV2UseCase: RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxEvidenceQualityCenterView> {
    const closeout =
      await this.requestTenantEcuadorTaxComplianceCloseoutV2UseCase.execute(
        input,
      );
    const qualityFindings: EcuadorTaxEvidenceQualityCenterView['qualityFindings'] =
      [
        {
          key: 'sri_import_quality',
          label: 'SRI import coverage',
          status: closeout.sriSourceImportCenter.centerStatus,
          source: 'sri',
          severity:
            closeout.sriSourceImportCenter.summary.blockingIssueCount > 0
              ? 'critical'
              : 'normal',
          recommendedAction: closeout.sriSourceImportCenter.nextStep,
        },
        {
          key: 'vat_evidence_quality',
          label: 'IVA evidence consistency',
          status: closeout.vatDeclarationWorkspace.readinessStatus,
          source: 'cross_check',
          severity: 'high',
          recommendedAction: closeout.vatDeclarationWorkspace.nextStep,
        },
        {
          key: 'income_tax_evidence_quality',
          label: 'Renta evidence consistency',
          status: closeout.incomeTaxEvidenceWorkspace.readinessStatus,
          source: 'accounting',
          severity: 'high',
          recommendedAction: closeout.incomeTaxEvidenceWorkspace.nextStep,
        },
        {
          key: 'manual_handoff_quality',
          label: 'Manual filing handoff readiness',
          status: closeout.filingAssistant.assistantStatus,
          source: 'manual',
          severity: 'normal',
          recommendedAction: closeout.filingAssistant.nextStep,
        },
      ];
    const blockers = [
      ...closeout.blockers,
      ...qualityFindings
        .filter((finding) => finding.status === 'blocked')
        .map((finding) => finding.key),
    ];
    const readyFindingCount = qualityFindings.filter(
      (finding) => finding.status === 'ready',
    ).length;
    const qualityScore = Math.round(
      (readyFindingCount / qualityFindings.length) * 100,
    );
    const qualityStatus =
      blockers.length > 0
        ? 'blocked'
        : qualityFindings.some((finding) => finding.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      qualityStatus,
      closeout,
      qualityFindings,
      summary: {
        findingCount: qualityFindings.length,
        readyFindingCount,
        blockedFindingCount: qualityFindings.filter(
          (finding) => finding.status === 'blocked',
        ).length,
        criticalFindingCount: qualityFindings.filter(
          (finding) => finding.severity === 'critical',
        ).length,
        qualityScore,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        qualityStatus === 'ready'
          ? 'Usar quality center como base para riesgo y certificado de filing.'
          : 'Resolver hallazgos de evidencia antes de certificar readiness.',
      guardrails: [
        'Quality center mide evidencia operativa; no prueba declaracion presentada.',
        'Los hallazgos criticos requieren revision humana o contador.',
      ],
    };
  }
}
