import { TenantEcommerceLaunchPlanActivationReadinessView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceLaunchPlanDetailUseCase } from './get-tenant-ecommerce-launch-plan-detail.use-case';

export class RequestTenantEcommerceLaunchPlanActivationReadinessUseCase {
  constructor(
    private readonly getTenantEcommerceLaunchPlanDetailUseCase: GetTenantEcommerceLaunchPlanDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    launchPlanId: string,
  ): Promise<TenantEcommerceLaunchPlanActivationReadinessView> {
    const detail =
      await this.getTenantEcommerceLaunchPlanDetailUseCase.execute(
        tenantSlug,
        launchPlanId,
      );

    if (detail.plan.guardedExecutionReadiness === 'needs_activation') {
      return {
        tenantSlug: detail.tenantSlug,
        generatedAt: this.nowProvider(),
        plan: {
          ...detail.plan,
          selectedChannels: [...detail.plan.selectedChannels],
        },
        activationStatus: 'needs_activation',
        summary:
          'El tenant todavia no tiene Ecommerce activado como carril operativo, asi que este plan solo puede quedarse en rehearsal.',
        requiredActions: [
          'Activar Ecommerce para este tenant antes de abrir un publish pilot.',
          'Confirmar ownership operativo del launch antes de pasar a shadow review.',
        ],
        blockedBy: [
          'El producto Ecommerce sigue inactivo para el tenant actual.',
        ],
        guardrails: [
          'No publicar storefront ni catalogo real mientras el tenant siga sin activation real.',
        ],
      };
    }

    if (detail.plan.guardedExecutionReadiness === 'needs_core_modules') {
      const blockedCoreModules = detail.checklist
        .filter((entry) => entry.isCore && entry.status !== 'ready')
        .map((entry) => entry.label);

      return {
        tenantSlug: detail.tenantSlug,
        generatedAt: this.nowProvider(),
        plan: {
          ...detail.plan,
          selectedChannels: [...detail.plan.selectedChannels],
        },
        activationStatus: 'needs_core_modules',
        summary:
          'El launch plan todavia no tiene base core suficiente para pedir activation readiness del publish pilot.',
        requiredActions: blockedCoreModules.map(
          (entry) => `Habilitar o cerrar el modulo core ${entry}.`,
        ),
        blockedBy:
          blockedCoreModules.length > 0
            ? blockedCoreModules
            : ['Faltan modulos core para el launch inicial.'],
        guardrails: [
          'Mantener este plan solo en suggestion o rehearsal hasta cerrar la base core.',
        ],
      };
    }

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      plan: {
        ...detail.plan,
        selectedChannels: [...detail.plan.selectedChannels],
      },
      activationStatus: 'ready_for_shadow_review',
      summary:
        'El launch plan ya tiene base suficiente para pedir activation readiness del publish pilot en shadow review.',
      requiredActions: [
        'Confirmar owner humano del piloto antes de ejecutar el lane.',
        'Mantener el launch scope estrecho y sin storefront publish real.',
      ],
      blockedBy: [],
      guardrails: [
        'El publish pilot sigue siendo auditado y no publica storefront real.',
        'No ampliar el scope fuera de los canales seleccionados por el plan.',
      ],
    };
  }
}
