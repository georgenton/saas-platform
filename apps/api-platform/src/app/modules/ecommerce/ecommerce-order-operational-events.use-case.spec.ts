import {
  GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
  ListTenantEcommerceOrderOperationalEventsUseCase,
  RecordTenantEcommerceOrderOperationalEventUseCase,
} from '@saas-platform/ecommerce-application';

describe('Ecommerce order operational event use cases', () => {
  const tenant = {
    id: 'tenant_123',
    slug: 'saas-platform',
    name: 'SaaS Platform',
    status: 'active' as const,
    createdAt: new Date('2026-06-03T18:40:00.000Z'),
    updatedAt: new Date('2026-06-03T18:40:00.000Z'),
  };
  const orderDraft = {
    id: 'order_draft_001',
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    productEntityId: 'product_entity_001',
    status: 'ready_for_review' as const,
    orderLabel: 'Flagship offer order draft',
    offerTitle: 'Flagship offer',
    pricingSnapshot: 'USD 99 monthly',
    primaryCta: 'Comprar ahora',
    closingChannel: 'landing' as const,
    captureStatus: 'ready_for_order_draft' as const,
    invoicingReadinessStatus: 'ready_to_invoice' as const,
    customerProfile: {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      whatsappPhone: '+593999999999',
      billingIntent: 'Factura',
      buyerCompany: null,
      buyerTaxIdOrDocument: '0912345678',
    },
    requiredFields: ['buyer_legal_name'],
    optionalFields: ['whatsapp_phone'],
    operatorPrompts: ['Confirmar pago'],
    missingFields: [],
    blockedBy: [],
    guardrails: ['No auto-refund without review.'],
    createdAt: new Date('2026-06-03T18:30:00.000Z'),
    updatedAt: new Date('2026-06-03T18:35:00.000Z'),
  };

  it('records one operational event for a matching order draft', async () => {
    const getTenantBySlugUseCase = {
      execute: jest.fn().mockResolvedValue(tenant),
    };
    const ecommerceOrderDraftRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(orderDraft),
    };
    const ecommerceOrderOperationalEventRepository = {
      record: jest.fn().mockImplementation(async (command) => ({
        ...command,
        createdAt: new Date('2026-06-03T18:45:30.000Z'),
      })),
    };
    const useCase = new RecordTenantEcommerceOrderOperationalEventUseCase(
      getTenantBySlugUseCase as never,
      ecommerceOrderDraftRepository as never,
      ecommerceOrderOperationalEventRepository as never,
      () => 'event_001',
      () => new Date('2026-06-03T18:45:00.000Z'),
    );

    await expect(
      useCase.execute(tenant.slug, orderDraft.productEntityId, orderDraft.id, {
        eventType: 'payment_reconciliation',
        sourceWorkspace: ' payment-reconciliation-workspace ',
        status: ' reconciled ',
        summary: ' Payment matched operator evidence. ',
        payload: {
          paymentLogStatus: 'confirmed',
          reconciliationStatus: 'reconciled',
        },
      }),
    ).resolves.toEqual({
      id: 'event_001',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      productEntityId: orderDraft.productEntityId,
      orderDraftId: orderDraft.id,
      dedupeKey:
        'saas-platform:product_entity_001:order_draft_001:payment_reconciliation:payment-reconciliation-workspace:reconciled',
      eventType: 'payment_reconciliation',
      sourceWorkspace: 'payment-reconciliation-workspace',
      status: 'reconciled',
      summary: 'Payment matched operator evidence.',
      payload: {
        paymentLogStatus: 'confirmed',
        reconciliationStatus: 'reconciled',
      },
      occurredAt: new Date('2026-06-03T18:45:00.000Z'),
      createdAt: new Date('2026-06-03T18:45:30.000Z'),
    });
    expect(ecommerceOrderOperationalEventRepository.record).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'event_001',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        productEntityId: orderDraft.productEntityId,
        orderDraftId: orderDraft.id,
        dedupeKey:
          'saas-platform:product_entity_001:order_draft_001:payment_reconciliation:payment-reconciliation-workspace:reconciled',
      }),
    );
  });

  it('does not record an event when the order draft belongs to another product entity', async () => {
    const useCase = new RecordTenantEcommerceOrderOperationalEventUseCase(
      { execute: jest.fn().mockResolvedValue(tenant) } as never,
      { findByTenantSlugAndId: jest.fn().mockResolvedValue(orderDraft) } as never,
      { record: jest.fn() } as never,
    );

    await expect(
      useCase.execute(tenant.slug, 'other_product_entity', orderDraft.id, {
        eventType: 'inventory_reservation',
        sourceWorkspace: 'inventory-reservation-workspace',
        status: 'reserved',
        summary: 'Reserved capacity.',
      }),
    ).resolves.toBeNull();
  });

  it('lists latest operational events for a matching order draft', async () => {
    const events = [
      {
        id: 'event_002',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        productEntityId: orderDraft.productEntityId,
        orderDraftId: orderDraft.id,
        dedupeKey:
          'saas-platform:product_entity_001:order_draft_001:inventory_reservation:inventory-reservation-workspace:reserved',
        eventType: 'inventory_reservation' as const,
        sourceWorkspace: 'inventory-reservation-workspace',
        status: 'reserved',
        summary: 'Capacity reserved.',
        payload: { reservationMode: 'capacity_hold' },
        occurredAt: new Date('2026-06-03T18:50:00.000Z'),
        createdAt: new Date('2026-06-03T18:50:01.000Z'),
      },
    ];
    const ecommerceOrderOperationalEventRepository = {
      listLatestByOrderDraft: jest.fn().mockResolvedValue(events),
    };
    const useCase = new ListTenantEcommerceOrderOperationalEventsUseCase(
      { findByTenantSlugAndId: jest.fn().mockResolvedValue(orderDraft) } as never,
      ecommerceOrderOperationalEventRepository as never,
    );

    await expect(
      useCase.execute(tenant.slug, orderDraft.productEntityId, orderDraft.id, {
        eventType: 'inventory_reservation',
        status: 'reserved',
        sourceWorkspace: 'inventory-reservation-workspace',
        limit: 5,
      }),
    ).resolves.toEqual(events);
    expect(
      ecommerceOrderOperationalEventRepository.listLatestByOrderDraft,
    ).toHaveBeenCalledWith({
      tenantSlug: tenant.slug,
      productEntityId: orderDraft.productEntityId,
      orderDraftId: orderDraft.id,
      eventType: 'inventory_reservation',
      status: 'reserved',
      sourceWorkspace: 'inventory-reservation-workspace',
      limit: 5,
    });
  });

  it('builds one operational review workspace from timeline events', async () => {
    const events = [
      {
        id: 'event_003',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        productEntityId: orderDraft.productEntityId,
        orderDraftId: orderDraft.id,
        dedupeKey:
          'saas-platform:product_entity_001:order_draft_001:post_sale_closeout:order-post-sale-reporting-summary:in_progress',
        eventType: 'post_sale_closeout' as const,
        sourceWorkspace: 'order-post-sale-reporting-summary',
        status: 'in_progress',
        summary: 'Closeout has payment without delivery drift.',
        payload: {
          driftSignal: 'payment_without_delivery',
          nextStep: 'Cerrar entrega antes del closeout estable.',
        },
        occurredAt: new Date('2026-06-03T18:55:00.000Z'),
        createdAt: new Date('2026-06-03T18:55:01.000Z'),
      },
      {
        id: 'event_002',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        productEntityId: orderDraft.productEntityId,
        orderDraftId: orderDraft.id,
        dedupeKey:
          'saas-platform:product_entity_001:order_draft_001:inventory_reservation:inventory-reservation-workspace:blocked',
        eventType: 'inventory_reservation' as const,
        sourceWorkspace: 'inventory-reservation-workspace',
        status: 'blocked',
        summary: 'Capacity is blocked.',
        payload: { blockedBy: ['capacity_review'] },
        occurredAt: new Date('2026-06-03T18:50:00.000Z'),
        createdAt: new Date('2026-06-03T18:50:01.000Z'),
      },
    ];
    const listUseCase = {
      execute: jest.fn().mockResolvedValue(events),
    };
    const useCase = new GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase(
      listUseCase as never,
      () => new Date('2026-06-03T19:00:00.000Z'),
    );

    await expect(
      useCase.execute(tenant.slug, orderDraft.productEntityId, orderDraft.id),
    ).resolves.toEqual(
      expect.objectContaining({
        tenantSlug: tenant.slug,
        productEntityId: orderDraft.productEntityId,
        orderDraftId: orderDraft.id,
        generatedAt: new Date('2026-06-03T19:00:00.000Z'),
        reviewStatus: 'blocked',
        latestEvent: events[0],
        blockerSignals: ['capacity_review', 'inventory-reservation-workspace: blocked'],
        driftSignals: ['payment_without_delivery'],
      }),
    );
    expect(listUseCase.execute).toHaveBeenCalledWith(
      tenant.slug,
      orderDraft.productEntityId,
      orderDraft.id,
      { limit: 50 },
    );
  });
});
