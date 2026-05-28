import { ListProductModulesUseCase } from '@saas-platform/catalog-application';
import { ListTenantEnabledProductsUseCase } from '@saas-platform/commercial-application';
import { TenantEcommerceLaunchPlanView, TenantEcommerceLaunchWorkspaceView } from '@saas-platform/ecommerce-domain';

const ECOMMERCE_PRODUCT_KEY = 'ecommerce';
const REQUIRED_CORE_MODULE_KEYS = [
  'catalog',
  'products',
  'inventory',
  'orders',
  'checkout',
] as const;

export class GetTenantEcommerceLaunchWorkspaceUseCase {
  constructor(
    private readonly listTenantEnabledProductsUseCase: ListTenantEnabledProductsUseCase,
    private readonly listProductModulesUseCase: ListProductModulesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceLaunchWorkspaceView> {
    const [enabledProducts, catalogModules] = await Promise.all([
      this.listTenantEnabledProductsUseCase.execute(tenantSlug),
      this.listProductModulesUseCase.execute(ECOMMERCE_PRODUCT_KEY),
    ]);

    const ecommerceEnabled = enabledProducts.some(
      (entry) => entry.key === ECOMMERCE_PRODUCT_KEY,
    );
    const activeModules = catalogModules.filter((entry) => entry.isActive);
    const activeModuleKeys = new Set(activeModules.map((entry) => entry.key));
    const activeCoreModules = activeModules.filter((entry) => entry.toPrimitives().isCore);
    const activeOptionalModules = activeModules.filter(
      (entry) => !entry.toPrimitives().isCore,
    );
    const inactiveModuleKeys = catalogModules
      .filter((entry) => !entry.isActive)
      .map((entry) => entry.key);
    const missingCoreModuleKeys = REQUIRED_CORE_MODULE_KEYS.filter(
      (key) => !activeModuleKeys.has(key),
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(
        ecommerceEnabled,
        missingCoreModuleKeys,
        inactiveModuleKeys,
      ),
      moduleSnapshot: {
        productEnabled: ecommerceEnabled,
        activeModuleCount: activeModules.length,
        coreModuleCount: activeCoreModules.length,
        optionalModuleCount: activeOptionalModules.length,
        inactiveModuleKeys,
      },
      checklist: this.buildChecklist(
        ecommerceEnabled,
        catalogModules.map((entry) => entry.toPrimitives()),
        missingCoreModuleKeys,
      ),
      channelGuidance: this.buildChannelGuidance(
        ecommerceEnabled,
        activeModuleKeys,
      ),
      launchPlans: this.buildLaunchPlans(
        tenantSlug,
        ecommerceEnabled,
        missingCoreModuleKeys,
        inactiveModuleKeys,
      ),
      launchHints: this.buildLaunchHints(ecommerceEnabled, inactiveModuleKeys),
      safeActions: [
        'Resumir el launch scope inicial usando solo productos y modulos activos del catalogo.',
        'Proponer una primera landing simple antes de expandir variantes o promociones.',
        'Sugerir una campaña inicial de validacion sin asumir publicacion automatica.',
        'Explicar que piezas faltan antes de convertir el brief en trabajo real de storefront.',
      ],
      blockedActions: [
        'Publicar catalogo, landing o checkout automaticamente.',
        'Inventar SKUs, precios, stock o descuentos que no existen en la superficie deterministica.',
        'Lanzar campañas reales o cambiar presupuesto fuera de aprobacion humana.',
        'Tratar este brief como reemplazo del dominio ecommerce operativo que todavia no existe.',
      ],
    };
  }

  private buildLaunchPlans(
    tenantSlug: string,
    ecommerceEnabled: boolean,
    missingCoreModuleKeys: string[],
    inactiveModuleKeys: string[],
  ): TenantEcommerceLaunchPlanView[] {
    if (!ecommerceEnabled) {
      return [
        {
          id: `${tenantSlug}:launch-plan:initial`,
          title: 'Initial ecommerce launch plan',
          status: 'blocked',
          guardedExecutionReadiness: 'needs_activation',
          scopeSummary:
            'El tenant todavia no tiene Ecommerce activo, asi que este plan solo sirve para preparar el brief inicial.',
          selectedChannels: ['catalog', 'landing', 'campaign'],
          nextStep:
            'Activa Ecommerce para convertir este launch brief en un lane operativo con ownership real.',
        },
      ];
    }

    if (missingCoreModuleKeys.length > 0) {
      return [
        {
          id: `${tenantSlug}:launch-plan:initial`,
          title: 'Initial ecommerce launch plan',
          status: 'blocked',
          guardedExecutionReadiness: 'needs_core_modules',
          scopeSummary: `Todavia faltan modulos core antes de publicar un launch estrecho: ${missingCoreModuleKeys.join(', ')}.`,
          selectedChannels: ['catalog', 'landing', 'campaign'],
          nextStep:
            'Completa primero los modulos core y usa este plan solo como rehearsal de shadow review.',
        },
      ];
    }

    return [
      {
        id: `${tenantSlug}:launch-plan:initial`,
        title: 'Initial ecommerce launch plan',
        status: inactiveModuleKeys.length > 0 ? 'warning' : 'ready',
        guardedExecutionReadiness: 'shadow_review_ready',
        scopeSummary:
          inactiveModuleKeys.length > 0
            ? `El launch puede avanzar con alcance estrecho mientras dejas fuera modulos no activos: ${inactiveModuleKeys.join(', ')}.`
            : 'El tenant ya tiene base suficiente para llevar este plan por shadow review antes de abrir publish real.',
        selectedChannels: ['catalog', 'landing', 'campaign'],
        nextStep:
          'Usa este plan como target de approval y shadow review mientras el publish real sigue bloqueado.',
      },
    ];
  }

  private buildSummary(
    ecommerceEnabled: boolean,
    missingCoreModuleKeys: string[],
    inactiveModuleKeys: string[],
  ): TenantEcommerceLaunchWorkspaceView['summary'] {
    if (!ecommerceEnabled) {
      return {
        tone: 'critical',
        launchReadiness: 'needs_activation',
        headline:
          'El tenant todavia no tiene Ecommerce habilitado como carril real de lanzamiento.',
        detail:
          'La IA ya puede ayudarte a preparar el brief, pero primero conviene activar el producto para que el launch tenga ownership claro.',
        suggestedFocus:
          'Habilita ecommerce y confirma el scope inicial antes de redactar landing o campaña.',
      };
    }

    if (missingCoreModuleKeys.length > 0) {
      return {
        tone: 'warning',
        launchReadiness: 'needs_core_modules',
        headline:
          'El producto Ecommerce esta habilitado, pero la base core del lanzamiento no esta completa.',
        detail:
          'Conviene cerrar las piezas base del catalogo y checkout antes de convertir este brief en trabajo operativo.',
        suggestedFocus: `Completa primero los modulos core faltantes: ${missingCoreModuleKeys.join(', ')}.`,
      };
    }

    if (inactiveModuleKeys.length > 0) {
      return {
        tone: 'warning',
        launchReadiness: 'launch_ready',
        headline:
          'Ya existe una base suficiente para un launch inicial, aunque todavia conviene empezar con un alcance estrecho.',
        detail:
          'La superficie actual favorece un catalogo simple, una landing compacta y una campaña controlada antes de abrir extras.',
        suggestedFocus: `Empieza por un launch simple y deja para despues los modulos no activos: ${inactiveModuleKeys.join(', ')}.`,
      };
    }

    return {
      tone: 'healthy',
      launchReadiness: 'launch_ready',
      headline:
        'La base de Ecommerce ya permite preparar un launch brief guiado sin inventar estructura.',
      detail:
        'La IA todavia no publica nada, pero ya puede ayudar a ordenar catalogo, landing y campaña con un scope razonablemente claro.',
      suggestedFocus:
        'Construye primero una propuesta de catalogo y landing, y luego baja la primera campaña de validacion.',
    };
  }

  private buildChecklist(
    ecommerceEnabled: boolean,
    catalogModules: Array<{
      key: string;
      name: string;
      isCore: boolean;
      isActive: boolean;
    }>,
    missingCoreModuleKeys: string[],
  ): TenantEcommerceLaunchWorkspaceView['checklist'] {
    return catalogModules.map((entry) => ({
      key: entry.key,
      label: entry.name,
      isCore: entry.isCore,
      status: !ecommerceEnabled
        ? 'blocked'
        : entry.isActive
          ? 'ready'
          : entry.isCore
            ? 'blocked'
            : 'warning',
      detail: !ecommerceEnabled
        ? 'Este modulo todavia no tiene un producto Ecommerce habilitado en el tenant.'
        : entry.isActive
          ? 'Disponible para el launch base del tenant.'
          : entry.isCore
            ? `Hace falta habilitar este modulo core antes de abrir un launch operativo: ${missingCoreModuleKeys.join(', ')}.`
            : 'Este modulo esta fuera del scope inicial y puede quedar para una fase posterior.',
    }));
  }

  private buildChannelGuidance(
    ecommerceEnabled: boolean,
    activeModuleKeys: Set<string>,
  ): TenantEcommerceLaunchWorkspaceView['channelGuidance'] {
    return [
      {
        key: 'catalog',
        title: 'Catalog scope',
        status:
          ecommerceEnabled && activeModuleKeys.has('catalog') ? 'ready' : 'blocked',
        detail: ecommerceEnabled
          ? 'Ya puedes estructurar un catalogo inicial sin inventar modulos base.'
          : 'Sin Ecommerce activo, catalogo sigue solo como planning surface.',
        recommendedUse:
          'Empieza por un set corto de productos ancla, categorias simples y nomenclatura estable.',
      },
      {
        key: 'landing',
        title: 'Landing scope',
        status:
          ecommerceEnabled && activeModuleKeys.has('checkout') ? 'ready' : 'warning',
        detail:
          ecommerceEnabled && activeModuleKeys.has('checkout')
            ? 'La landing puede enfocarse en conversion simple y checkout claro.'
            : 'La landing se puede bosquejar, pero conviene no prometer flujos finales todavia.',
        recommendedUse:
          'Diseña una landing corta con una sola promesa comercial y CTA claro.',
      },
      {
        key: 'campaign',
        title: 'Campaign scope',
        status:
          ecommerceEnabled && activeModuleKeys.has('orders') ? 'warning' : 'blocked',
        detail:
          ecommerceEnabled && activeModuleKeys.has('orders')
            ? 'Conviene partir con una campaña simple antes de depender de promociones o mecanicas avanzadas.'
            : 'La campaña todavia deberia quedarse en planning hasta que exista la base operativa.',
        recommendedUse:
          'Prioriza una campaña de validacion con un solo angulo comercial antes de multiplicar canales o promesas.',
      },
      {
        key: 'operations',
        title: 'Operational handoff',
        status: ecommerceEnabled ? 'warning' : 'blocked',
        detail:
          ecommerceEnabled
            ? 'El handoff ya puede bajar un brief operativo, pero la publicacion real sigue fuera del lane automatizado.'
            : 'Sin Ecommerce activo no conviene tratar este brief como handoff operacional.',
        recommendedUse:
          'Entrega un brief estrecho, con responsables claros y sin asumir publicacion automatica.',
      },
    ];
  }

  private buildLaunchHints(
    ecommerceEnabled: boolean,
    inactiveModuleKeys: string[],
  ): TenantEcommerceLaunchWorkspaceView['launchHints'] {
    return [
      {
        key: 'launch-angle',
        title: 'Launch angle',
        objective:
          'Bajar el lanzamiento a una promesa comercial concreta y entendible para un small-business operator.',
        whenToUse:
          'Cuando ya hay base para escribir el primer brief comercial.',
        recommendedInputs: [
          'Enabled product list',
          'Active ecommerce modules',
          'Primary conversion goal',
        ],
        caution:
          'No conviertas el angle en promesas de catalogo o promociones que todavia no existen en la superficie deterministica.',
      },
      {
        key: 'launch-scope',
        title: 'Scope discipline',
        objective:
          'Mantener el primer launch dentro de un alcance estrecho antes de sumar extras o automatizaciones.',
        whenToUse:
          ecommerceEnabled
            ? 'Cuando el tenant ya tiene Ecommerce activo y toca decidir que queda fuera del primer release.'
            : 'Cuando todavia toca preparar el brief antes de activar el producto.',
        recommendedInputs: [
          'Inactive module list',
          'Core module coverage',
          'Desired launch window',
        ],
        caution:
          inactiveModuleKeys.length > 0
            ? `Deja explicitamente fuera los modulos inactivos (${inactiveModuleKeys.join(', ')}) para que el plan no se desborde.`
            : 'Aunque no falten modulos, evita saltar directo a una experiencia demasiado amplia para el primer corte.',
      },
    ];
  }
}
