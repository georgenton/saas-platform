import { EcuadorTaxOperatingDashboardV3View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxCommandCenterV2UseCase } from './get-tenant-ecuador-tax-command-center-v2.use-case';
import { GetTenantEcuadorTaxEvidenceQualityCenterUseCase } from './get-tenant-ecuador-tax-evidence-quality-center.use-case';
import { GetTenantEcuadorTaxObligationRiskMonitorUseCase } from './get-tenant-ecuador-tax-obligation-risk-monitor.use-case';
import { RequestTenantEcuadorTaxFilingReadinessCertificateUseCase } from './request-tenant-ecuador-tax-filing-readiness-certificate.use-case';

export class GetTenantEcuadorTaxOperatingDashboardV3UseCase {
  constructor(
    private readonly getTenantEcuadorTaxCommandCenterV2UseCase: GetTenantEcuadorTaxCommandCenterV2UseCase,
    private readonly getTenantEcuadorTaxEvidenceQualityCenterUseCase: GetTenantEcuadorTaxEvidenceQualityCenterUseCase,
    private readonly getTenantEcuadorTaxObligationRiskMonitorUseCase: GetTenantEcuadorTaxObligationRiskMonitorUseCase,
    private readonly requestTenantEcuadorTaxFilingReadinessCertificateUseCase: RequestTenantEcuadorTaxFilingReadinessCertificateUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxOperatingDashboardV3View> {
    const [commandCenter, qualityCenter, riskMonitor, readinessCertificate] =
      await Promise.all([
        this.getTenantEcuadorTaxCommandCenterV2UseCase.execute(input),
        this.getTenantEcuadorTaxEvidenceQualityCenterUseCase.execute(input),
        this.getTenantEcuadorTaxObligationRiskMonitorUseCase.execute(input),
        this.requestTenantEcuadorTaxFilingReadinessCertificateUseCase.execute(
          input,
        ),
      ]);
    const dashboardTiles: EcuadorTaxOperatingDashboardV3View['dashboardTiles'] =
      [
        tile('command_center', 'Command center', commandCenter.commandStatus === 'blocked' ? 'blocked' : commandCenter.commandStatus === 'ready' || commandCenter.commandStatus === 'externally_filed' ? 'ready' : 'needs_review', `${commandCenter.summary.readyTileCount}/${commandCenter.summary.tileCount}`, `${commandCenter.summary.blockerCount} blockers`, commandCenter.nextStep),
        tile('quality', 'Evidence quality', qualityCenter.qualityStatus, `${qualityCenter.summary.qualityScore}%`, `${qualityCenter.summary.criticalFindingCount} criticos`, qualityCenter.nextStep),
        tile('risk', 'Obligation risk', riskMonitor.riskStatus, `${riskMonitor.summary.criticalRiskCount} criticos`, `${riskMonitor.summary.accountantRequiredCount} contador`, riskMonitor.nextStep),
        tile('certificate', 'Filing readiness', readinessCertificate.certificateStatus === 'blocked' ? 'blocked' : readinessCertificate.certificateStatus === 'ready_for_external_filing' ? 'ready' : 'needs_review', `${readinessCertificate.summary.readyItemCount}/${readinessCertificate.summary.itemCount}`, `${readinessCertificate.summary.accountantQuestionCount} preguntas`, readinessCertificate.nextStep),
      ];
    const blockers = [
      ...commandCenter.blockers,
      ...qualityCenter.blockers,
      ...riskMonitor.blockers,
      ...readinessCertificate.blockers,
    ];
    const dashboardStatus =
      blockers.length > 0 || dashboardTiles.some((item) => item.status === 'blocked')
        ? 'blocked'
        : dashboardTiles.some((item) => item.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      dashboardStatus,
      commandCenter,
      qualityCenter,
      riskMonitor,
      readinessCertificate,
      dashboardTiles,
      summary: {
        tileCount: dashboardTiles.length,
        readyTileCount: dashboardTiles.filter((item) => item.status === 'ready')
          .length,
        blockerCount: new Set(blockers).size,
        accountantRequiredCount: riskMonitor.summary.accountantRequiredCount,
        qualityScore: qualityCenter.summary.qualityScore,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        dashboardStatus === 'ready'
          ? 'Dashboard operativo listo para closeout de producto 3.0.'
          : 'Resolver riesgos operativos antes de cerrar producto.',
      guardrails: [
        'Dashboard 3.0 opera readiness; no sustituye declaracion ni pago.',
        'Los tiles resumen riesgos y deben conservar trazabilidad a evidencia.',
      ],
    };
  }
}

function tile(
  key: string,
  label: string,
  status: 'ready' | 'needs_review' | 'blocked',
  primaryMetric: string,
  secondaryMetric: string,
  nextAction: string,
): EcuadorTaxOperatingDashboardV3View['dashboardTiles'][number] {
  return { key, label, status, primaryMetric, secondaryMetric, nextAction };
}
