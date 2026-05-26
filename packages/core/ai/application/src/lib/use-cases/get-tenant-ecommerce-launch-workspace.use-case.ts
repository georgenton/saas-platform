import { ListProductModulesUseCase } from '@saas-platform/catalog-application';
import { ListTenantEnabledProductsUseCase } from '@saas-platform/commercial-application';

export interface TenantEcommerceLaunchWorkspaceChecklistItemView {
  key: string;
  label: string;
  isCore: boolean;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
}

export interface TenantEcommerceLaunchWorkspaceChannelGuidanceView {
  key: 'catalog' | 'landing' | 'campaign' | 'operations';
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
  recommendedUse: string;
}

export interface TenantEcommerceLaunchWorkspaceHintView {
  key: string;
  title: string;
  objective: string;
  whenToUse: string;
  recommendedInputs: string[];
  caution: string;
}

export interface TenantEcommerceLaunchWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  checklist: TenantEcommerceLaunchWorkspaceChecklistItemView[];
  channelGuidance: TenantEcommerceLaunchWorkspaceChannelGuidanceView[];
  launchHints: TenantEcommerceLaunchWorkspaceHintView[];
  safeActions: string[];
  blockedActions: string[];
}

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
    modules: Array<{
      key: string;
      name: string;
      isCore: boolean;
      isActive: boolean;
    }>,
    missingCoreModuleKeys: string[],
  ): TenantEcommerceLaunchWorkspaceChecklistItemView[] {
    return modules.map((entry) => {
      if (!ecommerceEnabled) {
        return {
          key: entry.key,
          label: entry.name,
          isCore: entry.isCore,
          status: entry.isCore ? 'blocked' : 'warning',
          detail: entry.isCore
            ? 'Este modulo seria parte del launch base, pero el producto Ecommerce aun no esta habilitado para el tenant.'
            : 'Este modulo puede esperar hasta despues de activar Ecommerce y validar el launch inicial.',
        };
      }

      if (!entry.isActive && entry.isCore) {
        return {
          key: entry.key,
          label: entry.name,
          isCore: true,
          status: 'blocked',
          detail: 'El launch no deberia avanzar mientras este modulo core siga inactivo en el catalogo.',
        };
      }

      if (!entry.isActive) {
        return {
          key: entry.key,
          label: entry.name,
          isCore: false,
          status: 'warning',
          detail: 'Este modulo esta fuera del scope inicial y puede quedar para una fase posterior.',
        };
      }

      return {
        key: entry.key,
        label: entry.name,
        isCore: entry.isCore,
        status:
          entry.isCore && missingCoreModuleKeys.includes(entry.key)
            ? 'blocked'
            : 'ready',
        detail: entry.isCore
          ? 'Disponible para el launch base del tenant.'
          : 'Disponible como expansion opcional del launch.',
      };
    });
  }

  private buildChannelGuidance(
    ecommerceEnabled: boolean,
    activeModuleKeys: Set<string>,
  ): TenantEcommerceLaunchWorkspaceChannelGuidanceView[] {
    return [
      {
        key: 'catalog',
        title: 'Catalog scope',
        status:
          ecommerceEnabled &&
          activeModuleKeys.has('catalog') &&
          activeModuleKeys.has('products')
            ? 'ready'
            : 'blocked',
        detail:
          ecommerceEnabled &&
          activeModuleKeys.has('catalog') &&
          activeModuleKeys.has('products')
            ? 'Ya puedes estructurar un catalogo inicial sin inventar modulos base.'
            : 'No conviene prometer catalogo hasta que Ecommerce y sus modulos base esten listos.',
        recommendedUse:
          'Empieza por un set corto de productos ancla, categorias simples y nomenclatura estable.',
      },
      {
        key: 'landing',
        title: 'Landing scope',
        status: ecommerceEnabled ? 'ready' : 'blocked',
        detail: ecommerceEnabled
          ? 'La landing puede nacer como una pagina compacta orientada a conversion y aprendizaje.'
          : 'La landing deberia esperar a que el producto Ecommerce quede habilitado para el tenant.',
        recommendedUse:
          'Usa una propuesta unica de valor, prueba social concreta y un CTA alineado con checkout real.',
      },
      {
        key: 'campaign',
        title: 'Campaign scope',
        status:
          ecommerceEnabled && activeModuleKeys.has('promotions')
            ? 'ready'
            : ecommerceEnabled
              ? 'warning'
              : 'blocked',
        detail:
          ecommerceEnabled && activeModuleKeys.has('promotions')
            ? 'Ya existe base para pensar una campaña con oferta mas estructurada.'
            : ecommerceEnabled
              ? 'Conviene partir con una campaña simple antes de depender de promociones o mecanicas avanzadas.'
              : 'No abras campaña mientras el carril Ecommerce siga apagado para el tenant.',
        recommendedUse:
          'Prioriza una campaña de validacion con un solo angulo comercial antes de multiplicar canales o promesas.',
      },
      {
        key: 'operations',
        title: 'Operational handoff',
        status:
          ecommerceEnabled &&
          activeModuleKeys.has('orders') &&
          activeModuleKeys.has('checkout')
            ? 'ready'
            : 'blocked',
        detail:
          ecommerceEnabled &&
          activeModuleKeys.has('orders') &&
          activeModuleKeys.has('checkout')
            ? 'Existe base suficiente para conectar el brief con un cierre de venta controlado.'
            : 'Sin orders y checkout activos, el launch se queda en discurso y no en operacion.',
        recommendedUse:
          'Asegura que el CTA y el checkout prometido correspondan a un cierre real y no solo a una idea de campaña.',
      },
    ];
  }

  private buildLaunchHints(
    ecommerceEnabled: boolean,
    inactiveModuleKeys: string[],
  ): TenantEcommerceLaunchWorkspaceHintView[] {
    return [
      {
        key: 'launch-angle',
        title: 'Launch angle',
        objective:
          'Bajar el lanzamiento a una promesa comercial concreta y entendible para un small-business operator.',
        whenToUse:
          ecommerceEnabled
            ? 'Cuando ya hay base para escribir el primer brief comercial.'
            : 'Cuando el equipo necesita preparar el launch antes de activar Ecommerce formalmente.',
        recommendedInputs: [
          'Enabled product list',
          'Active ecommerce modules',
          'Primary conversion goal',
        ],
        caution:
          'No conviertas el angle en promesas de catalogo o promociones que todavia no existen en la superficie deterministica.',
      },
      {
        key: 'catalog-first',
        title: 'Catalog-first sequencing',
        objective:
          'Mantener el launch estrecho: primero catalogo y landing, luego extras operativos o promocionales.',
        whenToUse:
          inactiveModuleKeys.length > 0
            ? 'Especialmente util cuando ecommerce todavia opera sin modulos opcionales activos.'
            : 'Util cuando el equipo quiere evitar sobrecargar el primer release comercial.',
        recommendedInputs: [
          'Module checklist',
          'Core module coverage',
          'Draft landing structure',
        ],
        caution:
          'Si promociones o variantes no estan activas, evita que el brief dependa de bundles, descuentos complejos o catalogos demasiado profundos.',
      },
      {
        key: 'campaign-guardrails',
        title: 'Campaign guardrails',
        objective:
          'Traducir el launch a una primera campaña verificable sin tratar la IA como publicador automatico.',
        whenToUse:
          'Cuando el brief ya necesita una recomendacion de canal, mensaje y CTA para validacion humana.',
        recommendedInputs: [
          'Launch angle',
          'Landing CTA',
          'Operational handoff assumptions',
        ],
        caution:
          'La IA puede sugerir estructura de campaña, pero no debe asumir presupuesto, publicaciones ni activacion real.',
      },
    ];
  }
}
