import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  TenantEcommerceProductEntityChannelAssetEntityDetailView,
  TenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketView,
  TenantEcommerceProductEntityChannelAssetEntityRegistryView,
  TenantEcommerceProductEntityChannelAssetEntityView,
} from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceProductEntityChannelAssetEntityResponseDto {
  tenantSlug: string;
  generatedAt: string;
  assetEntityId: string;
  productEntityId: string;
  sourceSavedChannelDraftId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  promotedAt: string;
  status: 'draft_asset_entity' | 'needs_publish_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  headline: string;
  summary: string;
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelAssetEntityRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalAssetEntities: number;
    draftAssetEntityCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  assetEntities: EcommerceProductEntityChannelAssetEntityResponseDto[];
}

export interface EcommerceProductEntityChannelAssetEntityDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
}

export class UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  headline!: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  draftBlueprint!: string[];

  @IsArray()
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  recommendedArtifacts!: string[];

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  nextMilestone!: string;
}

export interface UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto {
  assetEntity: EcommerceProductEntityChannelAssetEntityDetailResponseDto;
}

export interface RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  preparationStatus:
    | 'ready_for_release_candidate'
    | 'needs_publish_copy'
    | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto {
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
}

export function toEcommerceProductEntityChannelAssetEntityResponseDto(
  view: TenantEcommerceProductEntityChannelAssetEntityView,
): EcommerceProductEntityChannelAssetEntityResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    assetEntityId: view.assetEntityId,
    productEntityId: view.productEntityId,
    sourceSavedChannelDraftId: view.sourceSavedChannelDraftId,
    channelKey: view.channelKey,
    promotedAt: view.promotedAt.toISOString(),
    status: view.status,
    handoffOwner: view.handoffOwner,
    title: view.title,
    headline: view.headline,
    summary: view.summary,
    draftBlueprint: [...view.draftBlueprint],
    publishChecklist: [...view.publishChecklist],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceProductEntityChannelAssetEntityRegistryResponseDto(
  view: TenantEcommerceProductEntityChannelAssetEntityRegistryView,
): EcommerceProductEntityChannelAssetEntityRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    assetEntities: view.assetEntities.map(
      toEcommerceProductEntityChannelAssetEntityResponseDto,
    ),
  };
}

export function toEcommerceProductEntityChannelAssetEntityDetailResponseDto(
  view: TenantEcommerceProductEntityChannelAssetEntityDetailView,
): EcommerceProductEntityChannelAssetEntityDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
  };
}

export function toUpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto(
  view: TenantEcommerceProductEntityChannelAssetEntityDetailView,
): UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto {
  return {
    assetEntity: toEcommerceProductEntityChannelAssetEntityDetailResponseDto(view),
  };
}

export function toRequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto(
  view: TenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketView,
): RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    channelKey: view.channelKey,
    preparationStatus: view.preparationStatus,
    handoffOwner: view.handoffOwner,
    summary: view.summary,
    requiredChecks: [...view.requiredChecks],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toPromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto(
  view: TenantEcommerceProductEntityChannelAssetEntityView,
): PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto {
  return {
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(view),
  };
}
