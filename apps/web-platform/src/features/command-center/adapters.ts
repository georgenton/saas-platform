import {
  COMMAND_CENTER_PRODUCTS,
  planSatisfiesRequirement,
  productIsInSet,
  type CommandCenterAccessState,
  type CommandCenterProduct,
  type CommandCenterProductDefinition,
} from './model';

export type CommandCenterAccessCounts = Record<CommandCenterAccessState, number>;

export type CommandCenterModel = {
  accessCounts: CommandCenterAccessCounts;
  products: CommandCenterProduct[];
};

type CommandCenterCatalogProduct = {
  isActive: boolean;
  key: string;
};

type CommandCenterPlan = {
  id?: string | null;
  name?: string | null;
} | null;

export type CreateCommandCenterModelInput = {
  ai: {
    approvalRequestCount: number;
    memoryAgentCount: number;
    operationsGeneratedAt: string | null;
    operationsSummaryLoaded: boolean;
  };
  aiEnabled: boolean | null;
  canAccessTransversalAiConsole: boolean;
  canReadGrowthConversations: boolean;
  currentPlan: CommandCenterPlan;
  ecommerce: {
    completionCloseoutStatus: string | null;
    hasInvoiceDraftHandoff: boolean;
    postSaleReportingStatus: string | null;
  };
  enabledProductKeys: Set<string>;
  formatDate: (value: string | null) => string;
  growth: {
    operationalAlertCount: number | null;
    openCaseCount: number;
    whatsappSummaryLoaded: boolean;
  };
  humanizeKey: (value: string | null) => string;
  invoicing: {
    electronicSubmissionSettingsLoaded: boolean;
    invoiceCount: number;
    issuedInvoiceCount: number;
    issuerEnvironment: string | null;
    issuerProfileLoaded: boolean;
    selectedInvoice: {
      issuedAt: string | null;
      number: string;
      status: string;
    } | null;
  };
  permissionKeys: string[];
  productCatalog: CommandCenterCatalogProduct[];
  taxCompliance: {
    accountantReviewCount: number;
    eventCount: number;
    period: string;
    workspaceStatus: string | null;
  };
};

export function createCommandCenterModel(
  input: CreateCommandCenterModelInput,
): CommandCenterModel {
  const permissionKeys = new Set(input.permissionKeys);
  const productCatalogKeys = new Set(
    input.productCatalog.map((product) => product.key),
  );
  const activeCatalogKeys = new Set(
    input.productCatalog
      .filter((product) => product.isActive)
      .map((product) => product.key),
  );

  const resolveAccessState = (
    product: CommandCenterProductDefinition,
  ): CommandCenterAccessState => {
    const isEnabled = productIsInSet(product, input.enabledProductKeys);
    const existsInCatalog =
      productCatalogKeys.size === 0 || productIsInSet(product, productCatalogKeys);
    const isCatalogActive =
      activeCatalogKeys.size === 0 || productIsInSet(product, activeCatalogKeys);

    if (product.key === 'ai-console' && input.aiEnabled) {
      return input.canAccessTransversalAiConsole
        ? 'enabled'
        : 'permission_limited';
    }

    if (isEnabled) {
      if (product.requiredPermission && !permissionKeys.has(product.requiredPermission)) {
        return 'permission_limited';
      }

      return 'enabled';
    }

    if (!existsInCatalog || !isCatalogActive) {
      return 'disabled';
    }

    if (!planSatisfiesRequirement(input.currentPlan, product.requiresPlan)) {
      return 'blocked_by_plan';
    }

    return product.addonPrice ? 'available' : 'disabled';
  };

  const buildReadiness = (
    product: CommandCenterProductDefinition,
    accessState: CommandCenterAccessState,
  ): CommandCenterProduct['readiness'] => {
    if (!['enabled', 'permission_limited'].includes(accessState)) {
      return [];
    }

    switch (product.key) {
      case 'invoicing':
        return [
          {
            label: 'Emisor',
            value: input.invoicing.issuerProfileLoaded
              ? 'Configurado'
              : 'Pendiente',
            tone: input.invoicing.issuerProfileLoaded ? 'success' : 'warning',
          },
          {
            label: 'Modo SRI',
            value: input.invoicing.issuerEnvironment
              ? input.humanizeKey(input.invoicing.issuerEnvironment)
              : input.invoicing.electronicSubmissionSettingsLoaded
                ? 'Configurado'
                : 'Sin cargar',
            tone:
              input.invoicing.issuerEnvironment === 'production'
                ? 'success'
                : input.invoicing.electronicSubmissionSettingsLoaded
                  ? 'neutral'
                  : 'warning',
          },
          {
            label: 'Facturas',
            value: `${input.invoicing.issuedInvoiceCount}/${input.invoicing.invoiceCount} emitidas`,
            tone: input.invoicing.invoiceCount > 0 ? 'success' : 'neutral',
          },
        ];
      case 'tax-compliance-ec':
        return [
          {
            label: 'Periodo',
            value: input.taxCompliance.period,
            tone: 'neutral',
          },
          {
            label: 'Eventos',
            value: `${input.taxCompliance.eventCount}`,
            tone: input.taxCompliance.eventCount > 0 ? 'success' : 'warning',
          },
          {
            label: 'Revision contador',
            value: `${input.taxCompliance.accountantReviewCount}`,
            tone:
              input.taxCompliance.accountantReviewCount > 0
                ? 'success'
                : 'warning',
          },
        ];
      case 'growth':
        return [
          {
            label: 'WhatsApp',
            value: input.growth.whatsappSummaryLoaded ? 'Monitoreado' : 'Sin cargar',
            tone: input.growth.whatsappSummaryLoaded ? 'success' : 'neutral',
          },
          {
            label: 'Alertas',
            value: `${input.growth.operationalAlertCount ?? 0}`,
            tone:
              (input.growth.operationalAlertCount ?? 0) > 0
                ? 'warning'
                : 'success',
          },
          {
            label: 'Casos abiertos',
            value: `${input.growth.openCaseCount}`,
            tone: input.growth.openCaseCount > 0 ? 'warning' : 'neutral',
          },
        ];
      case 'ecommerce':
        return [
          {
            label: 'Tienda',
            value: input.ecommerce.completionCloseoutStatus
              ? input.humanizeKey(input.ecommerce.completionCloseoutStatus)
              : 'Sin cargar',
            tone: input.ecommerce.completionCloseoutStatus ? 'success' : 'neutral',
          },
          {
            label: 'Post-venta',
            value: input.ecommerce.postSaleReportingStatus
              ? input.humanizeKey(input.ecommerce.postSaleReportingStatus)
              : 'Sin cargar',
            tone: input.ecommerce.postSaleReportingStatus ? 'success' : 'neutral',
          },
          {
            label: 'Handoff',
            value: input.ecommerce.hasInvoiceDraftHandoff ? 'Activo' : 'Pendiente',
            tone: input.ecommerce.hasInvoiceDraftHandoff ? 'success' : 'warning',
          },
        ];
      case 'ai-console':
        return [
          {
            label: 'Aprobaciones',
            value: `${input.ai.approvalRequestCount}`,
            tone: input.ai.approvalRequestCount > 0 ? 'warning' : 'neutral',
          },
          {
            label: 'Guarded execution',
            value: input.ai.operationsSummaryLoaded ? 'Activo' : 'Sin cargar',
            tone: input.ai.operationsSummaryLoaded ? 'success' : 'neutral',
          },
          {
            label: 'Asistente',
            value: input.ai.memoryAgentCount > 0 ? 'Listo' : 'Pendiente',
            tone: input.ai.memoryAgentCount > 0 ? 'success' : 'neutral',
          },
        ];
      default:
        return [];
    }
  };

  const buildEvidence = (
    product: CommandCenterProductDefinition,
    accessState: CommandCenterAccessState,
  ): CommandCenterProduct['evidence'] => {
    if (!['enabled', 'permission_limited'].includes(accessState)) {
      return null;
    }

    switch (product.key) {
      case 'invoicing':
        return input.invoicing.selectedInvoice
          ? {
              label: `Factura ${input.invoicing.selectedInvoice.number}`,
              source: input.humanizeKey(input.invoicing.selectedInvoice.status),
              when: input.formatDate(input.invoicing.selectedInvoice.issuedAt),
            }
          : {
              label: 'Resumen de facturacion disponible',
              source: `${input.invoicing.invoiceCount} documentos`,
              when: 'Workspace actual',
            };
      case 'tax-compliance-ec':
        return {
          label: `${input.taxCompliance.eventCount} eventos tributarios`,
          source: `Periodo ${input.taxCompliance.period}`,
          when: input.taxCompliance.workspaceStatus
            ? input.humanizeKey(input.taxCompliance.workspaceStatus)
            : 'Sin cargar',
        };
      case 'growth':
        return {
          label:
            input.growth.operationalAlertCount !== null
              ? `${input.growth.operationalAlertCount} alertas operativas`
              : 'Workbench de conversaciones',
          source: input.canReadGrowthConversations
            ? 'Growth habilitado'
            : 'Solo lectura',
          when: input.growth.whatsappSummaryLoaded ? 'Monitor activo' : 'Sin cargar',
        };
      case 'ecommerce':
        return {
          label: input.ecommerce.postSaleReportingStatus
            ? input.humanizeKey(input.ecommerce.postSaleReportingStatus)
            : 'Post-venta y handoff listos para operar',
          source: 'Ecommerce operational chain',
          when: input.ecommerce.postSaleReportingStatus
            ? 'Reporting cargado'
            : 'Sin cargar',
        };
      case 'ai-console':
        return {
          label: `${input.ai.approvalRequestCount} aprobaciones en memoria`,
          source: 'AI suggestion-first',
          when: input.ai.operationsGeneratedAt
            ? input.formatDate(input.ai.operationsGeneratedAt)
            : 'Sin cargar',
        };
      default:
        return null;
    }
  };

  const products = COMMAND_CENTER_PRODUCTS.map((product) => {
    const accessState = resolveAccessState(product);
    const requiresPermission =
      product.requiredPermission && !permissionKeys.has(product.requiredPermission);
    const blocker =
      accessState === 'permission_limited'
        ? `Solo lectura: necesitas el permiso ${product.requiredPermission}.`
        : accessState === 'blocked_by_plan'
          ? `Incluido en el plan ${product.requiresPlan}. Tu plan actual es ${
              input.currentPlan?.name ?? 'sin plan'
            }.`
          : accessState === 'available'
            ? `Disponible como add-on${product.addonPrice ? ` (${product.addonPrice})` : ''}.`
            : accessState === 'disabled'
              ? 'No habilitado para este workspace; visible como modulo futuro.'
              : requiresPermission
                ? `Permiso requerido: ${product.requiredPermission}.`
                : null;
    const primaryAction =
      accessState === 'enabled'
        ? 'Entrar'
        : accessState === 'permission_limited'
          ? 'Entrar en solo lectura'
          : accessState === 'blocked_by_plan'
            ? 'Ver plan Scale'
            : accessState === 'available'
              ? 'Activar add-on'
              : 'Ver en Marketplace';

    return {
      ...product,
      accessState,
      readiness: buildReadiness(product, accessState),
      evidence: buildEvidence(product, accessState),
      blocker,
      primaryAction,
      secondaryAction:
        accessState === 'permission_limited'
          ? 'Solicitar permiso'
          : accessState === 'enabled'
            ? 'Ver evidencia'
            : null,
    };
  });

  return {
    accessCounts: countCommandCenterAccessStates(products),
    products,
  };
}

function countCommandCenterAccessStates(
  products: CommandCenterProduct[],
): CommandCenterAccessCounts {
  return products.reduce(
    (counts, product) => {
      counts[product.accessState] += 1;

      return counts;
    },
    {
      enabled: 0,
      permission_limited: 0,
      blocked_by_plan: 0,
      available: 0,
      disabled: 0,
    } satisfies CommandCenterAccessCounts,
  );
}
