import { TenantEcommerceChannelReleaseExecutionReadinessView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase } from './list-tenant-ecommerce-product-entity-channel-release-candidates.use-case';

export class GetTenantEcommerceChannelReleaseExecutionReadinessUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase: ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceChannelReleaseExecutionReadinessView | null> {
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
            releaseStatus: 'missing' as const,
            executionOwner: 'shared' as const,
            executionChecklist: ['Promover release candidate para este canal'],
            launchWindow: 'Pendiente de candidate y QA final',
            blockedBy: ['Todavía no existe release candidate para este canal.'],
          };
        }

        return {
          channelKey,
          releaseStatus: candidate.status,
          executionOwner: candidate.handoffOwner,
          executionChecklist: [...candidate.publishChecklist],
          launchWindow:
            candidate.status === 'candidate_ready'
              ? 'Listo para release controlado con QA final'
              : candidate.status === 'needs_publish_copy'
                ? 'Ajustar copy y artifacts antes de release controlado'
                : 'Resolver bloqueos antes de release controlado',
          blockedBy: [...candidate.blockedBy],
        };
      },
    );

    const missingCount = channels.filter(
      (channel) => channel.releaseStatus === 'missing',
    ).length;
    const blockedCount = channels.filter(
      (channel) => channel.releaseStatus === 'blocked',
    ).length;
    const needsPublishCopyCount = channels.filter(
      (channel) => channel.releaseStatus === 'needs_publish_copy',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      overallStatus:
        blockedCount > 0
          ? 'blocked'
          : missingCount > 0 || needsPublishCopyCount > 0
            ? 'needs_channel_completion'
            : 'ready_for_controlled_release',
      summary:
        blockedCount > 0
          ? 'Todavía hay bloqueos duros antes de tratar este release como salida controlada.'
          : missingCount > 0 || needsPublishCopyCount > 0
            ? 'Todavía conviene cerrar algunos canales antes de abrir release controlado.'
            : 'Los canales ya están en un punto razonable para release controlado con QA final.',
      channels,
      finalChecklist: [
        'Verificar copy final y CTA por canal',
        'Confirmar artifacts mínimos para landing, catálogo y WhatsApp',
        'Mantener el rollout como controlado con owner explícito por canal',
      ],
      blockedBy: channels.flatMap((channel) => channel.blockedBy),
      guardrails: [
        'No tratar este readiness como publicación viva ni go-live automático todavía.',
        'Mantener QA final y handoff explícito por canal antes de cualquier activación real.',
      ],
    };
  }
}
