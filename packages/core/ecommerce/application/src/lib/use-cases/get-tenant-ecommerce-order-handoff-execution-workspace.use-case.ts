import { TenantEcommerceOrderHandoffExecutionWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase } from './get-tenant-ecommerce-invoice-draft-intake-workspace.use-case';
import { GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase } from './get-tenant-ecommerce-order-growth-follow-up-workspace.use-case';
import { RequestTenantEcommerceOrderHandoffDecisionUseCase } from './request-tenant-ecommerce-order-handoff-decision.use-case';

export class GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderHandoffDecisionUseCase: RequestTenantEcommerceOrderHandoffDecisionUseCase,
    private readonly getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase: GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
    private readonly getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase: GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderHandoffExecutionWorkspaceView | null> {
    const [handoffDecision, invoiceDraftIntakeWorkspace, growthFollowUpWorkspace] =
      await Promise.all([
        this.requestTenantEcommerceOrderHandoffDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (
      !handoffDecision ||
      !invoiceDraftIntakeWorkspace ||
      !growthFollowUpWorkspace
    ) {
      return null;
    }

    const blockedBy = [
      ...handoffDecision.blockedBy,
      ...invoiceDraftIntakeWorkspace.blockedBy,
      ...growthFollowUpWorkspace.blockedBy,
    ];

    const executionStatus =
      blockedBy.length > 0
        ? 'blocked'
        : handoffDecision.route === 'invoicing' &&
            invoiceDraftIntakeWorkspace.workspaceStatus ===
              'ready_to_open_invoice_draft'
          ? 'ready_for_execution'
          : handoffDecision.route === 'growth_follow_up' &&
              growthFollowUpWorkspace.workspaceStatus ===
                'ready_for_growth_follow_up'
            ? 'ready_for_execution'
            : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: handoffDecision.productEntity,
      orderDraft: handoffDecision.orderDraft,
      executionStatus,
      activeRoute: handoffDecision.route,
      summary:
        executionStatus === 'ready_for_execution' &&
        handoffDecision.route === 'invoicing'
          ? 'La orden ya puede ejecutarse hacia Invoicing como siguiente paso asistido.'
          : executionStatus === 'ready_for_execution' &&
              handoffDecision.route === 'growth_follow_up'
            ? 'La orden ya puede ejecutarse hacia Growth follow-up con contexto suficiente.'
            : executionStatus === 'blocked'
              ? 'La orden todavía tiene bloqueos y no conviene ejecutar el handoff.'
              : 'La orden aún necesita más datos o una mejor ruta antes de ejecutar el handoff.',
      owner: {
        ...handoffDecision.owner,
      },
      routeTargets: {
        invoicingTarget: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        growthTarget: {
          productKey: 'growth',
          channel: 'whatsapp',
          handoffMode: 'operator_assist',
        },
      },
      executionChecklist:
        handoffDecision.route === 'invoicing'
          ? [
              'Confirmar que el buyer profile y la intención fiscal siguen vigentes.',
              'Abrir el draft en Invoicing solo como handoff asistido.',
              'Dejar trazabilidad del snapshot comercial junto con el fiscal.',
            ]
          : handoffDecision.route === 'growth_follow_up'
            ? [
                'Retomar el hilo comercial sin perder el contexto de la orden.',
                'Mantener CTA, oferta y siguiente paso consistentes en WhatsApp.',
                'Escalar a facturación solo cuando el comprador confirme y complete data.',
              ]
            : [
                'Resolver bloqueos o campos faltantes antes de ejecutar cualquier handoff.',
                'Mantener la orden visible en la mesa operativa.',
                'Evitar aperturas fiscales o activaciones conversacionales prematuras.',
              ],
      nextStep:
        handoffDecision.route === 'invoicing'
          ? 'Abrir invoice draft intake en Invoicing.'
          : handoffDecision.route === 'growth_follow_up'
            ? 'Activar growth follow-up con buyer context y CTA consistente.'
            : 'Completar datos y redefinir la ruta del handoff.',
      handoffArtifacts: [
        ...new Set([
          ...handoffDecision.routeChecklist,
          ...invoiceDraftIntakeWorkspace.handoffArtifacts,
          ...growthFollowUpWorkspace.handoffArtifacts,
        ]),
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...handoffDecision.guardrails,
          ...invoiceDraftIntakeWorkspace.guardrails,
          ...growthFollowUpWorkspace.guardrails,
          'No convertir esta ejecución en emisión final, cobro vivo ni automatización plena.',
        ]),
      ],
    };
  }
}
