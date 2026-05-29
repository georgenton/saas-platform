import {
  TenantEcommerceProductEntityChannelDraftActionPacketView,
  TenantEcommerceProductEntityChannelDraftDetailView,
  TenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceView,
  TenantEcommerceProductEntityChannelDraftPublishReadinessPacketView,
} from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceProductEntityChannelDraftDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  draftStatus: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
  summary: string;
  headline: string;
  recommendedOwner: 'ecommerce' | 'growth' | 'shared';
  structure: string[];
  requiredInputs: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface RequestEcommerceProductEntityChannelDraftActionPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  actionStatus: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
  summary: string;
  requiredInputs: string[];
  recommendedArtifacts: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  readinessStatus:
    | 'ready_for_publish_preparation'
    | 'needs_core_copy'
    | 'blocked';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
  summary: string;
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export function toEcommerceProductEntityChannelDraftDetailResponseDto(
  view: TenantEcommerceProductEntityChannelDraftDetailView,
): EcommerceProductEntityChannelDraftDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    channelKey: view.channelKey,
    draftStatus: view.draftStatus,
    summary: view.summary,
    headline: view.headline,
    recommendedOwner: view.recommendedOwner,
    structure: [...view.structure],
    requiredInputs: [...view.requiredInputs],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toRequestEcommerceProductEntityChannelDraftActionPacketResponseDto(
  view: TenantEcommerceProductEntityChannelDraftActionPacketView,
): RequestEcommerceProductEntityChannelDraftActionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    channelKey: view.channelKey,
    actionStatus: view.actionStatus,
    summary: view.summary,
    requiredInputs: [...view.requiredInputs],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toRequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto(
  view: TenantEcommerceProductEntityChannelDraftPublishReadinessPacketView,
): RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    channelKey: view.channelKey,
    readinessStatus: view.readinessStatus,
    summary: view.summary,
    requiredChecks: [...view.requiredChecks],
    recommendedArtifacts: [...view.recommendedArtifacts],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto(
  view: TenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceView,
): EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    channelKey: view.channelKey,
    preparationStatus: view.preparationStatus,
    summary: view.summary,
    handoffOwner: view.handoffOwner,
    draftBlueprint: [...view.draftBlueprint],
    publishChecklist: [...view.publishChecklist],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}
