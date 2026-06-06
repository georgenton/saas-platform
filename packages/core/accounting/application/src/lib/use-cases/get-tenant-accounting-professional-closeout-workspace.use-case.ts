import { TenantAccountingProfessionalCloseoutWorkspaceView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingCloseoutCertificationReadinessUseCase } from './get-tenant-accounting-closeout-certification-readiness.use-case';
import { GetTenantAccountingPeriodNarrativeReportUseCase } from './get-tenant-accounting-period-narrative-report.use-case';
import { ListTenantAccountingCorrectionsQueueUseCase } from './list-tenant-accounting-corrections-queue.use-case';
import { ListTenantAccountingEvidenceAttachmentRegistryUseCase } from './list-tenant-accounting-evidence-attachment-registry.use-case';
import { RequestTenantAccountingAdjustmentRecommendationPacketUseCase } from './request-tenant-accounting-adjustment-recommendation-packet.use-case';
import { RequestTenantAccountingAiReviewAssistantPacketUseCase } from './request-tenant-accounting-ai-review-assistant-packet.use-case';

export class GetTenantAccountingProfessionalCloseoutWorkspaceUseCase {
  constructor(
    private readonly getTenantAccountingCloseoutCertificationReadinessUseCase: GetTenantAccountingCloseoutCertificationReadinessUseCase,
    private readonly listTenantAccountingCorrectionsQueueUseCase: ListTenantAccountingCorrectionsQueueUseCase,
    private readonly requestTenantAccountingAdjustmentRecommendationPacketUseCase: RequestTenantAccountingAdjustmentRecommendationPacketUseCase,
    private readonly listTenantAccountingEvidenceAttachmentRegistryUseCase: ListTenantAccountingEvidenceAttachmentRegistryUseCase,
    private readonly getTenantAccountingPeriodNarrativeReportUseCase: GetTenantAccountingPeriodNarrativeReportUseCase,
    private readonly requestTenantAccountingAiReviewAssistantPacketUseCase: RequestTenantAccountingAiReviewAssistantPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingProfessionalCloseoutWorkspaceView> {
    const [
      certificationReadiness,
      correctionsQueue,
      adjustmentRecommendationPacket,
      evidenceAttachmentRegistry,
      narrativeReport,
      aiReviewAssistantPacket,
    ] = await Promise.all([
      this.getTenantAccountingCloseoutCertificationReadinessUseCase.execute(
        input,
      ),
      this.listTenantAccountingCorrectionsQueueUseCase.execute(input),
      this.requestTenantAccountingAdjustmentRecommendationPacketUseCase.execute(
        input,
      ),
      this.listTenantAccountingEvidenceAttachmentRegistryUseCase.execute(input),
      this.getTenantAccountingPeriodNarrativeReportUseCase.execute(input),
      this.requestTenantAccountingAiReviewAssistantPacketUseCase.execute(input),
    ]);
    const blockers = [
      ...certificationReadiness.blockers,
      ...correctionsQueue.blockers,
      ...adjustmentRecommendationPacket.blockers,
      ...evidenceAttachmentRegistry.blockers,
      ...narrativeReport.blockers,
      ...aiReviewAssistantPacket.blockers,
    ];
    const workspaceStatus =
      certificationReadiness.certificationStatus ===
        'ready_for_professional_closeout' &&
      correctionsQueue.summary.openCount === 0 &&
      correctionsQueue.summary.inProgressCount === 0
        ? 'ready_for_closeout'
        : certificationReadiness.latestAccountantReview?.status ===
            'changes_requested'
          ? 'changes_requested'
          : certificationReadiness.handoff.handoffStatus ===
              'ready_for_accountant'
            ? 'ready_for_accountant'
            : 'draft';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      certificationReadiness,
      correctionsQueue,
      adjustmentRecommendationPacket,
      evidenceAttachmentRegistry,
      narrativeReport,
      aiReviewAssistantPacket,
      summary: {
        correctionCount: correctionsQueue.summary.correctionCount,
        attachmentCount:
          evidenceAttachmentRegistry.summary.attachmentCount,
        recommendationCount:
          adjustmentRecommendationPacket.summary.recommendationCount,
        certificationReady:
          certificationReadiness.certificationStatus ===
          'ready_for_professional_closeout',
      },
      blockers: [...new Set(blockers)],
      nextStep:
        workspaceStatus === 'ready_for_closeout'
          ? 'Registrar cierre externo/profesional cuando el contador lo confirme.'
          : 'Completar correcciones, evidencia y review profesional.',
      guardrails: [
        'Workspace operativo; no cierra libros legales automaticamente.',
        'El estado closed_externally debe venir de confirmacion humana externa.',
        'No sustituye contador, auditor ni certificacion profesional.',
      ],
    };
  }
}
