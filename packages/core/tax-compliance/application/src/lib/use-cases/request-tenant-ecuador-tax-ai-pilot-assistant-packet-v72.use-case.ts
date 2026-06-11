import {
  EcuadorTaxAiPilotAssistantPacketV72View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase } from './get-tenant-ecuador-tax-accountant-collaboration-workbench-v72.use-case';

export class RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase: GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAiPilotAssistantPacketV72View> {
    const collaborationWorkbench =
      await this.getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase.execute(
        input,
      );
    const suggestedActions: EcuadorTaxAiPilotAssistantPacketV72View['suggestedActions'] =
      [
        ...collaborationWorkbench.collaborationItems
          .filter((item) => item.status !== 'ready')
          .slice(0, 5)
          .map((item) => ({
            key: `assist_${item.key}`,
            label: item.label,
            status: item.status,
            target:
              item.owner === 'accountant'
                ? ('accountant' as const)
                : ('operator' as const),
            promptPackVersion: 'tax-pilot-v72',
            contextRefs: item.evidenceRefs,
            suggestedCopy: `${item.question} ${item.resolutionAction}`,
            guardrail:
              'Sugerencia IA: requiere revision humana antes de responder o cerrar evidencia.',
          })),
        {
          key: 'assist_closeout_summary',
          label: 'Pilot closeout summary',
          status: collaborationWorkbench.workbenchStatus,
          target: 'ai',
          promptPackVersion: 'tax-pilot-v72',
          contextRefs: ['accountant_collaboration_workbench_v72'],
          suggestedCopy: collaborationWorkbench.nextStep,
          guardrail:
            'La IA resume el piloto; no declara, paga, firma ni certifica obligaciones.',
        },
      ];
    const blockers = collaborationWorkbench.blockers;
    const assistantStatus = resolveStatus(
      suggestedActions.map((action) => action.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      assistantStatus,
      collaborationWorkbench,
      suggestedActions,
      summary: {
        actionCount: suggestedActions.length,
        accountantPromptCount: suggestedActions.filter(
          (action) => action.target === 'accountant',
        ).length,
        blockedActionCount: suggestedActions.filter(
          (action) => action.status === 'blocked',
        ).length,
        aiGuardrailCount: suggestedActions.filter((action) => action.guardrail)
          .length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        assistantStatus === 'ready'
          ? 'Usar packet IA para resumir el piloto y preparar siguiente iteracion.'
          : 'Revisar sugerencias bloqueantes con operador/contador antes del closeout.',
      guardrails: [
        'El asistente 7.2 consume contratos deterministas y trabaja en modo sugerencia.',
        'Toda respuesta profesional debe revisarse por humano y contador cuando corresponda.',
      ],
    };
  }
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
