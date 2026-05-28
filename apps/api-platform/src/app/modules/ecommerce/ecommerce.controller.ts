import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  EcommerceLaunchPlanNotFoundError,
  GetTenantEcommerceLaunchPlanDetailUseCase,
  GetTenantEcommerceLaunchWorkspaceUseCase,
  ListTenantEcommerceLaunchPlansUseCase,
  RequestTenantEcommerceLaunchPlanActivationReadinessUseCase,
} from '@saas-platform/ecommerce-application';
import {
  ProductNotFoundError,
} from '@saas-platform/catalog-application';
import {
  TENANT_PERMISSIONS,
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  EcommerceLaunchPlanDetailResponseDto,
  toEcommerceLaunchPlanDetailResponseDto,
} from './dto/ecommerce-launch-plan-detail.response';
import {
  EcommerceLaunchPlanRegistryResponseDto,
  toEcommerceLaunchPlanRegistryResponseDto,
} from './dto/ecommerce-launch-plan-registry.response';
import {
  EcommerceLaunchWorkspaceResponseDto,
  toEcommerceLaunchWorkspaceResponseDto,
} from './dto/ecommerce-launch-workspace.response';
import {
  RequestEcommerceLaunchPlanActivationReadinessResponseDto,
  toRequestEcommerceLaunchPlanActivationReadinessResponseDto,
} from './dto/request-ecommerce-launch-plan-activation-readiness.response';

@Controller('ecommerce/tenants')
export class EcommerceController {
  constructor(
    private readonly getTenantEcommerceLaunchPlanDetailUseCase: GetTenantEcommerceLaunchPlanDetailUseCase,
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
    private readonly listTenantEcommerceLaunchPlansUseCase: ListTenantEcommerceLaunchPlansUseCase,
    private readonly requestTenantEcommerceLaunchPlanActivationReadinessUseCase: RequestTenantEcommerceLaunchPlanActivationReadinessUseCase,
  ) {}

  @Get(':slug/launch-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLaunchWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceLaunchWorkspaceResponseDto(workspace);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/launch-plans/:planId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLaunchPlanDetail(
    @Param('slug') slug: string,
    @Param('planId') planId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchPlanDetailResponseDto> {
    try {
      const detail =
        await this.getTenantEcommerceLaunchPlanDetailUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          planId,
        );

      return toEcommerceLaunchPlanDetailResponseDto(detail);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceLaunchPlanNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/launch-plans')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantLaunchPlans(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchPlanRegistryResponseDto> {
    try {
      const registry =
        await this.listTenantEcommerceLaunchPlansUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceLaunchPlanRegistryResponseDto(registry);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/launch-plans/:planId/request-activation-readiness')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantLaunchPlanActivationReadiness(
    @Param('slug') slug: string,
    @Param('planId') planId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceLaunchPlanActivationReadinessResponseDto> {
    try {
      const result =
        await this.requestTenantEcommerceLaunchPlanActivationReadinessUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          planId,
        );

      return toRequestEcommerceLaunchPlanActivationReadinessResponseDto(result);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceLaunchPlanNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
