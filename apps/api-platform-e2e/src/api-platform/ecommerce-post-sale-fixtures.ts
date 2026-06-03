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

export function createEcommerceOrderPaymentDisputeWorkspaceFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:01:00.000Z'),
    productEntity,
    orderDraft,
    disputeStatus: 'confirmed',
    summary: 'El cobro está alineado y no requiere escalar una disputa real.',
    disputeProfile: {
      activeChannel: 'whatsapp',
      disputeReason: 'Las señales de cobro están alineadas.',
      recommendedOwnerRole: 'operator',
      expectedEvidence: [
        'Transferencia esperada',
        'Pantallazo de confirmación',
      ],
    },
    resolutionPaths: [
      {
        key: 'confirmed',
        label: 'Confirmar cobro',
        detail: 'Confirmar el mismo canal con el buyer.',
      },
      {
        key: 'hold',
        label: 'Escalar a hold',
        detail: 'Escalar a hold si aparece contradicción fiscal.',
      },
    ],
    nextStep: 'Continuar con fulfillment o marcar la orden como confirmada.',
    blockedBy: [],
    guardrails: ['Payment dispute guardrail'],
  };
}

export function createEcommerceOrderPaymentDisputeResolutionPacketFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:01:05.000Z'),
    productEntity,
    orderDraft,
    resolutionDecision: 'confirmed',
    summary: 'La disputa quedó resuelta y la orden puede seguir su curso.',
    resolutionOwner: {
      productKey: 'ecommerce',
      role: 'operator',
    },
    requiredEvidence: [
      'Transferencia esperada',
      'Pantallazo de confirmación',
    ],
    resolutionChecklist: [
      'Validar evidencia del buyer',
      'Cerrar el frente operativo sin escalar hold',
    ],
    nextStep: 'Continuar hacia fulfillment controlado.',
    blockedBy: [],
    guardrails: ['Payment dispute resolution guardrail'],
  };
}

export function createEcommerceOrderFulfillmentCompletionPacketFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:01:10.000Z'),
    productEntity,
    orderDraft,
    completionStatus: 'partial',
    summary: 'La entrega ya avanzó, pero todavía quedan cierres menores.',
    deliveryResult: {
      resultLabel: 'Activación en curso con evidencia parcial.',
      deliveryMode: 'service_activation',
      completionChannel: 'whatsapp',
    },
    completionChecklist: [
      'Verificar activación con el buyer',
      'Registrar confirmación operativa',
    ],
    operatorNotes: ['Buyer respondió', 'Falta cierre final de activación'],
    nextStep: 'Cerrar la confirmación final y mover la orden a delivered.',
    blockedBy: [],
    guardrails: ['Fulfillment completion guardrail'],
  };
}

export function createEcommerceOrderFulfillmentDeliveryConfirmationPacketFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:01:15.000Z'),
    productEntity,
    orderDraft,
    confirmationStatus: 'partial',
    summary: 'La entrega ya tiene señales suficientes, aunque todavía falta cierre final.',
    confirmationRecord: {
      resultLabel: 'Activación parcialmente confirmada con evidencia operativa.',
      deliveryMode: 'service_activation',
      deliveryChannel: 'whatsapp',
      ownerRole: 'operator',
    },
    evidenceChecklist: [
      'Confirmación del buyer',
      'Captura de activación compartida',
    ],
    operatorNotes: [
      'Buyer respondió por WhatsApp.',
      'Falta confirmación final de activación.',
    ],
    nextStep: 'Cerrar confirmación final y marcar la orden como delivered.',
    blockedBy: [],
    guardrails: ['Fulfillment delivery confirmation guardrail'],
  };
}

export function createEcommerceOrderPostSaleReportingBoardFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:01:20.000Z'),
    productEntity,
    summary: {
      totalOrders: 1,
      paidCount: 0,
      inProgressCount: 1,
      deliveredCount: 0,
      blockedCount: 0,
      divergenceCount: 1,
      headline: 'Hay una orden activa con desvío entre cobro y entrega.',
      detail: 'El reporting board ayuda a mirar órdenes vivas y cierres pendientes.',
    },
    reportingLanes: [
      {
        laneKey: 'in_progress',
        count: 1,
        operatorBias: 'Empujar entrega o resolver el desvío detectado.',
      },
    ],
    entries: [
      {
        orderDraftId: 'order_draft_001',
        orderLabel: 'SaaS Platform Store flagship offer setup v2 order draft',
        reportingStatus: 'in_progress',
        driftSignal: 'payment_without_delivery',
        paymentLogStatus: 'confirmed',
        deliveryStatus: 'in_progress',
        nextAction: 'Cerrar fulfillment o revisar por qué aún no figura entregada.',
        updatedAt: new Date('2026-06-02T11:01:20.000Z'),
      },
    ],
  };
}

export function createEcommerceOrderPostSaleReportingSummaryFixture() {
  return {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-06-02T11:01:25.000Z'),
    productEntity,
    summary: {
      totalOrders: 1,
      confirmedCount: 1,
      deliveredCount: 0,
      blockedCount: 0,
      disputedCount: 0,
      divergenceCount: 1,
      headline: 'El post-sale sigue vivo con una orden confirmada y entrega pendiente.',
      detail:
        'Todavía hay desvío entre cobro confirmado y cierre final de entrega.',
    },
    revenueSnapshot: {
      expectedOrderCount: 1,
      confirmedOrderCount: 1,
      awaitingPaymentCount: 0,
      readyForFulfillmentCount: 1,
    },
    operationalHighlights: [
      'Cobro confirmado por WhatsApp.',
      'La entrega todavía no se marca como delivered.',
    ],
    nextFocus: 'Cerrar fulfillment para eliminar el desvío operativo visible.',
  };
}
