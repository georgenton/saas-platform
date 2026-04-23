import { TenantCommercialSnapshot } from '@saas-platform/commercial-application';
import {
  EntitlementResponseDto,
  toEntitlementResponseDto,
} from './entitlement.response';
import {
  SubscriptionResponseDto,
  toSubscriptionResponseDto,
} from './subscription.response';

export interface TenantCommercialSnapshotResponseDto {
  subscription: SubscriptionResponseDto;
  entitlements: EntitlementResponseDto[];
}

export const toTenantCommercialSnapshotResponseDto = (
  snapshot: TenantCommercialSnapshot,
): TenantCommercialSnapshotResponseDto => ({
  subscription: toSubscriptionResponseDto(snapshot.subscription),
  entitlements: snapshot.entitlements.map((entitlement) =>
    toEntitlementResponseDto(entitlement),
  ),
});
