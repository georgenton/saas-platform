import { TenantAccountingPeriodNarrativeReportView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingCloseoutCertificationReadinessUseCase } from './get-tenant-accounting-closeout-certification-readiness.use-case';
import { ListTenantAccountingCorrectionsQueueUseCase } from './list-tenant-accounting-corrections-queue.use-case';
import { ListTenantAccountingEvidenceAttachmentRegistryUseCase } from './list-tenant-accounting-evidence-attachment-registry.use-case';

export class GetTenantAccountingPeriodNarrativeReportUseCase {
  constructor(
    private readonly getTenantAccountingCloseoutCertificationReadinessUseCase: GetTenantAccountingCloseoutCertificationReadinessUseCase,
    private readonly listTenantAccountingCorrectionsQueueUseCase: ListTenantAccountingCorrectionsQueueUseCase,
    private readonly listTenantAccountingEvidenceAttachmentRegistryUseCase: ListTenantAccountingEvidenceAttachmentRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodNarrativeReportView> {
    const [certification, correctionsQueue, attachments] = await Promise.all([
      this.getTenantAccountingCloseoutCertificationReadinessUseCase.execute(
        input,
      ),
      this.listTenantAccountingCorrectionsQueueUseCase.execute(input),
      this.listTenantAccountingEvidenceAttachmentRegistryUseCase.execute(input),
    ]);
    const sections: TenantAccountingPeriodNarrativeReportView['sections'] = [
      {
        key: 'financial_closeout',
        title: 'Cierre financiero interno',
        status:
          certification.certificationStatus === 'ready_for_professional_closeout'
            ? 'ready'
            : certification.certificationStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
        narrative: `El periodo esta en estado ${certification.certificationStatus}.`,
        metrics: [
          {
            key: 'ready_checks',
            label: 'Checks listos',
            value: certification.summary.readyCheckCount,
          },
        ],
      },
      {
        key: 'corrections',
        title: 'Correcciones',
        status:
          correctionsQueue.queueStatus === 'blocked'
            ? 'blocked'
            : correctionsQueue.queueStatus === 'needs_review'
              ? 'needs_review'
              : 'ready',
        narrative: `${correctionsQueue.summary.correctionCount} correcciones registradas.`,
        metrics: [
          {
            key: 'open',
            label: 'Abiertas',
            value: correctionsQueue.summary.openCount,
          },
        ],
      },
      {
        key: 'evidence',
        title: 'Evidencia adjunta',
        status:
          attachments.registryStatus === 'needs_review'
            ? 'needs_review'
            : 'ready',
        narrative: `${attachments.summary.attachmentCount} adjuntos y ${attachments.summary.vaultArtifactCount} artifacts en vault.`,
        metrics: [
          {
            key: 'attachments',
            label: 'Adjuntos',
            value: attachments.summary.attachmentCount,
          },
        ],
      },
    ];
    const blockers = [
      ...certification.blockers,
      ...correctionsQueue.blockers,
      ...attachments.blockers,
    ];
    const blockedCount = sections.filter(
      (section) => section.status === 'blocked',
    ).length;
    const needsReviewCount = sections.filter(
      (section) => section.status === 'needs_review',
    ).length;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      reportStatus:
        blockedCount > 0
          ? 'blocked'
          : needsReviewCount > 0
            ? 'needs_review'
            : 'ready',
      headline: `Narrativa de cierre contable ${input.period}`,
      sections,
      summary: {
        sectionCount: sections.length,
        readySectionCount: sections.filter(
          (section) => section.status === 'ready',
        ).length,
        riskFlagCount:
          certification.handoff.summary.riskFlagCount,
        correctionCount: correctionsQueue.summary.correctionCount,
        attachmentCount: attachments.summary.attachmentCount,
      },
      blockers: [...new Set(blockers)],
      nextStep: 'Usar narrativa como resumen operativo para contador y equipo.',
      guardrails: [
        'Reporte narrativo interno; no es informe financiero oficial.',
        'No reemplaza notas a estados financieros ni firma profesional.',
      ],
    };
  }
}
