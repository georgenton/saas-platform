import {
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
      useCase.execute(tenant.slug, orderDraft.productEntityId, orderDraft.id, 5),
    ).resolves.toEqual(events);
    expect(
      ecommerceOrderOperationalEventRepository.listLatestByOrderDraft,
    ).toHaveBeenCalledWith({
      tenantSlug: tenant.slug,
      productEntityId: orderDraft.productEntityId,
      orderDraftId: orderDraft.id,
      limit: 5,
    });
  });
});
