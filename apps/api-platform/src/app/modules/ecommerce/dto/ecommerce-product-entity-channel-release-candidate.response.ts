import {
  TenantEcommerceProductEntityChannelReleaseCandidateDetailView,
  TenantEcommerceProductEntityChannelReleaseCandidateRegistryView,
  TenantEcommerceProductEntityChannelReleaseCandidateView,
} from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceProductEntityChannelReleaseCandidateResponseDto {
  tenantSlug: string;
  generatedAt: string;
  releaseCandidateId: string;
  productEntityId: string;
  sourceAssetEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  promotedAt: string;
  status: 'candidate_ready' | 'needs_publish_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  headline: string;
  summary: string;
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceProductEntityChannelReleaseCandidateRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalCandidates: number;
    readyCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  releaseCandidates: EcommerceProductEntityChannelReleaseCandidateResponseDto[];
}

export interface EcommerceProductEntityChannelReleaseCandidateDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  releaseCandidate: EcommerceProductEntityChannelReleaseCandidateResponseDto;
}

export interface PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto {
  releaseCandidate: EcommerceProductEntityChannelReleaseCandidateResponseDto;
}

export function toEcommerceProductEntityChannelReleaseCandidateResponseDto(
  view: TenantEcommerceProductEntityChannelReleaseCandidateView,
): EcommerceProductEntityChannelReleaseCandidateResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    releaseCandidateId: view.releaseCandidateId,
    productEntityId: view.productEntityId,
    sourceAssetEntityId: view.sourceAssetEntityId,
    channelKey: view.channelKey,
    promotedAt: view.promotedAt.toISOString(),
    status: view.status,
    handoffOwner: view.handoffOwner,
    title: view.title,
    headline: view.headline,
    summary: view.summary,
    publishChecklist: [...view.publishChecklist],
    recommendedArtifacts: [...view.recommendedArtifacts],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceProductEntityChannelReleaseCandidateRegistryResponseDto(
  view: TenantEcommerceProductEntityChannelReleaseCandidateRegistryView,
): EcommerceProductEntityChannelReleaseCandidateRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    releaseCandidates: view.releaseCandidates.map(
      toEcommerceProductEntityChannelReleaseCandidateResponseDto,
    ),
  };
}

export function toEcommerceProductEntityChannelReleaseCandidateDetailResponseDto(
  view: TenantEcommerceProductEntityChannelReleaseCandidateDetailView,
): EcommerceProductEntityChannelReleaseCandidateDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    releaseCandidate:
      toEcommerceProductEntityChannelReleaseCandidateResponseDto(
        view.releaseCandidate,
      ),
  };
}

export function toPromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto(
  view: TenantEcommerceProductEntityChannelReleaseCandidateView,
): PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto {
  return {
    releaseCandidate:
      toEcommerceProductEntityChannelReleaseCandidateResponseDto(view),
  };
}
