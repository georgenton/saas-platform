import { TenantAccountingProfessionalCloseoutArtifactPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingProfessionalCloseoutWorkspaceUseCase } from './get-tenant-accounting-professional-closeout-workspace.use-case';
import { ListTenantAccountingExternalCloseoutRecordsUseCase } from './list-tenant-accounting-external-closeout-records.use-case';

export class RequestTenantAccountingProfessionalCloseoutArtifactPacketUseCase {
  constructor(
    private readonly getTenantAccountingProfessionalCloseoutWorkspaceUseCase: GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
    private readonly listTenantAccountingExternalCloseoutRecordsUseCase: ListTenantAccountingExternalCloseoutRecordsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingProfessionalCloseoutArtifactPacketView> {
    const [workspace, externalRecords] = await Promise.all([
      this.getTenantAccountingProfessionalCloseoutWorkspaceUseCase.execute(
        input,
      ),
      this.listTenantAccountingExternalCloseoutRecordsUseCase.execute(input),
    ]);
    const externalCloseoutRecord = externalRecords[0] ?? null;
    const externalCloseoutRecorded =
      externalCloseoutRecord?.status === 'confirmed_by_accountant';
    const artifactSections: TenantAccountingProfessionalCloseoutArtifactPacketView['artifactSections'] =
      [
        {
          key: 'certification_readiness',
          label: 'Certification readiness',
          status:
            workspace.certificationReadiness.certificationStatus ===
            'ready_for_professional_closeout'
              ? 'ready'
              : 'needs_review',
          reference: 'accounting://closeout-certification-readiness',
          detail: workspace.certificationReadiness.nextStep,
        },
        {
          key: 'corrections_queue',
          label: 'Corrections queue',
          status:
            workspace.correctionsQueue.summary.openCount === 0
              ? 'ready'
              : 'needs_review',
          reference: 'accounting://corrections-queue',
          detail: workspace.correctionsQueue.nextStep,
        },
        {
          key: 'evidence_attachments',
          label: 'Evidence attachments',
          status:
            workspace.evidenceAttachmentRegistry.registryStatus === 'ready'
              ? 'ready'
              : 'needs_review',
          reference: 'accounting://evidence-attachment-registry',
          detail: workspace.evidenceAttachmentRegistry.nextStep,
        },
        {
          key: 'narrative_report',
          label: 'Period narrative report',
          status:
            workspace.narrativeReport.reportStatus === 'ready'
              ? 'ready'
              : 'needs_review',
          reference: 'accounting://period-narrative-report',
          detail: workspace.narrativeReport.nextStep,
        },
        {
          key: 'ai_review_assistant',
          label: 'AI review assistant packet',
          status:
            workspace.aiReviewAssistantPacket.assistantStatus === 'ready'
              ? 'ready'
              : 'needs_review',
          reference: 'accounting://ai-review-assistant-packet',
          detail: workspace.aiReviewAssistantPacket.nextStep,
        },
        {
          key: 'external_closeout_record',
          label: 'External professional closeout record',
          status: externalCloseoutRecorded ? 'ready' : 'needs_review',
          reference: externalCloseoutRecord?.evidenceReference ?? null,
          detail: externalCloseoutRecorded
            ? 'Cierre profesional externo registrado.'
            : 'Registrar confirmacion externa del contador.',
        },
      ];
    const blockers = [
      ...workspace.blockers,
      ...(artifactSections.some((section) => section.status === 'blocked')
        ? ['accounting.closeout_artifact.blocked_section']
        : []),
    ];
    const readySectionCount = artifactSections.filter(
      (section) => section.status === 'ready',
    ).length;
    const packetStatus =
      blockers.length > 0
        ? 'blocked'
        : externalCloseoutRecorded
          ? 'closed_externally'
          : readySectionCount === artifactSections.length - 1
            ? 'ready_for_share'
            : 'draft';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      workspace,
      externalCloseoutRecord,
      artifactSections,
      summary: {
        sectionCount: artifactSections.length,
        readySectionCount,
        evidenceAttachmentCount: workspace.summary.attachmentCount,
        correctionCount: workspace.summary.correctionCount,
        externalCloseoutRecorded,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        packetStatus === 'closed_externally'
          ? 'Conservar artifact packet como carpeta final de cierre.'
          : 'Completar secciones pendientes antes de compartir paquete final.',
      guardrails: [
        'Artifact packet organiza evidencia operativa; no firma ni certifica estados financieros.',
        'La confirmacion externa debe venir de una accion humana verificable.',
      ],
    };
  }
}
