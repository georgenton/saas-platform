import { EcuadorTaxAuditReadinessView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPeriodWorkspaceUseCase } from './get-tenant-ecuador-tax-period-workspace.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxAuditReadinessUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPeriodWorkspaceUseCase: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase?: ListTenantEcuadorTaxComplianceEventsUseCase,
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
    const persistedEvents = this.listTenantEcuadorTaxComplianceEventsUseCase
      ? await this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
          tenantSlug: input.tenantSlug,
          period: input.period,
          limit: 100,
        })
      : [];
    const persistedEventTypes = new Set(
      persistedEvents.map((event) => event.eventType),
    );
    const generatedOutputs = [
      {
        eventType: 'period_workspace_generated',
        generated: true,
        source: 'tax_period_workspace',
        recommendedPersistence: persistedEventTypes.has(
          'period_workspace_generated',
        )
          ? 'persisted'
          : 'persist_next',
      },
      {
        eventType: 'declaration_draft_requested',
        generated: true,
        source: 'declaration_draft_packet',
        recommendedPersistence: persistedEventTypes.has(
          'declaration_draft_requested',
        )
          ? 'persisted'
          : 'persist_next',
      },
      {
        eventType: 'due_monitor_reviewed',
        generated: workspace.dueAlerts.length > 0,
        source: 'due_monitor',
        recommendedPersistence: persistedEventTypes.has('due_monitor_reviewed')
          ? 'persisted'
          : 'persist_next',
      },
      {
        eventType: 'accountant_packet_requested',
        generated: false,
        source: 'accountant_review_packet',
        recommendedPersistence: persistedEventTypes.has(
          'accountant_packet_requested',
        )
          ? 'persisted'
          : 'persist_when_requested',
      },
      {
        eventType: 'accountant_review_transitioned',
        generated: false,
        source: 'accountant_review_lifecycle',
        recommendedPersistence: persistedEventTypes.has(
          'accountant_review_transitioned',
        )
          ? 'persisted'
          : 'persist_when_transitioned',
      },
      {
        eventType: 'tax_sales_book_generated',
        generated: false,
        source: 'tax_sales_book',
        recommendedPersistence: persistedEventTypes.has(
          'tax_sales_book_generated',
        )
          ? 'persisted'
          : 'persist_when_requested',
      },
    ];
    const missingPersistence = generatedOutputs
      .filter((output) => output.recommendedPersistence.startsWith('persist_'))
      .map((output) => output.eventType);

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      generatedOutputs,
      missingPersistence,
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
          eventType: 'accountant_review_transitioned',
          reason: 'Audita cambios de estado y aprobaciones humanas.',
          minimumPayload: ['tenantSlug', 'period', 'reviewId', 'status'],
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
        {
          eventType: 'tax_sales_book_generated',
          reason: 'Audita libro de ventas derivado y evidencia ecommerce conectada.',
          minimumPayload: [
            'tenantSlug',
            'period',
            'documentCount',
            'ecommerceOrderCount',
          ],
        },
      ],
      nextStep:
        missingPersistence.length > 0
          ? 'Persistir los eventos tributarios faltantes cuando el operador ejecute cada accion.'
          : 'Mantener el ledger como evidencia operacional antes de aprobaciones externas.',
      guardrails: [
        'Este endpoint describe preparacion de auditoria y compara eventos recomendados con el ledger persistido.',
        'No debe usarse como prueba de presentacion o pago ante SRI.',
      ],
    };
  }
}
