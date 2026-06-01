import { TenantEcommerceCheckoutOrderIntakeWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogCommercialCardUseCase } from './get-tenant-ecommerce-catalog-commercial-card.use-case';
import { GetTenantEcommerceLandingPublishArtifactUseCase } from './get-tenant-ecommerce-landing-publish-artifact.use-case';
import { GetTenantEcommerceStoreProfileWorkspaceUseCase } from './get-tenant-ecommerce-store-profile-workspace.use-case';
import { RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase } from './request-tenant-ecommerce-whatsapp-growth-launch-acknowledgement-packet.use-case';

export class GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceStoreProfileWorkspaceUseCase: GetTenantEcommerceStoreProfileWorkspaceUseCase,
    private readonly getTenantEcommerceLandingPublishArtifactUseCase: GetTenantEcommerceLandingPublishArtifactUseCase,
    private readonly getTenantEcommerceCatalogCommercialCardUseCase: GetTenantEcommerceCatalogCommercialCardUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase: RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCheckoutOrderIntakeWorkspaceView | null> {
    const [profileWorkspace, landingArtifact, catalogCard, whatsappAcknowledgement] =
      await Promise.all([
        this.getTenantEcommerceStoreProfileWorkspaceUseCase.execute(tenantSlug),
        this.getTenantEcommerceLandingPublishArtifactUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceCatalogCommercialCardUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
      ]);

    if (
      !profileWorkspace ||
      !landingArtifact ||
      !catalogCard ||
      !whatsappAcknowledgement
    ) {
      return null;
    }

    const invoicingConnection =
      profileWorkspace.connections.find((entry) => entry.key === 'invoicing') ??
      null;

    const channelSignals = [
      {
        channelKey: 'landing' as const,
        status:
          landingArtifact.artifactStatus === 'ready_for_release_candidate'
            ? 'ready'
            : landingArtifact.artifactStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: landingArtifact.summary.detail,
      },
      {
        channelKey: 'catalog' as const,
        status:
          catalogCard.commercialStatus === 'ready_for_storefront_card'
            ? 'ready'
            : catalogCard.commercialStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: catalogCard.storefrontSummary,
      },
      {
        channelKey: 'whatsapp' as const,
        status:
          whatsappAcknowledgement.acknowledgementStatus ===
          'ready_for_growth_launch_acknowledgement'
            ? 'ready'
            : whatsappAcknowledgement.acknowledgementStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: whatsappAcknowledgement.summary,
      },
    ] satisfies TenantEcommerceCheckoutOrderIntakeWorkspaceView['channelSignals'];

    const blockedBy = [
      ...(channelSignals
        .filter((entry) => entry.status === 'blocked')
        .map((entry) => `${entry.channelKey} todavía no está listo para intake comercial.`) ??
        []),
      ...(invoicingConnection?.status === 'blocked'
        ? [
            'La conexión con Invoicing todavía no está lista y complica un cierre comercial ordenado.',
          ]
        : []),
    ];

    const checkoutStatus =
      blockedBy.length > 0
        ? 'blocked'
        : channelSignals.every((entry) => entry.status === 'ready') &&
            invoicingConnection?.status === 'ready'
          ? 'ready_for_order_intake'
          : 'needs_storefront_alignment';

    const closingChannel =
      profileWorkspace.identityDraft.primaryChannel === 'whatsapp'
        ? 'whatsapp'
        : landingArtifact.artifactStatus === 'ready_for_release_candidate'
          ? 'landing'
          : 'catalog';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: landingArtifact.productEntity,
      checkoutStatus,
      summary:
        checkoutStatus === 'ready_for_order_intake'
          ? 'La oferta ya tiene suficientes señales de storefront y cierre para abrir un intake de orden asistido.'
          : checkoutStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar este checkout como intake operativo.'
            : 'El intake ya puede bosquejarse, aunque conviene alinear storefront, cierre y facturación antes de usarlo como salida comercial.',
      checkoutDraft: {
        offerTitle: catalogCard.card.title,
        pricingSnapshot: catalogCard.card.pricingPresentation,
        primaryCta: landingArtifact.ctaBand.primaryCta,
        customerPrompt:
          'Pedir nombre, email, canal preferido y confirmación explícita de la oferta antes de cerrar la orden.',
        closingChannel,
      },
      customerFields: [
        'full_name',
        'email',
        'whatsapp_phone',
        'offer_confirmation',
        'billing_intent',
      ],
      channelSignals,
      invoicingConnection: {
        status:
          invoicingConnection?.status === 'ready'
            ? 'ready'
            : invoicingConnection?.status === 'blocked'
              ? 'blocked'
              : 'warning',
        detail:
          invoicingConnection?.detail ??
          'Todavía conviene revisar la conexión comercial con Invoicing.',
        nextStep:
          invoicingConnection?.status === 'ready'
            ? 'Usar el bridge de orden para preparar handoff fiscal.'
            : 'Completar el enlace con Invoicing antes de tratar la orden como cierre final.',
      },
      orderChecklist: [
        'Confirmar oferta, pricing y CTA como una sola narrativa de cierre.',
        'Capturar datos mínimos del comprador antes del handoff comercial.',
        'Validar canal de cierre y expectativa de facturación.',
      ],
      blockedBy,
      guardrails: [
        ...landingArtifact.guardrails.slice(0, 2),
        ...catalogCard.guardrails.slice(0, 1),
        ...whatsappAcknowledgement.guardrails.slice(0, 1),
        'No tratar este workspace como checkout vivo ni cobro automático todavía.',
      ],
    };
  }
}
