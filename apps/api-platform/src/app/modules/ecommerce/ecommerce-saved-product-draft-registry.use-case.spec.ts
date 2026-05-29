import { ListTenantEcommerceSavedProductDraftsUseCase } from '@saas-platform/ecommerce-application';

describe('Ecommerce saved product draft registry use case', () => {
  it('returns a tenant-scoped registry of saved catalog candidates', async () => {
    const ecommerceProductDraftRepository = {
      listByTenantSlug: jest.fn().mockResolvedValue([
        {
          id: 'saved_draft_001',
          tenantId: 'tenant_123',
          tenantSlug: 'saas-platform',
          sourceDraftId: 'saas-platform:draft:core-offer',
          title: 'SaaS Platform Store flagship offer',
          productType: 'core_offer',
          status: 'saved_draft',
          rationale: 'Anchor offer.',
          suggestedChannels: ['catalog', 'landing'],
          briefingStatus: 'needs_commercial_connections',
          briefSummary: 'Brief pending commercial closure.',
          briefRequiredInputs: ['Pricing'],
          briefGuardrails: ['No auto publish.'],
          refinementStatus: 'needs_commercial_connections',
          refinementSummary: 'Refinement pending commercial closure.',
          pricingBand: 'Mid-ticket anchor band',
          offerAngle: 'Primary promise',
          primaryCta: 'Explorar oferta principal',
          channelSequence: ['Catalog anchor', 'Landing conversion step'],
          refinementGuardrails: ['No final pricing yet.'],
          createdAt: new Date('2026-05-28T15:20:00.000Z'),
          updatedAt: new Date('2026-05-28T15:20:00.000Z'),
        },
      ]),
    };

    const useCase = new ListTenantEcommerceSavedProductDraftsUseCase(
      ecommerceProductDraftRepository as never,
      () => new Date('2026-05-28T15:30:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T15:30:00.000Z'),
      summary: {
        totalSavedDrafts: 1,
        readyForRefinementCount: 0,
        needsCommercialConnectionsCount: 1,
        needsActivationCount: 0,
        headline:
          'Ya existe un registro persistido de catalog candidates para esta tienda.',
        detail:
          'Usa este registro para retomar drafts refinados sin depender solo del starter set efimero.',
      },
      drafts: [
        {
          id: 'saved_draft_001',
          tenantId: 'tenant_123',
          tenantSlug: 'saas-platform',
          sourceDraftId: 'saas-platform:draft:core-offer',
          title: 'SaaS Platform Store flagship offer',
          productType: 'core_offer',
          status: 'saved_draft',
          rationale: 'Anchor offer.',
          suggestedChannels: ['catalog', 'landing'],
          briefingStatus: 'needs_commercial_connections',
          briefSummary: 'Brief pending commercial closure.',
          briefRequiredInputs: ['Pricing'],
          briefGuardrails: ['No auto publish.'],
          refinementStatus: 'needs_commercial_connections',
          refinementSummary: 'Refinement pending commercial closure.',
          pricingBand: 'Mid-ticket anchor band',
          offerAngle: 'Primary promise',
          primaryCta: 'Explorar oferta principal',
          channelSequence: ['Catalog anchor', 'Landing conversion step'],
          refinementGuardrails: ['No final pricing yet.'],
          createdAt: new Date('2026-05-28T15:20:00.000Z'),
          updatedAt: new Date('2026-05-28T15:20:00.000Z'),
        },
      ],
    });
  });
});
