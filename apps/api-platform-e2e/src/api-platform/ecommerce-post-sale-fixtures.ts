const productEntity = {
  tenantSlug: 'saas-platform',
  generatedAt: new Date('2026-05-28T16:31:00.000Z'),
  productEntityId: 'product_entity_001',
  productSetupId: 'product_setup_001',
  savedDraftId: 'saved_draft_001',
  sourceDraftId: 'saas-platform:draft:core-offer',
  status: 'needs_channel_assets',
  title: 'SaaS Platform Store flagship offer setup v2',
  productType: 'core_offer',
  pricingBand: 'Operator confirmed band',
  offerAngle: 'Promesa refinada para setup persistido',
  primaryCta: 'Activar producto base',
  suggestedChannels: ['catalog', 'landing'],
  channelSequence: ['Landing step', 'Whatsapp close'],
  promotedFromSetupAt: new Date('2026-05-28T16:31:00.000Z'),
};

const orderDraft = {
  id: 'order_draft_001',
  tenantId: 'tenant_001',
  tenantSlug: 'saas-platform',
  productEntityId: 'product_entity_001',
  status: 'draft',
  orderLabel: 'SaaS Platform Store flagship offer setup v2 order draft',
  offerTitle: 'Catalog asset entity final',
  pricingSnapshot: 'Operator confirmed band',
  primaryCta: 'Activar producto base',
  closingChannel: 'whatsapp',
  captureStatus: 'ready_for_order_draft',
  invoicingReadinessStatus: 'needs_data',
  customerProfile: {
    fullName: null,
    email: 'buyer@example.com',
    whatsappPhone: '+593999999999',
    billingIntent: 'invoice',
    buyerCompany: null,
    buyerTaxIdOrDocument: null,
  },
  requiredFields: ['full_name'],
  optionalFields: ['buyer_company'],
  operatorPrompts: ['Prompt uno'],
  missingFields: [],
  blockedBy: [],
  guardrails: ['Guardrail'],
  createdAt: new Date('2026-06-01T11:52:00.000Z'),
  updatedAt: new Date('2026-06-01T11:52:00.000Z'),
};

export function createEcommerceOrderPaymentConfirmationLogFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:00:34.750Z'),
    productEntity,
    orderDraft,
    logStatus: 'confirmed',
    summary: 'La orden ya tiene confirmación de cobro utilizable para operar.',
    confirmationRecord: {
      confirmationChannel: 'whatsapp',
      confirmedAt: new Date('2026-06-02T11:00:34.700Z'),
      operatorNote: 'Operador validó el cobro esperado.',
      evidenceHints: ['Transferencia esperada', 'Mensaje de confirmación'],
    },
    decisionSignal: {
      paymentDecision: 'confirmed',
      rationale: 'No hay bloqueos y la orden puede seguir a fulfillment.',
    },
    auditTrail: [
      'Payment confirmation workspace revisado.',
      'Payment confirmation decision confirmado.',
    ],
    blockedBy: [],
    guardrails: ['Payment confirmation log guardrail'],
  };
}

export function createEcommerceOrderFulfillmentDeliveryWorkspaceFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:00:35.750Z'),
    productEntity,
    orderDraft,
    deliveryStatus: 'in_progress',
    deliveryProfile: {
      fulfillmentType: 'service',
      deliveryMode: 'service_activation',
      deliveryChannel: 'whatsapp',
      ownerRole: 'operator',
    },
    handoffNotes: [
      'Cobro confirmado por WhatsApp.',
      'Activación pendiente con el operador.',
    ],
    prerequisitesResolved: ['Cobro confirmado', 'Ruta de entrega definida'],
    executionSignals: {
      paymentLogStatus: 'confirmed',
      lifecycleStatus: 'invoicing',
    },
    blockedBy: [],
    guardrails: ['Fulfillment delivery guardrail'],
  };
}

export function createEcommerceOrderPostSaleOpsBoardFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:00:37.500Z'),
    productEntity,
    summary: {
      totalOrders: 1,
      awaitingPaymentCount: 0,
      readyForFulfillmentCount: 1,
      inProgressCount: 0,
      blockedCount: 0,
      headline: '1 orden lista para seguir a fulfillment.',
      detail: 'El board prioriza órdenes post-sale con foco operativo.',
    },
    focusLanes: [
      {
        laneKey: 'ready_for_fulfillment',
        count: 1,
        operatorBias: 'Empujar ejecución y cierre de entrega.',
      },
    ],
    entries: [
      {
        orderDraftId: 'order_draft_001',
        orderLabel: 'SaaS Platform Store flagship offer setup v2 order draft',
        opsStatus: 'ready_for_fulfillment',
        priorityBand: 'high',
        paymentLogStatus: 'confirmed',
        deliveryStatus: 'in_progress',
        nextAction: 'Asignar activación y cerrar entrega.',
        updatedAt: new Date('2026-06-02T11:00:37.500Z'),
      },
    ],
  };
}
