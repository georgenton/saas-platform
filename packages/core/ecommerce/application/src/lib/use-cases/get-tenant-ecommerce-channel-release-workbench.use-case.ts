import { TenantEcommerceChannelReleaseWorkbenchView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase } from './list-tenant-ecommerce-product-entity-channel-release-candidates.use-case';

export class GetTenantEcommerceChannelReleaseWorkbenchUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase: ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceChannelReleaseWorkbenchView | null> {
    const [productEntityDetail, registry] = await Promise.all([
      this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!productEntityDetail || !registry) {
      return null;
    }

    const channels = (['landing', 'catalog', 'whatsapp'] as const).map(
      (channelKey) => {
        const candidate = registry.releaseCandidates.find(
          (entry) => entry.channelKey === channelKey,
        );

        if (!candidate) {
          return {
            channelKey,
            status: 'missing' as const,
            handoffOwner: 'shared' as const,
            title: `${channelKey} candidate pendiente`,
            nextMilestone: 'Promover channel asset entity antes de QA final.',
            blockedBy: ['Todavía no existe release candidate para este canal.'],
          };
        }

        return {
          channelKey,
          status: candidate.status,
          handoffOwner: candidate.handoffOwner,
          title: candidate.title,
          nextMilestone: candidate.nextMilestone,
          blockedBy: [...candidate.blockedBy],
        };
      },
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      summary: {
        totalCandidates: registry.summary.totalCandidates,
        readyCount: registry.summary.readyCount,
        needsPublishCopyCount: registry.summary.needsPublishCopyCount,
        blockedCount: registry.summary.blockedCount,
        headline:
          registry.summary.totalCandidates > 0
            ? 'Ecommerce ya puede revisar release final por canal.'
            : 'Todavía faltan release candidates antes de abrir QA final.',
        detail:
          'Este workbench consolida readiness, huecos y artifacts antes de mover un canal hacia publicación controlada.',
      },
      channels,
      qaChecklist: [
        'Verificar copy final y CTA por canal',
        'Confirmar artifacts mínimos de landing, catálogo y WhatsApp',
        'Mantener rollout como controlado, no como publicación viva automática',
      ],
      finalArtifacts: registry.releaseCandidates.flatMap((candidate) =>
        candidate.recommendedArtifacts.slice(0, 1),
      ),
      guardrails: [
        'No tratar este workbench como publicación viva ni go-live automático todavía.',
        'Mantener approval y QA final por canal antes de cualquier activación real.',
      ],
    };
  }
}
