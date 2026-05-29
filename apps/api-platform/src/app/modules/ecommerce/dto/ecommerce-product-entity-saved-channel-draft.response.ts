import {
  TenantEcommerceSavedProductEntityChannelDraftDetailView,
  TenantEcommerceSavedProductEntityChannelDraftRegistryView,
  TenantEcommerceSavedProductEntityChannelDraftSaveView,
  TenantEcommerceSavedProductEntityChannelDraftView,
} from '@saas-platform/ecommerce-domain';
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceSavedProductEntityChannelDraftResponseDto {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  status: 'saved_channel_draft';
  preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  summary: string;
  headline: string;
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EcommerceSavedProductEntityChannelDraftRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalSavedDrafts: number;
    readyToStageCount: number;
    needsCoreCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  drafts: EcommerceSavedProductEntityChannelDraftResponseDto[];
}

export interface SaveEcommerceProductEntityChannelDraftResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: string;
  savedChannelDraft: EcommerceSavedProductEntityChannelDraftResponseDto;
}

export interface EcommerceSavedProductEntityChannelDraftDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  savedChannelDraft: EcommerceSavedProductEntityChannelDraftResponseDto;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export class UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotRequestDto {
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

export interface UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto {
  savedChannelDraft: EcommerceSavedProductEntityChannelDraftDetailResponseDto;
}

export function toEcommerceSavedProductEntityChannelDraftResponseDto(
  view: TenantEcommerceSavedProductEntityChannelDraftView,
): EcommerceSavedProductEntityChannelDraftResponseDto {
  return {
    id: view.id,
    tenantId: view.tenantId,
    tenantSlug: view.tenantSlug,
    productEntityId: view.productEntityId,
    channelKey: view.channelKey,
    status: view.status,
    preparationStatus: view.preparationStatus,
    handoffOwner: view.handoffOwner,
    title: view.title,
    summary: view.summary,
    headline: view.headline,
    draftBlueprint: [...view.draftBlueprint],
    publishChecklist: [...view.publishChecklist],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceSavedProductEntityChannelDraftRegistryResponseDto(
  view: TenantEcommerceSavedProductEntityChannelDraftRegistryView,
): EcommerceSavedProductEntityChannelDraftRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    drafts: view.drafts.map(toEcommerceSavedProductEntityChannelDraftResponseDto),
  };
}

export function toSaveEcommerceProductEntityChannelDraftResponseDto(
  view: TenantEcommerceSavedProductEntityChannelDraftSaveView,
): SaveEcommerceProductEntityChannelDraftResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: view.summary,
    savedChannelDraft: toEcommerceSavedProductEntityChannelDraftResponseDto(
      view.savedChannelDraft,
    ),
  };
}

export function toEcommerceSavedProductEntityChannelDraftDetailResponseDto(
  view: TenantEcommerceSavedProductEntityChannelDraftDetailView,
): EcommerceSavedProductEntityChannelDraftDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    savedChannelDraft: toEcommerceSavedProductEntityChannelDraftResponseDto(
      view.savedChannelDraft,
    ),
    summary: view.summary,
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toUpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto(
  view: TenantEcommerceSavedProductEntityChannelDraftDetailView,
): UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto {
  return {
    savedChannelDraft:
      toEcommerceSavedProductEntityChannelDraftDetailResponseDto(view),
  };
}
