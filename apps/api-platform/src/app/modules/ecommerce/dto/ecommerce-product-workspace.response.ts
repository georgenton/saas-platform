import {
  TenantEcommerceProductWorkspaceRegistryView,
  TenantEcommerceProductWorkspaceView,
} from '@saas-platform/ecommerce-domain';

export interface EcommerceProductWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  savedDraftId: string;
  promotedAt: string;
  status:
    | 'ready_for_copy_edit'
    | 'needs_commercial_connections'
    | 'needs_activation';
  headline: string;
  detail: string;
  editableSnapshot: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
    channelSequence: string[];
  };
  guardrails: string[];
  nextActions: string[];
}

export interface EcommerceProductWorkspaceRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalProductWorkspaces: number;
    readyForCopyEditCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  workspaces: EcommerceProductWorkspaceResponseDto[];
}

export function toEcommerceProductWorkspaceResponseDto(
  view: TenantEcommerceProductWorkspaceView,
): EcommerceProductWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    savedDraftId: view.savedDraftId,
    promotedAt: view.promotedAt.toISOString(),
    status: view.status,
    headline: view.headline,
    detail: view.detail,
    editableSnapshot: {
      ...view.editableSnapshot,
      suggestedChannels: [...view.editableSnapshot.suggestedChannels],
      channelSequence: [...view.editableSnapshot.channelSequence],
    },
    guardrails: [...view.guardrails],
    nextActions: [...view.nextActions],
  };
}

export function toEcommerceProductWorkspaceRegistryResponseDto(
  view: TenantEcommerceProductWorkspaceRegistryView,
): EcommerceProductWorkspaceRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: {
      ...view.summary,
    },
    workspaces: view.workspaces.map((workspace) =>
      toEcommerceProductWorkspaceResponseDto(workspace),
    ),
  };
}
