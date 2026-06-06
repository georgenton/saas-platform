import { TenantAccountingAiReviewAssistantPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingCloseoutCertificationReadinessUseCase } from './get-tenant-accounting-closeout-certification-readiness.use-case';
import { ListTenantAccountingCorrectionsQueueUseCase } from './list-tenant-accounting-corrections-queue.use-case';

export class RequestTenantAccountingAiReviewAssistantPacketUseCase {
  constructor(
    private readonly getTenantAccountingCloseoutCertificationReadinessUseCase: GetTenantAccountingCloseoutCertificationReadinessUseCase,
    private readonly listTenantAccountingCorrectionsQueueUseCase: ListTenantAccountingCorrectionsQueueUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingAiReviewAssistantPacketView> {
    const [certification, correctionsQueue] = await Promise.all([
      this.getTenantAccountingCloseoutCertificationReadinessUseCase.execute(
        input,
      ),
      this.listTenantAccountingCorrectionsQueueUseCase.execute(input),
    ]);
    const checklist = certification.checks.map((check) => ({
      key: check.key,
      label: check.label,
      status: check.status,
      detail: check.detail,
    }));
    const blockers = [
      ...certification.blockers,
      ...correctionsQueue.blockers,
    ];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      assistantStatus:
        blockers.length > 0
          ? 'blocked'
          : certification.certificationStatus === 'needs_review'
            ? 'needs_review'
            : 'ready',
      explanation:
        'El asistente resume el cierre, preguntas profesionales y correcciones pendientes sin certificar ni declarar.',
      checklist,
      draftedResponses: certification.handoff.accountantQuestions.map(
        (question) => ({
          question,
          draftResponse:
            'Respuesta sugerida: revisar evidencia vault, readiness y correcciones asociadas antes de confirmar.',
          source: 'accounting_professional_closeout_workspace',
        }),
      ),
      summary: {
        checklistCount: checklist.length,
        readyChecklistCount: checklist.filter((item) => item.status === 'ready')
          .length,
        draftedResponseCount:
          certification.handoff.accountantQuestions.length,
        blockerCount: blockers.length,
      },
      blockers: [...new Set(blockers)],
      nextStep: 'Usar el asistente para preparar revision, no para certificar.',
      guardrails: [
        'No sustituye contador ni auditor.',
        'No emite estados financieros oficiales.',
        'No aplica ajustes ni presenta declaraciones automaticamente.',
      ],
    };
  }
}
