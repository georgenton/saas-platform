import { EcuadorTaxSriSourceImportCenterV2View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase } from './get-tenant-ecuador-tax-sri-evidence-intake-v2-workspace.use-case';
import { GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-platform-reconciliation-workspace.use-case';

export class GetTenantEcuadorTaxSriSourceImportCenterV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase: GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
    private readonly getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase: GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxSriSourceImportCenterV2View> {
    const [intake, reconciliation] = await Promise.all([
      this.getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase.execute(
        input,
      ),
    ]);
    const sourceChannels = intake.intakeChannels.map((channel) => ({
      key: channel.key,
      label: channel.label,
      status: channel.readinessStatus,
      acceptedFormats: channel.acceptedFormats,
      voucherCount: channel.voucherCount,
      issueCount: reconciliation.issues.filter(
        (issue) => issue.source === 'sri',
      ).length,
      nextAction: channel.nextStep,
    }));
    const blockers = [
      ...intake.blockers,
      ...reconciliation.issues
        .filter((issue) => issue.severity === 'blocking')
        .map((issue) => issue.key),
    ];
    const centerStatus =
      blockers.length > 0 || intake.readinessStatus === 'blocked'
        ? 'blocked'
        : intake.readinessStatus === 'needs_review' ||
            reconciliation.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      centerStatus,
      intake,
      reconciliation,
      sourceChannels,
      summary: {
        channelCount: sourceChannels.length,
        readyChannelCount: sourceChannels.filter(
          (channel) => channel.status === 'ready',
        ).length,
        sriVoucherCount: intake.workspace.summary.totalVouchers,
        duplicateAccessKeys: intake.deduplication.duplicateAccessKeys,
        reconciliationIssueCount: reconciliation.issueSummary.totalIssues,
        blockingIssueCount: reconciliation.issueSummary.blockingIssues,
        ledgerSriRows: intake.deduplication.ledgerSriRows,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        centerStatus === 'ready'
          ? 'Usar import center SRI 2.0 como fuente para IVA, renta y closeout.'
          : 'Completar importaciones SRI y resolver diferencias bloqueantes.',
      guardrails: [
        'El contribuyente o contador descarga y aporta la informacion SRI.',
        'No se almacenan credenciales SRI ni se automatiza captcha, firma, declaracion o pago.',
      ],
    };
  }
}
