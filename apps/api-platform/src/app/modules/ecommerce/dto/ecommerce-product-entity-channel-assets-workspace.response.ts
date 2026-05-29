import { TenantEcommerceProductEntityChannelAssetsWorkspaceView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceProductEntityChannelAssetsWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  workspaceStatus:
    | 'ready_to_draft_assets'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  channels: {
    landing: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
    catalog: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
    whatsapp: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
  };
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export function toEcommerceProductEntityChannelAssetsWorkspaceResponseDto(
  view: TenantEcommerceProductEntityChannelAssetsWorkspaceView,
): EcommerceProductEntityChannelAssetsWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    channels: {
      landing: {
        status: view.channels.landing.status,
        headline: view.channels.landing.headline,
        recommendedAssets: [...view.channels.landing.recommendedAssets],
      },
      catalog: {
        status: view.channels.catalog.status,
        headline: view.channels.catalog.headline,
        recommendedAssets: [...view.channels.catalog.recommendedAssets],
      },
      whatsapp: {
        status: view.channels.whatsapp.status,
        headline: view.channels.whatsapp.headline,
        recommendedAssets: [...view.channels.whatsapp.recommendedAssets],
      },
    },
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}
