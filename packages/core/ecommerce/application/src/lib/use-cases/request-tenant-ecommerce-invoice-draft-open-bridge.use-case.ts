import { TenantEcommerceInvoiceDraftOpenBridgeView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase } from './get-tenant-ecommerce-invoice-draft-intake-workspace.use-case';
import { GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-handoff-execution-workspace.use-case';

export class RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase {
  constructor(
    private readonly getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase: GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
    private readonly getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase: GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceInvoiceDraftOpenBridgeView | null> {
    const [invoiceDraftIntakeWorkspace, handoffExecutionWorkspace] =
      await Promise.all([
        this.getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (!invoiceDraftIntakeWorkspace || !handoffExecutionWorkspace) {
      return null;
    }

    const blockedBy = [
      ...invoiceDraftIntakeWorkspace.blockedBy,
      ...handoffExecutionWorkspace.blockedBy,
    ];

    const bridgeStatus =
      blockedBy.length > 0
        ? 'blocked'
        : handoffExecutionWorkspace.activeRoute === 'invoicing' &&
            handoffExecutionWorkspace.executionStatus === 'ready_for_execution' &&
            invoiceDraftIntakeWorkspace.workspaceStatus ===
              'ready_to_open_invoice_draft'
          ? 'ready_to_open'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: invoiceDraftIntakeWorkspace.productEntity,
      orderDraft: invoiceDraftIntakeWorkspace.orderDraft,
      bridgeStatus,
      summary:
        bridgeStatus === 'ready_to_open'
          ? 'El bridge ya tiene el payload suficiente para abrir el invoice draft en Invoicing.'
          : bridgeStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como apertura fiscal lista.'
            : 'La orden todavía necesita más datos o una mejor ejecución del handoff antes de abrir el draft.',
      targetWorkspace: {
        ...invoiceDraftIntakeWorkspace.targetWorkspace,
      },
      payload: {
        customerLabel:
          invoiceDraftIntakeWorkspace.orderDraft.customerProfile.fullName ??
          invoiceDraftIntakeWorkspace.orderDraft.orderLabel,
        documentHint: 'invoice',
        offerTitle: invoiceDraftIntakeWorkspace.commercialSnapshot.offerTitle,
        pricingSnapshot:
          invoiceDraftIntakeWorkspace.commercialSnapshot.pricingSnapshot,
        billingIntent:
          invoiceDraftIntakeWorkspace.fiscalSnapshot.billingIntent,
      },
      fiscalSnapshot: {
        requiredFields: [
          ...invoiceDraftIntakeWorkspace.fiscalSnapshot.requiredFields,
        ],
        missingFields: [
          ...invoiceDraftIntakeWorkspace.fiscalSnapshot.missingFields,
        ],
      },
      handoffArtifacts: [...invoiceDraftIntakeWorkspace.handoffArtifacts],
      operatorChecklist: [
        ...invoiceDraftIntakeWorkspace.operatorChecklist,
        'Confirmar que la ruta activa siga siendo Invoicing antes de abrir el draft.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...invoiceDraftIntakeWorkspace.guardrails,
          ...handoffExecutionWorkspace.guardrails,
          'No tratar este bridge como emisión final ni como autorización tributaria automática.',
        ]),
      ],
    };
  }
}
