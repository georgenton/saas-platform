import { TenantEcommerceProductEntityChannelAssetDraftsWorkspaceView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  workspaceStatus:
    | 'ready_to_prepare_drafts'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  drafts: {
    landing: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      sections: string[];
      recommendedOwner: 'ecommerce' | 'growth' | 'shared';
    };
    catalog: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      blocks: string[];
      recommendedOwner: 'ecommerce' | 'growth' | 'shared';
    };
    whatsapp: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      sequence: string[];
      recommendedOwner: 'growth' | 'shared';
    };
  };
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export function toEcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto(
  view: TenantEcommerceProductEntityChannelAssetDraftsWorkspaceView,
): EcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    drafts: {
      landing: {
        status: view.drafts.landing.status,
        headline: view.drafts.landing.headline,
        sections: [...view.drafts.landing.sections],
        recommendedOwner: view.drafts.landing.recommendedOwner,
      },
      catalog: {
        status: view.drafts.catalog.status,
        headline: view.drafts.catalog.headline,
        blocks: [...view.drafts.catalog.blocks],
        recommendedOwner: view.drafts.catalog.recommendedOwner,
      },
      whatsapp: {
        status: view.drafts.whatsapp.status,
        headline: view.drafts.whatsapp.headline,
        sequence: [...view.drafts.whatsapp.sequence],
        recommendedOwner: view.drafts.whatsapp.recommendedOwner,
      },
    },
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}
