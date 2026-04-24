import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ChangeTenantPlanUseCase,
  GetTenantSubscriptionUseCase,
  ListTenantEnabledProductsUseCase,
  ListTenantEntitlementsUseCase,
  PlanNotFoundError,
  SubscriptionNotFoundError,
} from '@saas-platform/commercial-application';
import {
  TENANT_PERMISSIONS,
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  EnabledProductResponseDto,
  toEnabledProductResponseDto,
} from './dto/enabled-product.response';
import {
  EntitlementResponseDto,
  toEntitlementResponseDto,
} from './dto/entitlement.response';
import { SetTenantSubscriptionRequestDto } from './dto/set-tenant-subscription.request';
import {
  SubscriptionResponseDto,
  toSubscriptionResponseDto,
} from './dto/subscription.response';
import {
  TenantCommercialSnapshotResponseDto,
  toTenantCommercialSnapshotResponseDto,
} from './dto/tenant-commercial-snapshot.response';

@Controller('tenancy/tenants')
export class TenantCommercialController {
  constructor(
    private readonly changeTenantPlanUseCase: ChangeTenantPlanUseCase,
    private readonly getTenantSubscriptionUseCase: GetTenantSubscriptionUseCase,
    private readonly listTenantEnabledProductsUseCase: ListTenantEnabledProductsUseCase,
    private readonly listTenantEntitlementsUseCase: ListTenantEntitlementsUseCase,
  ) {}

  @Get(':slug/subscription')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.SUBSCRIPTION_READ)
  async getTenantSubscription(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<SubscriptionResponseDto> {
    try {
      const subscription = await this.getTenantSubscriptionUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return toSubscriptionResponseDto(subscription);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof SubscriptionNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/products')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantEnabledProducts(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EnabledProductResponseDto[]> {
    try {
      const products = await this.listTenantEnabledProductsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return products.map((product) => toEnabledProductResponseDto(product));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Put(':slug/subscription')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.SUBSCRIPTION_MANAGE)
  async setTenantSubscription(
    @Param('slug') slug: string,
    @Body() body: SetTenantSubscriptionRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<TenantCommercialSnapshotResponseDto> {
    try {
      const snapshot = await this.changeTenantPlanUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        planKey: body.planKey,
        status: body.status ?? 'active',
        startedAt: body.startedAt ? new Date(body.startedAt) : undefined,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        trialEndsAt: body.trialEndsAt ? new Date(body.trialEndsAt) : null,
      });

      return toTenantCommercialSnapshotResponseDto(snapshot);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof PlanNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/entitlements')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantEntitlements(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EntitlementResponseDto[]> {
    try {
      const entitlements = await this.listTenantEntitlementsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return entitlements.map((entitlement) =>
        toEntitlementResponseDto(entitlement),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
