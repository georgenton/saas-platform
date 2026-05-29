import { TenantEcommerceStoreSetupWorkspaceView } from '@saas-platform/ecommerce-domain';

export interface EcommerceStoreSetupWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    setupReadiness:
      | 'ready_to_configure'
      | 'needs_activation'
      | 'needs_store_foundation';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  productSnapshot: {
    ecommerceEnabled: boolean;
    invoicingEnabled: boolean;
    enabledProductKeys: string[];
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  capabilities: Array<{
    key:
      | 'store_identity'
      | 'catalog_authoring'
      | 'landing_readiness'
      | 'invoicing_connection'
      | 'whatsapp_sales_flow';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    nextStep: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export function toEcommerceStoreSetupWorkspaceResponseDto(
  view: TenantEcommerceStoreSetupWorkspaceView,
): EcommerceStoreSetupWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: {
      ...view.summary,
    },
    productSnapshot: {
      ...view.productSnapshot,
      enabledProductKeys: [...view.productSnapshot.enabledProductKeys],
    },
    moduleSnapshot: {
      ...view.moduleSnapshot,
      inactiveModuleKeys: [...view.moduleSnapshot.inactiveModuleKeys],
    },
    capabilities: view.capabilities.map((entry) => ({ ...entry })),
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
  };
}
