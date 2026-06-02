import { TenantEcommerceOrderDraftDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';

export class GetTenantEcommerceOrderDraftDetailUseCase {
  constructor(
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderDraftDetailView | null> {
    const [productEntityDetail, orderDraft] = await Promise.all([
      this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.ecommerceOrderDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        orderDraftId,
      ),
    ]);

    if (
      !productEntityDetail ||
      !orderDraft ||
      orderDraft.productEntityId !== productEntityId
    ) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      orderDraft,
      summary:
        orderDraft.status === 'ready_for_review'
          ? 'El order draft ya tiene suficiente forma para revisión operativa y cierre asistido.'
          : orderDraft.status === 'blocked'
            ? 'El order draft quedó persistido con bloqueos explícitos antes de avanzar al cierre.'
            : orderDraft.status === 'draft'
              ? 'El order draft ya existe como intención comercial persistida, aunque todavía conviene completar buyer profile y handoff.'
              : 'El order draft ya quedó persistido, pero todavía necesita más datos antes de tratarlo como salida operable.',
      nextActions:
        orderDraft.status === 'ready_for_review'
          ? [
              'Solicitar closeout packet antes del handoff final.',
              'Preparar bridge hacia Growth o Invoicing según el canal de cierre.',
            ]
          : [
              'Completar buyer profile y validación fiscal antes del cierre final.',
              'Mantener este draft fuera de publicación, cobro o facturación viva por ahora.',
            ],
      blockedBy: [...orderDraft.blockedBy],
      guardrails: [...orderDraft.guardrails],
    };
  }
}
