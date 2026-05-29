import {
  TenantEcommerceProductEntityChannelAssetPublishPacketView,
  TenantEcommerceProductEntityChannelAssetWorkspaceDetailView,
  TenantEcommerceProductEntityChannelAssetWorkspaceRegistryView,
  TenantEcommerceProductEntityChannelAssetWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceProductEntityChannelAssetWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  promotedAt: string;
  status: 'ready_for_asset_edit' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  headline: string;
  detail: string;
  editableSnapshot: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    publishChecklist: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  };
  guardrails: string[];
  nextActions: string[];
}

export interface EcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalWorkspaces: number;
    readyForAssetEditCount: number;
    needsCoreCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  workspaces: EcommerceProductEntityChannelAssetWorkspaceResponseDto[];
}

export interface EcommerceProductEntityChannelAssetWorkspaceDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  workspace: EcommerceProductEntityChannelAssetWorkspaceResponseDto;
  sourceSavedChannelDraftId: string;
  blockedBy: string[];
}

export interface PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto {
  workspace: EcommerceProductEntityChannelAssetWorkspaceResponseDto;
}

export interface RequestEcommerceProductEntityChannelAssetPublishPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  publishStatus: 'ready_for_staging' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export function toEcommerceProductEntityChannelAssetWorkspaceResponseDto(
  view: TenantEcommerceProductEntityChannelAssetWorkspaceView,
): EcommerceProductEntityChannelAssetWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntityId: view.productEntityId,
    channelKey: view.channelKey,
    promotedAt: view.promotedAt.toISOString(),
    status: view.status,
    handoffOwner: view.handoffOwner,
    headline: view.headline,
    detail: view.detail,
    editableSnapshot: {
      title: view.editableSnapshot.title,
      headline: view.editableSnapshot.headline,
      draftBlueprint: [...view.editableSnapshot.draftBlueprint],
      publishChecklist: [...view.editableSnapshot.publishChecklist],
      recommendedArtifacts: [...view.editableSnapshot.recommendedArtifacts],
      nextMilestone: view.editableSnapshot.nextMilestone,
    },
    guardrails: [...view.guardrails],
    nextActions: [...view.nextActions],
  };
}

export function toEcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto(
  view: TenantEcommerceProductEntityChannelAssetWorkspaceRegistryView,
): EcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    workspaces: view.workspaces.map(
      toEcommerceProductEntityChannelAssetWorkspaceResponseDto,
    ),
  };
}

export function toEcommerceProductEntityChannelAssetWorkspaceDetailResponseDto(
  view: TenantEcommerceProductEntityChannelAssetWorkspaceDetailView,
): EcommerceProductEntityChannelAssetWorkspaceDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    workspace: toEcommerceProductEntityChannelAssetWorkspaceResponseDto(
      view.workspace,
    ),
    sourceSavedChannelDraftId: view.sourceSavedChannelDraftId,
    blockedBy: [...view.blockedBy],
  };
}

export function toPromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto(
  view: TenantEcommerceProductEntityChannelAssetWorkspaceView,
): PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto {
  return {
    workspace: toEcommerceProductEntityChannelAssetWorkspaceResponseDto(view),
  };
}

export function toRequestEcommerceProductEntityChannelAssetPublishPacketResponseDto(
  view: TenantEcommerceProductEntityChannelAssetPublishPacketView,
): RequestEcommerceProductEntityChannelAssetPublishPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    channelKey: view.channelKey,
    publishStatus: view.publishStatus,
    handoffOwner: view.handoffOwner,
    summary: view.summary,
    requiredChecks: [...view.requiredChecks],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}
