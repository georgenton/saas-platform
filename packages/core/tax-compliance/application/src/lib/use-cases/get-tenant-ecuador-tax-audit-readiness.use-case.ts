import { EcuadorTaxAuditReadinessView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPeriodWorkspaceUseCase } from './get-tenant-ecuador-tax-period-workspace.use-case';

export class GetTenantEcuadorTaxAuditReadinessUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPeriodWorkspaceUseCase: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAuditReadinessView> {
    const workspace = await this.getTenantEcuadorTaxPeriodWorkspaceUseCase.execute(
      input,
    );
    const generatedOutputs = [
      {
        eventType: 'period_workspace_generated',
        generated: true,
        source: 'tax_period_workspace',
        recommendedPersistence: 'persist_next',
      },
      {
        eventType: 'declaration_draft_requested',
        generated: true,
        source: 'declaration_draft_packet',
        recommendedPersistence: 'persist_next',
      },
      {
        eventType: 'due_monitor_reviewed',
        generated: workspace.dueAlerts.length > 0,
        source: 'due_monitor',
        recommendedPersistence: 'persist_next',
      },
      {
        eventType: 'accountant_packet_requested',
        generated: false,
        source: 'accountant_review_packet',
        recommendedPersistence: 'persist_when_requested',
      },
    ];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      generatedOutputs,
      missingPersistence: generatedOutputs
        .filter((output) => output.recommendedPersistence !== 'none')
        .map((output) => output.eventType),
      recommendedAuditEvents: [
        {
          eventType: 'period_workspace_generated',
          reason: 'Permite reconstruir que informacion vio el operador por periodo.',
          minimumPayload: ['tenantSlug', 'period', 'year', 'status', 'blockers'],
        },
        {
          eventType: 'accountant_packet_requested',
          reason: 'Marca handoff humano y preguntas enviadas al contador.',
          minimumPayload: ['tenantSlug', 'period', 'questions', 'evidenceSummary'],
        },
        {
          eventType: 'declaration_draft_requested',
          reason: 'Audita generacion de borrador antes de declaracion final.',
          minimumPayload: ['tenantSlug', 'period', 'readinessStatus', 'sections'],
        },
        {
          eventType: 'due_monitor_reviewed',
          reason: 'Audita alertas revisadas y obligaciones proximas o vencidas.',
          minimumPayload: ['tenantSlug', 'period', 'alerts', 'asOfDate'],
        },
      ],
      nextStep:
        'Agregar persistencia de eventos tributarios antes de introducir aprobaciones o workflow mutable.',
      guardrails: [
        'Este endpoint describe preparacion de auditoria; aun no persiste eventos.',
        'No debe usarse como prueba de presentacion o pago ante SRI.',
      ],
    };
  }
}
